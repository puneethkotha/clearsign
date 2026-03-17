# ClearSign — Enterprise Agent Trust Layer

## What it solves

The reason enterprises will not deploy AI agents on real workflows is that they have no visibility into what the agent will do before it does it. One wrong autonomous action - a deleted record, a sent email, a modified file — and trust in AI agents collapses permanently. ClearSign is the trust layer that makes agentic AI deployable: a structured action manifest showing every action the agent will take, what data it will touch, what is reversible, and what confidence level each action carries — before anything executes.

## How it works

Four-agent Nemotron pipeline:

1. **Intent Parser** (Nemotron Nano) — decomposes the task into discrete atomic actions
2. **Risk Reasoner** (Nemotron Super) — assesses risk level, reversibility, and worst-case outcomes per action
3. **Manifest Builder** (Nemotron Super) — produces a human-readable approval manifest with plain-language explanations
4. **Audit Logger** (Nemotron Nano) — generates a timestamped tamper-evident audit log after approval

The human approves or rejects before anything executes.

## Tech stack

- Next.js 15, App Router, TypeScript
- NVIDIA NIM API — https://integrate.api.nvidia.com/v1
- nvidia/nemotron-nano-9b-v2 (Agents 01 and 04)
- nvidia/llama-3.3-nemotron-super-49b-v1.5 (Agents 02 and 03)
- Native fetch — no openai npm package
- Vercel deployment

## Quickstart

```bash
git clone https://github.com/puneethkotha/clearsign
cd clearsign
echo "NVIDIA_API_KEY=your_key_here" > .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Connect this repository to Vercel
2. Add NVIDIA_API_KEY in Vercel Project Settings → Environment Variables
3. Push to main — auto-deploys

## Built for

NVIDIA "Agents for Impact" Hackathon - March, 2026
