import { NextRequest, NextResponse } from 'next/server'
import { ParsedAction } from '@/lib/types'

const MODEL = 'nvidia/nemotron-nano-9b-v2'
const API_BASE = 'https://integrate.api.nvidia.com/v1'

const SYSTEM_PROMPT = `You are a precise task decomposition agent. Your only job is to break down a user's task description into a list of discrete, atomic actions. Each action must have exactly one verb and one target. Do not evaluate risk. Do not make recommendations. Only decompose.

Return only valid JSON matching this schema with no markdown, no explanation:
{
  "actions": [
    {
      "id": "A001",
      "verb": "SCAN",
      "target": "all package.json files in monorepo",
      "scope": "filesystem",
      "sideEffects": ["reads file metadata", "does not modify files"]
    }
  ]
}

Use IDs A001, A002, A003... in sequence.
Generate between 3 and 8 actions maximum.
Be specific about scope and side effects for each action.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { task, context } = body as { task: string; context: string }

    if (!task || !context) {
      return NextResponse.json({ error: 'task and context are required' }, { status: 400 })
    }

    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA_API_KEY is not configured' }, { status: 500 })
    }

    const userPrompt = `Task: ${task}\nContext: ${context}\nDecompose this task into atomic actions.`

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
        max_tokens: 1024,
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

    // Strip markdown fences if present
    const cleaned = content
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let parsed: { actions: ParsedAction[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: `Failed to parse agent response as JSON: ${cleaned.slice(0, 200)}` },
        { status: 500 }
      )
    }

    if (!parsed.actions || !Array.isArray(parsed.actions)) {
      return NextResponse.json(
        { error: 'Agent response missing actions array' },
        { status: 500 }
      )
    }

    return NextResponse.json({ actions: parsed.actions })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Intent parser failed: ${message}` }, { status: 500 })
  }
}
