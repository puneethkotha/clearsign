import { NextRequest, NextResponse } from 'next/server'
import { ParsedAction, RiskAssessment } from '@/lib/types'

const MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1.5'
const API_BASE = 'https://integrate.api.nvidia.com/v1'

const SYSTEM_PROMPT = `You are a meticulous risk assessment agent specializing in AI agent safety.
You receive a list of actions an AI agent plans to take.
For each action, reason carefully about:
- What data will be read, modified, or deleted
- Whether the action can be undone after execution
- What the realistic worst-case outcome is if the action fails or runs incorrectly
- Your confidence that this action is safe to automate

Assign risk levels using these definitions:
LOW: fully reversible, no sensitive data, routine operation
MEDIUM: partially reversible or touches non-critical data
HIGH: difficult to reverse or touches important business data
CRITICAL: irreversible or touches sensitive personal or financial data

Return only valid JSON with no markdown, no explanation:
{
  "assessments": [
    {
      "actionId": "A001",
      "riskLevel": "LOW",
      "isReversible": true,
      "dataExposed": ["file paths", "package names"],
      "worstCase": "reads incorrect directory if path is misconfigured",
      "confidence": 0.94
    }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { actions, context } = body as { actions: ParsedAction[]; context: string }

    if (!actions || !context) {
      return NextResponse.json({ error: 'actions and context are required' }, { status: 400 })
    }

    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA_API_KEY is not configured' }, { status: 500 })
    }

    const actionsJson = JSON.stringify(actions, null, 2)
    const userPrompt = `Actions to assess:\n${actionsJson}\n\nContext:\n${context}\n\nAssess the risk of each action above.`

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json(
        { error: `NVIDIA API error (${response.status}): ${errText}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    const cleaned = content
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let parsed: { assessments: RiskAssessment[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: `Failed to parse risk agent response as JSON: ${cleaned.slice(0, 200)}` },
        { status: 500 }
      )
    }

    if (!parsed.assessments || !Array.isArray(parsed.assessments)) {
      return NextResponse.json(
        { error: 'Risk agent response missing assessments array' },
        { status: 500 }
      )
    }

    return NextResponse.json({ assessments: parsed.assessments })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Risk reasoner failed: ${message}` }, { status: 500 })
  }
}
