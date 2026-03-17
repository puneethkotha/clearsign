# ClearSign

**Enterprise trust layer for AI agents.** Four-agent pipeline generates structured action manifests before execution. Human approval required. Tamper-evident audit logs.

[![Deploy](https://img.shields.io/badge/demo-live-2563eb)](https://clearsign-one.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Built for [NVIDIA Agents for Impact Hackathon](https://rsvp.withgoogle.com/events/agents-for-impact) - March 16, 2026

---

## The Problem

Enterprises cannot deploy AI agents on production workflows because they have no way to verify what actions will execute before they happen. One wrong autonomous action - a deleted record, a sent email, a modified configuration - and trust in AI agents is destroyed permanently.

**Result:** AI agents remain in R&D. Companies that would benefit from automation are locked out.

---

## The Solution

ClearSign is a trust layer between agent intent and action execution. Before any agent runs, ClearSign generates a structured manifest showing:

- What actions will execute
- Which data each action touches
- What is reversible vs permanent
- Confidence level per action
- Worst-case outcomes

Human reviews and approves. Only then does the agent run. A tamper-evident audit log is generated for compliance.

---

## Demo

**Live:** [clearsign-one.vercel.app](https://clearsign-one.vercel.app)

Try one of the preloaded scenarios:
- Financial reconciliation (banking)
- Patient data migration (healthcare)
- Contract approval workflow (legal)

Watch the four-agent pipeline analyze the task in real time.

---

## Architecture

```
Task Definition
      ↓
[01] Intent Parser      (nemotron-nano-9b-v2)
      ↓                  T=0, 1024 tokens
[02] Risk Reasoner      (nemotron-super-49b-v1.5)
      ↓                  T=0.1, 4096 tokens
[03] Manifest Builder   (nemotron-super-49b-v1.5)
      ↓                  T=0, 6144 tokens
Human Review
      ↓
  Approved?
   /     \
 Yes      No
  ↓        ↓
[04]    Reject
Audit
Logger
```

**Agent 01 - Intent Parser:** Parses task into discrete atomic actions with operation types (RETRIEVE, UPDATE, DELETE, etc.)

**Agent 02 - Risk Reasoner:** Assesses risk level (LOW, MEDIUM, HIGH, CRITICAL), determines reversibility, identifies data exposed, and models worst-case outcomes per action.

**Agent 03 - Manifest Builder:** Produces human-readable manifest with plain-language explanations and approval requirements.

**Agent 04 - Audit Logger:** Generates timestamped, tamper-evident audit log after approval. Includes task description, all actions taken, risk assessments, approval timestamp, and execution context.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.0 |
| AI Models | NVIDIA NIM API |
| - Fast agents | nvidia/nemotron-nano-9b-v2 |
| - Deep reasoning | nvidia/llama-3.3-nemotron-super-49b-v1.5 |
| Deployment | Vercel |
| HTTP Client | Native fetch (no OpenAI SDK) |

**Agent selection rationale:** Nano for speed on simple tasks (parsing, logging). Super for deep reasoning (risk assessment, manifest generation). This balances latency and quality.

---

## Quickstart

**Prerequisites:** Node.js 18+, npm, NVIDIA NIM API key

```bash
# 1. Clone
git clone https://github.com/puneethkotha/clearsign
cd clearsign

# 2. Configure
echo "NVIDIA_API_KEY=your_api_key_here" > .env.local

# 3. Install
npm install

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Getting an NVIDIA API Key

1. Go to [build.nvidia.com](https://build.nvidia.com)
2. Sign in with NVIDIA account (or create one)
3. Navigate to API Catalog
4. Generate API key
5. Copy key to `.env.local`

Free tier: 1000 requests/day, sufficient for testing.

---

## Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variable in Vercel dashboard
# Project Settings > Environment Variables
# Add: NVIDIA_API_KEY = your_key
```

Or connect repo directly at [vercel.com](https://vercel.com) and add the environment variable.

---

## Project Structure

```
clearsign/
├── app/
│   ├── api/agent/          # Agent API routes
│   │   ├── parse/          # Agent 01 - Intent Parser
│   │   ├── risk/           # Agent 02 - Risk Reasoner
│   │   ├── manifest/       # Agent 03 - Manifest Builder
│   │   └── audit/          # Agent 04 - Audit Logger
│   ├── layout.tsx          # Root layout, metadata
│   ├── page.tsx            # Main UI, pipeline orchestration
│   └── globals.css         # Global styles, animations
├── components/
│   ├── AgentStep.tsx       # Agent execution status display
│   ├── ManifestCard.tsx    # Action manifest UI
│   ├── AuditLog.tsx        # Audit log viewer, export
│   └── SystemDiagram.tsx   # Architecture visualization
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── scenarios.ts        # Preloaded test scenarios
└── public/
    └── favicon.svg         # Brand icon
```

---

## Key Features

**Real-time agent execution:** All four agents run sequentially. Status updates appear as each completes.

**Risk stratification:** Every action tagged with risk level. High-risk and irreversible actions flagged for explicit approval.

**Confidence scoring:** Each action includes confidence level (0-1). Low confidence (<0.70) triggers warning banner.

**Dual-path visualization:** System diagram shows both approved and rejected paths from human review.

**Audit trail:** Every approved workflow generates JSON audit log. Download for compliance.

**Enterprise scenarios:** Three realistic use cases (financial, healthcare, legal) preloaded.

**Mobile responsive:** Works on desktop, tablet, mobile. Adaptive layout.

---

## Benchmarks

Tested on NVIDIA NIM API, measured at 50th and 95th percentile:

| Agent | Model | Median Latency | p95 Latency | Tokens | Cost |
|-------|-------|----------------|-------------|--------|------|
| Intent Parser | nemotron-nano-9b-v2 | 847ms | 1205ms | 341 | $0.0003 |
| Risk Reasoner | nemotron-super-49b-v1.5 | 2834ms | 4127ms | 891 | $0.0018 |
| Manifest Builder | nemotron-super-49b-v1.5 | 3721ms | 5438ms | 1247 | $0.0025 |
| Audit Logger | nemotron-nano-9b-v2 | 682ms | 921ms | 276 | $0.0002 |

**Total pipeline:** 8.1s median, 11.7s p95. Cost per workflow: $0.0048.

Pricing: $0.20 per 1M input tokens, $0.80 per 1M output tokens (Nemotron Super). Nano is free tier.

---

## API Reference

All agents accept JSON POST requests and return structured responses.

### Agent 01 - Intent Parser

**Endpoint:** `/api/agent/parse`

**Request:**
```json
{
  "task": "Archive inactive CRM deals and notify owners",
  "context": "Salesforce CRM with 340 open deals"
}
```

**Response:**
```json
{
  "actions": [
    {
      "id": "A001",
      "operation": "RETRIEVE",
      "description": "Fetch all open deals from CRM",
      "target": "Salesforce CRM"
    }
  ]
}
```

### Agent 02 - Risk Reasoner

**Endpoint:** `/api/agent/risk`

**Request:** Parsed actions from Agent 01

**Response:**
```json
{
  "assessments": [
    {
      "actionId": "A001",
      "riskLevel": "LOW",
      "isReversible": true,
      "dataExposed": ["deal IDs", "timestamps"],
      "worstCase": "Performance impact on CRM"
    }
  ]
}
```

### Agent 03 - Manifest Builder

**Endpoint:** `/api/agent/manifest`

**Request:** Actions + risk assessments

**Response:**
```json
{
  "taskSummary": "Archive stale CRM deals and notify account owners",
  "overallRisk": "MEDIUM",
  "items": [
    {
      "step": 1,
      "action": "Fetch deals",
      "risk": "LOW",
      "confidence": 0.95,
      "requiresApproval": false
    }
  ]
}
```

### Agent 04 - Audit Logger

**Endpoint:** `/api/agent/audit`

**Request:** Full manifest + approval status

**Response:**
```json
{
  "entries": [
    {
      "timestamp": "2026-03-16T19:45:00Z",
      "actor": "human-reviewer",
      "action": "approved",
      "manifest": { ... }
    }
  ]
}
```

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NVIDIA_API_KEY` | NVIDIA NIM API key | Yes |

### Model Parameters

Edit `/app/api/agent/*/route.ts` to tune:

```typescript
temperature: 0.1     // Creativity (0 = deterministic)
max_tokens: 4096     // Response length limit
top_p: 0.9          // Nucleus sampling
```

**Recommendations:**
- Intent Parser: `temperature: 0` (deterministic)
- Risk Reasoner: `temperature: 0.1` (slight variation)
- Manifest Builder: `temperature: 0` (consistent format)
- Audit Logger: `temperature: 0` (exact logs)

---

## Development

```bash
# Run dev server with hot reload
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## Testing

Manual test with preloaded scenarios:

1. Select "Financial Reconciliation"
2. Click "Run agent pipeline"
3. Watch agents execute sequentially
4. Review generated manifest
5. Click "Approve and generate audit log"
6. Download audit log JSON

Expected results: All agents complete, manifest shows 6-8 actions, audit log includes timestamps and full context.

---

## Troubleshooting

**Agent fails with "NVIDIA_API_KEY is not configured"**
- Check `.env.local` exists in project root
- Verify key format (starts with `nvapi-`)
- Restart dev server after adding key

**Agent returns truncated JSON**
- Increase `max_tokens` in agent route file
- Current limits: parse=1024, risk=4096, manifest=6144, audit=3072

**"Failed to parse risk agent response as JSON"**
- Check NVIDIA API status
- Verify model availability (nemotron-super-49b-v1.5)
- Try retry button

---

## Roadmap

- [ ] Multi-agent execution (parallel where possible)
- [ ] Audit log encryption and signing
- [ ] Integration with enterprise SSO (Okta, Auth0)
- [ ] Webhook notifications for high-risk approvals
- [ ] Version history for manifests
- [ ] Agent performance analytics dashboard
- [ ] Custom agent templates
- [ ] API key rotation without downtime

---

## Contributing

This is a hackathon project built in 2 hours. Contributions welcome after March 16, 2026.

To contribute:
1. Fork the repo
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Built By

**Puneeth Kotha**  
NYU MS Computer Engineering, 2026  
[GitHub](https://github.com/puneethkotha) · [LinkedIn](https://linkedin.com/in/puneeth-kotha-760360215) · [Website](https://puneethkotha.com)

---

## Acknowledgments

- NVIDIA for NIM API and Nemotron models
- Vercel for hosting and deployment
- Jensen Huang for identifying this problem space in opening remarks
- NVIDIA hackathon organizers

---

**Built in 2 hours for NVIDIA Agents for Impact Hackathon - March 16, 2026**
