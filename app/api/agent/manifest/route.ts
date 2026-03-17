import { NextRequest, NextResponse } from 'next/server'
import { ParsedAction, RiskAssessment, Manifest } from '@/lib/types'

const MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1.5'
const API_BASE = 'https://integrate.api.nvidia.com/v1'

const SYSTEM_PROMPT = `You are a communication agent responsible for translating technical action plans into clear, human-readable documents that non-technical stakeholders can approve.
You receive a list of parsed actions and their risk assessments.
Your job is to produce a final action manifest that:
- Explains each action in plain English that any business user can understand
- Preserves technical accuracy without technical jargon
- Sequences actions in logical execution order
- Provides a rationale for why each action is necessary
- Flags actions that require explicit human approval before execution
- Produces an overall risk summary

Actions require explicit approval if: riskLevel is HIGH or CRITICAL, or isReversible is false.

Return only valid JSON with no markdown, no explanation:
{
  "taskSummary": "one sentence describing what this task will accomplish",
  "totalActions": 5,
  "irreversibleCount": 2,
  "criticalCount": 0,
  "overallRisk": "MEDIUM",
  "agentReasoning": "two to three sentences explaining your assessment of the overall task",
  "items": [
    {
      "actionId": "A001",
      "sequence": 1,
      "plainLanguage": "Scan all package files across the codebase to identify which ones exist",
      "verb": "SCAN",
      "target": "package.json files",
      "riskLevel": "LOW",
      "isReversible": true,
      "confidence": 0.94,
      "rationale": "Required first step to understand the scope of dependencies needing updates",
      "requiresApproval": false
    }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { actions, assessments, task } = body as {
      actions: ParsedAction[]
      assessments: RiskAssessment[]
      task: string
    }

    if (!actions || !assessments || !task) {
      return NextResponse.json(
        { error: 'actions, assessments, and task are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA_API_KEY is not configured' }, { status: 500 })
    }

    const actionsJson = JSON.stringify(actions, null, 2)
    const assessmentsJson = JSON.stringify(assessments, null, 2)
    const userPrompt = `Actions:\n${actionsJson}\n\nRisk Assessments:\n${assessmentsJson}\n\nOriginal task: ${task}\n\nBuild the human-readable action manifest.`

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
        temperature: 0,
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

    let parsed: { manifest?: Manifest } & Manifest
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: `Failed to parse manifest agent response as JSON: ${cleaned.slice(0, 200)}` },
        { status: 500 }
      )
    }

    // Handle both { manifest: {...} } and direct manifest object
    const manifest: Manifest = parsed.manifest ?? parsed

    if (!manifest.items || !Array.isArray(manifest.items)) {
      return NextResponse.json(
        { error: 'Manifest agent response missing items array' },
        { status: 500 }
      )
    }

    return NextResponse.json({ manifest })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Manifest builder failed: ${message}` }, { status: 500 })
  }
}
