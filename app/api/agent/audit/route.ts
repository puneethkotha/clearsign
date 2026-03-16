import { NextRequest, NextResponse } from 'next/server'
import { Manifest, AuditEntry } from '@/lib/types'

const MODEL = 'nvidia/nemotron-nano-9b-v2'
const API_BASE = 'https://integrate.api.nvidia.com/v1'

const SYSTEM_PROMPT = `You are an audit documentation agent. You receive an approved action manifest.
Your job is to generate a timestamped audit log entry for each action as if it has been executed successfully. Write each entry in past tense. Be precise and factual.
Do not add commentary. Do not evaluate whether the actions were correct.

Return only valid JSON with no markdown, no explanation:
{
  "entries": [
    {
      "sequence": 1,
      "timestamp": "2026-03-16T15:52:04Z",
      "action": "Scanned 12 package.json files across the monorepo",
      "outcome": "Identified 23 dependencies eligible for upgrade across 8 services",
      "approved": true
    }
  ]
}

Use realistic ISO 8601 timestamps starting from the current time, spaced 30 seconds apart.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { manifest } = body as { manifest: Manifest }

    if (!manifest) {
      return NextResponse.json({ error: 'manifest is required' }, { status: 400 })
    }

    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA_API_KEY is not configured' }, { status: 500 })
    }

    const manifestJson = JSON.stringify(manifest, null, 2)
    const userPrompt = `Approved manifest:\n${manifestJson}\n\nGenerate the execution audit log.`

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

    const cleaned = content
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let parsed: { entries: AuditEntry[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: `Failed to parse audit agent response as JSON: ${cleaned.slice(0, 200)}` },
        { status: 500 }
      )
    }

    if (!parsed.entries || !Array.isArray(parsed.entries)) {
      return NextResponse.json(
        { error: 'Audit agent response missing entries array' },
        { status: 500 }
      )
    }

    return NextResponse.json({ entries: parsed.entries })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Audit logger failed: ${message}` }, { status: 500 })
  }
}
