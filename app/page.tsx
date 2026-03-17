'use client'

import { useState, useCallback } from 'react'
import {
  ParsedAction,
  RiskAssessment,
  Manifest,
  AuditEntry,
  AgentState,
} from '@/lib/types'
import { scenarios } from '@/lib/scenarios'
import AgentStep from '@/components/AgentStep'
import ManifestCard from '@/components/ManifestCard'
import AuditLog from '@/components/AuditLog'
import SystemDiagram from '@/components/SystemDiagram'

const riskBannerColors: Record<string, { bg: string; border: string; text: string }> = {
  LOW: { bg: 'rgba(74,222,128,0.05)', border: 'rgba(74,222,128,0.25)', text: '#4ade80' },
  MEDIUM: { bg: 'rgba(250,204,21,0.05)', border: 'rgba(250,204,21,0.25)', text: '#facc15' },
  HIGH: { bg: 'rgba(251,146,60,0.05)', border: 'rgba(251,146,60,0.25)', text: '#fb923c' },
  CRITICAL: { bg: 'rgba(248,113,113,0.05)', border: 'rgba(248,113,113,0.25)', text: '#f87171' },
}

const initialAgentState: AgentState = {
  parse: 'idle',
  risk: 'idle',
  manifest: 'idle',
  audit: 'idle',
}

export default function Home() {
  const [task, setTask] = useState('')
  const [context, setContext] = useState('')
  const [activeView, setActiveView] = useState<'mission' | 'architecture'>('mission')
  const [activeScenario, setActiveScenario] = useState<number | null>(null)
  const [agentState, setAgentState] = useState<AgentState>(initialAgentState)
  const [parsedActions, setParsedActions] = useState<ParsedAction[] | null>(null)
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[] | null>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [auditEntries, setAuditEntries] = useState<AuditEntry[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasRun, setHasRun] = useState(false)

  const loadScenario = (index: number) => {
    setActiveScenario(index)
    setTask(scenarios[index].task)
    setContext(scenarios[index].context)
  }

  const resetPipelineState = () => {
    setAgentState(initialAgentState)
    setParsedActions(null)
    setRiskAssessments(null)
    setManifest(null)
    setAuditEntries(null)
    setIsApproved(false)
    setError(null)
  }

  const runPipeline = useCallback(async () => {
    if (!task.trim() || !context.trim()) {
      setError('Please fill in both the task description and system context before running the pipeline.')
      return
    }

    setIsRunning(true)
    resetPipelineState()
    setHasRun(true)

    // Agent 01: Intent Parser
    setAgentState((s) => ({ ...s, parse: 'running' }))
    let actions: ParsedAction[]
    try {
      const res = await fetch('/api/agent/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, context }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setAgentState((s) => ({ ...s, parse: 'error' }))
        setError(`Intent Parser failed: ${data.error ?? 'Unable to decompose task. Please try rephrasing your task description.'}`)
        setIsRunning(false)
        return
      }
      actions = data.actions
      setParsedActions(actions)
      setAgentState((s) => ({ ...s, parse: 'complete' }))
    } catch (e) {
      setAgentState((s) => ({ ...s, parse: 'error' }))
      setError(`Network error while parsing task. Please check your connection and try again.`)
      setIsRunning(false)
      return
    }

    // Agent 02: Risk Reasoner
    setAgentState((s) => ({ ...s, risk: 'running' }))
    let assessments: RiskAssessment[]
    try {
      const res = await fetch('/api/agent/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions, context }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setAgentState((s) => ({ ...s, risk: 'error' }))
        setError(`Risk Reasoner failed: ${data.error ?? 'Unable to assess risk. This may be due to API rate limits.'}`)
        setIsRunning(false)
        return
      }
      assessments = data.assessments
      setRiskAssessments(assessments)
      setAgentState((s) => ({ ...s, risk: 'complete' }))
    } catch (e) {
      setAgentState((s) => ({ ...s, risk: 'error' }))
      setError(`Network error during risk assessment. Please try again in a moment.`)
      setIsRunning(false)
      return
    }

    // Agent 03: Manifest Builder
    setAgentState((s) => ({ ...s, manifest: 'running' }))
    try {
      const res = await fetch('/api/agent/manifest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions, assessments, task }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setAgentState((s) => ({ ...s, manifest: 'error' }))
        setError(`Manifest Builder failed: ${data.error ?? 'Unable to generate approval manifest.'}`)
        setIsRunning(false)
        return
      }
      setManifest(data.manifest)
      setAgentState((s) => ({ ...s, manifest: 'complete' }))
    } catch (e) {
      setAgentState((s) => ({ ...s, manifest: 'error' }))
      setError(`Network error while building manifest. Please try again.`)
      setIsRunning(false)
      return
    }

    setIsRunning(false)
  }, [task, context])

  const handleApproval = useCallback(async () => {
    if (!manifest) return
    setIsApproved(true)
    setAgentState((s) => ({ ...s, audit: 'running' }))
    try {
      const res = await fetch('/api/agent/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manifest }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setAgentState((s) => ({ ...s, audit: 'error' }))
        setError(`Audit Logger failed: ${data.error ?? 'Unable to generate audit log.'}`)
        return
      }
      setAuditEntries(data.entries)
      setAgentState((s) => ({ ...s, audit: 'complete' }))
    } catch (e) {
      setAgentState((s) => ({ ...s, audit: 'error' }))
      setError(`Network error while generating audit log. Please try again.`)
    }
  }, [manifest])

  const handleReject = () => {
    resetPipelineState()
    setHasRun(false)
    setIsRunning(false)
  }

  const handleNewTask = () => {
    resetPipelineState()
    setHasRun(false)
    setIsRunning(false)
    setTask('')
    setContext('')
    setActiveScenario(null)
  }

  const pipelineActive = hasRun || isRunning

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 800px 600px at 50% -100px, rgba(34,211,238,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          background: 'rgba(9,9,11,0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--text)',
              fontFamily: 'var(--mono)',
            }}
          >
            ClearSign
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>
            Agent trust layer
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--mono)',
                color: '#22d3ee',
                border: '1px solid rgba(34,211,238,0.4)',
                borderRadius: '3px',
                padding: '2px 7px',
                letterSpacing: '0.04em',
              }}
            >
              NVIDIA NIM
            </span>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--mono)',
                color: 'var(--muted)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                padding: '2px 7px',
                letterSpacing: '0.04em',
              }}
            >
              Nemotron
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 6px rgba(74,222,128,0.6)',
              }}
            />
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              agents ready
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        style={{
          position: 'relative',
          zIndex: 10,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 24px',
          display: 'flex',
          background: 'rgba(9,9,11,0.6)',
        }}
      >
        {(['mission', 'architecture'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeView === view ? '2px solid #22d3ee' : '2px solid transparent',
              color: activeView === view ? '#22d3ee' : 'var(--muted)',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
              marginBottom: '-1px',
            }}
          >
            {view === 'mission' ? 'Mission control' : 'System architecture'}
          </button>
        ))}
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {activeView === 'mission' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '360px 1fr',
              minHeight: 'calc(100vh - 103px)',
            }}
            className="mission-layout"
          >
            {/* Left column */}
            <div
              style={{
                borderRight: '1px solid rgba(255,255,255,0.06)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'auto',
              }}
            >
              {/* Scenarios */}
              <div className="card" style={{ padding: '16px' }}>
                <div className="label" style={{ marginBottom: '12px' }}>
                  Preloaded scenarios
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {scenarios.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => loadScenario(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: activeScenario === i ? 'rgba(34,211,238,0.05)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: activeScenario === i ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.06)',
                        borderLeft: activeScenario === i ? '2px solid #22d3ee' : '2px solid transparent',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: activeScenario === i ? '#22d3ee' : 'var(--text)',
                          fontWeight: activeScenario === i ? 500 : 400,
                        }}
                      >
                        {s.label}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M4.5 3L7.5 6L4.5 9"
                          stroke={activeScenario === i ? '#22d3ee' : 'rgba(113,113,122,0.6)'}
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Task input */}
              <div className="card" style={{ padding: '16px' }}>
                <div className="label" style={{ marginBottom: '14px' }}>
                  Task definition
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>
                    Describe the task
                  </label>
                  <textarea
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    rows={5}
                    placeholder="Describe what you want the agent to do. Be specific about the goal, not the steps."
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '4px',
                      color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      padding: '10px',
                      resize: 'vertical',
                      outline: 'none',
                      lineHeight: '1.6',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>
                    System context
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={3}
                    placeholder="Connected systems, data sources, access permissions, stakeholders."
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '4px',
                      color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      padding: '10px',
                      resize: 'vertical',
                      outline: 'none',
                      lineHeight: '1.6',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                {/* Model indicators */}
                <div
                  style={{
                    padding: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    marginBottom: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  {[
                    { label: 'Parser and auditor', model: 'nemotron-nano-9b-v2' },
                    { label: 'Risk and manifest', model: 'nemotron-super-49b-v1.5' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#22d3ee',
                          flexShrink: 0,
                        }}
                      />
                      <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', flex: 1 }}>
                        {row.label}
                      </span>
                      <span className="mono" style={{ fontSize: '10px', color: 'rgba(228,228,231,0.5)' }}>
                        {row.model}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary"
                  onClick={runPipeline}
                  disabled={isRunning}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isRunning ? (
                    <>
                      <SpinnerIcon />
                      Agents running...
                    </>
                  ) : (
                    'Run agent pipeline'
                  )}
                </button>

                {error && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '12px',
                      background: 'rgba(248,113,113,0.06)',
                      border: '1px solid rgba(248,113,113,0.25)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5" />
                      <path d="M8 4V8" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="8" cy="11" r="0.8" fill="#f87171" />
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#f87171',
                          lineHeight: '1.5',
                        }}
                      >
                        {error}
                      </div>
                      <button
                        onClick={() => {
                          setError(null)
                          runPipeline()
                        }}
                        style={{
                          marginTop: '8px',
                          background: 'transparent',
                          border: '1px solid rgba(248,113,113,0.3)',
                          borderRadius: '3px',
                          color: '#f87171',
                          fontFamily: 'var(--mono)',
                          fontSize: '10px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              {!pipelineActive ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '400px',
                    gap: '12px',
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" stroke="rgba(63,63,70,0.6)" strokeWidth="1" />
                    <line x1="16" y1="4" x2="16" y2="28" stroke="rgba(63,63,70,0.6)" strokeWidth="1" />
                    <line x1="4" y1="16" x2="28" y2="16" stroke="rgba(63,63,70,0.6)" strokeWidth="1" />
                    <circle cx="16" cy="16" r="2" fill="rgba(63,63,70,0.6)" />
                  </svg>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '6px' }}>
                      Define a task and run the pipeline.
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--very-muted)' }}>
                      The four-agent sequence will appear here as each step completes.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {/* Agent steps */}
                  <div style={{ marginBottom: '32px' }}>
                    <AgentStep
                      number="01"
                      name="Intent parser"
                      model="nvidia/nemotron-nano-9b-v2"
                      status={agentState.parse}
                      nextStatus={agentState.risk}
                      summaryData={{ parsedActions: parsedActions ?? undefined }}
                    />
                    <AgentStep
                      number="02"
                      name="Risk reasoner"
                      model="nvidia/llama-3.3-nemotron-super-49b-v1.5"
                      status={agentState.risk}
                      nextStatus={agentState.manifest}
                      summaryData={{ riskAssessments: riskAssessments ?? undefined }}
                    />
                    <AgentStep
                      number="03"
                      name="Manifest builder"
                      model="nvidia/llama-3.3-nemotron-super-49b-v1.5"
                      status={agentState.manifest}
                      nextStatus={agentState.audit}
                      summaryData={{ manifest: manifest ?? undefined }}
                    />
                    <AgentStep
                      number="04"
                      name="Audit logger"
                      model="nvidia/nemotron-nano-9b-v2"
                      status={agentState.audit}
                      isLast
                      summaryData={{ auditCount: auditEntries?.length }}
                    />
                  </div>

                  {/* Manifest */}
                  {manifest && (
                    <div style={{ marginBottom: '24px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div className="label" style={{ marginBottom: '4px' }}>
                            Action manifest
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--text)', maxWidth: '500px', lineHeight: '1.5' }}>
                            {manifest.taskSummary}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <StatBadge label="Total actions" value={manifest.totalActions} />
                          <StatBadge
                            label="Irreversible"
                            value={manifest.irreversibleCount}
                            color={manifest.irreversibleCount > 0 ? '#facc15' : undefined}
                          />
                          <StatBadge
                            label="Critical"
                            value={manifest.criticalCount}
                            color={manifest.criticalCount > 0 ? '#f87171' : undefined}
                          />
                        </div>
                      </div>

                      {/* Risk banner */}
                      {riskBannerColors[manifest.overallRisk] && (
                        <div
                          style={{
                            padding: '12px 16px',
                            background: riskBannerColors[manifest.overallRisk].bg,
                            border: `1px solid ${riskBannerColors[manifest.overallRisk].border}`,
                            borderRadius: '4px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <span
                              style={{
                                fontSize: '12px',
                                fontFamily: 'var(--mono)',
                                fontWeight: 600,
                                color: riskBannerColors[manifest.overallRisk].text,
                                letterSpacing: '0.06em',
                              }}
                            >
                              {manifest.overallRisk}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>overall risk</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'right' }}>
                            {manifest.agentReasoning}
                          </p>
                        </div>
                      )}

                      {/* Action cards */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {manifest.items.map((item) => (
                          <ManifestCard key={item.actionId} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approval section */}
                  {manifest && !isApproved && (
                    <div
                      className="card"
                      style={{
                        padding: '20px',
                        borderColor: 'rgba(34,211,238,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '24px',
                        flexWrap: 'wrap',
                        marginBottom: '24px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                          Review complete
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', maxWidth: '380px', lineHeight: '1.5' }}>
                          You have reviewed the action manifest above. Approving will generate the audit log.
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                        <button
                          onClick={handleReject}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(248,113,113,0.4)',
                            borderRadius: '4px',
                            color: '#f87171',
                            fontFamily: 'var(--mono)',
                            fontSize: '12px',
                            padding: '9px 16px',
                            cursor: 'pointer',
                          }}
                        >
                          Reject task
                        </button>
                        <button
                          onClick={handleApproval}
                          style={{
                            background: '#22d3ee',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'var(--bg)',
                            fontFamily: 'var(--mono)',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '9px 16px',
                            cursor: 'pointer',
                            letterSpacing: '0.03em',
                          }}
                        >
                          Approve and generate audit log
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Audit log */}
                  {auditEntries && auditEntries.length > 0 && (
                    <>
                      <AuditLog entries={auditEntries} />
                      
                      {/* New Task button after completion */}
                      <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <button
                          onClick={handleNewTask}
                          style={{
                            background: 'rgba(34,211,238,0.08)',
                            border: '1px solid rgba(34,211,238,0.3)',
                            borderRadius: '4px',
                            color: '#22d3ee',
                            fontFamily: 'var(--mono)',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '10px 20px',
                            cursor: 'pointer',
                            letterSpacing: '0.03em',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(34,211,238,0.12)'
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(34,211,238,0.08)'
                            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'
                          }}
                        >
                          Start new task
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ArchitectureView />
        )}
      </main>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}
    >
      <circle cx="6" cy="6" r="5" stroke="rgba(9,9,11,0.3)" strokeWidth="1.5" />
      <path d="M6 1C3.24 1 1 3.24 1 6" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StatBadge({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: color ? `${color}10` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${color ? `${color}30` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '4px',
        textAlign: 'center',
        minWidth: '72px',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontFamily: 'var(--mono)',
          fontWeight: 600,
          color: color ?? 'var(--text)',
          lineHeight: 1,
          marginBottom: '3px',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.06em', fontFamily: 'var(--mono)' }}>
        {label.toUpperCase()}
      </div>
    </div>
  )
}

function ArchitectureView() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
        ClearSign — enterprise agent trust layer
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.7', marginBottom: '24px', maxWidth: '680px' }}>
        ClearSign addresses the primary blocker to enterprise AI agent adoption:
        the inability to verify what an agent will do before it acts.
        A four-agent Nemotron pipeline decomposes any task, assesses risk per action,
        generates a human-readable approval manifest, and produces a tamper-evident audit log.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { value: '4 agents', label: 'pipeline depth' },
          { value: '2 Nemotron models', label: 'differentiated roles' },
          { value: '0 databases', label: 'fully stateless' },
        ].map((fact) => (
          <div key={fact.label} className="card" style={{ padding: '16px 20px', textAlign: 'center', minWidth: '140px' }}>
            <div style={{ fontSize: '15px', fontFamily: 'var(--mono)', fontWeight: 600, color: '#22d3ee', marginBottom: '4px' }}>
              {fact.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
              {fact.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Jensen callout */}
      <div
        style={{
          background: 'rgba(34,211,238,0.03)',
          border: '1px solid rgba(34,211,238,0.15)',
          borderLeft: '3px solid #22d3ee',
          borderRadius: '4px',
          padding: '20px 24px',
          marginBottom: '48px',
        }}
      >
        <div className="label" style={{ marginBottom: '10px', color: '#22d3ee' }}>
          From Jensen Huang's GTC 2026 keynote — March 16, 2026
        </div>
        <blockquote
          style={{
            fontSize: '14px',
            color: 'var(--text)',
            lineHeight: '1.7',
            fontStyle: 'italic',
            marginBottom: '12px',
          }}
        >
          "Every company in the world today needs an agentic strategy.
          This is as big a deal as Linux. NVIDIA's priority is making agents enterprise-secure."
        </blockquote>
        <p style={{ fontSize: '13px', color: '#22d3ee', fontWeight: 500 }}>
          ClearSign is the answer to that challenge.
        </p>
      </div>

      {/* Architecture diagram */}
      <div style={{ marginBottom: '48px' }}>
        <div className="label" style={{ marginBottom: '16px' }}>
          System architecture
        </div>
        <div className="card" style={{ padding: '24px', overflow: 'hidden' }}>
          <SystemDiagram />
        </div>
      </div>

      {/* Pipeline benchmark */}
      <div style={{ marginBottom: '48px' }}>
        <div className="label" style={{ marginBottom: '4px' }}>Pipeline benchmark</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '20px' }}>
          Measured live — GDPR compliance sweep scenario, 5 actions, NVIDIA NIM serverless endpoints
        </div>
        <PipelineBenchmark />
      </div>

      {/* Model comparison */}
      <div style={{ marginBottom: '48px' }}>
        <div className="label" style={{ marginBottom: '20px' }}>Model roles — why two Nemotron models</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ModelCard
            label="Nano — speed tier"
            model="nvidia/nvidia-nemotron-nano-9b-v2"
            agents={['Agent 01 — Intent Parser', 'Agent 04 — Audit Logger']}
            why="Used for structured decomposition and log generation — tasks that need speed and consistent JSON output, not deep reasoning."
            latency="~9s"
            color="#22d3ee"
          />
          <ModelCard
            label="Super — reasoning tier"
            model="nvidia/llama-3.3-nemotron-super-49b-v1.5"
            agents={['Agent 02 — Risk Reasoner', 'Agent 03 — Manifest Builder']}
            why="Used for risk analysis and plain-language generation — tasks that require chain-of-thought reasoning over ambiguous consequences."
            latency="~20s"
            color="#a78bfa"
          />
        </div>
      </div>

      {/* Technical details */}
      <div style={{ marginBottom: '48px' }}>
        <div className="label" style={{ marginBottom: '16px' }}>Technical implementation</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { num: '01', name: 'Intent Parser', model: 'nvidia-nemotron-nano-9b-v2', desc: 'Decomposes user tasks into atomic, verifiable actions with explicit scope and side effects.', temp: 'T=0', tokens: '2048 tok' },
            { num: '02', name: 'Risk Reasoner', model: 'llama-3.3-nemotron-super-49b-v1.5', desc: 'Evaluates each action for reversibility, data sensitivity, and worst-case operational impact.', temp: 'T=0.1', tokens: '2048 tok' },
            { num: '03', name: 'Manifest Builder', model: 'llama-3.3-nemotron-super-49b-v1.5', desc: 'Generates human-readable approval documents that non-technical stakeholders can review.', temp: 'T=0', tokens: '2048 tok' },
            { num: '04', name: 'Audit Logger', model: 'nvidia-nemotron-nano-9b-v2', desc: 'Creates timestamped execution records in past tense for compliance and forensic analysis.', temp: 'T=0', tokens: '2048 tok' },
          ].map((a) => (
            <div key={a.num} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 600 }}>{a.num}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>Agent {a.num} — {a.name}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '10px' }}>{a.desc}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: '10px', color: '#22d3ee', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '3px', padding: '2px 6px' }}>{a.model}</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px', padding: '2px 6px' }}>{a.temp}</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px', padding: '2px 6px' }}>{a.tokens}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// Benchmark data from live test runs
const BENCHMARK_DATA = [
  { agent: '01', name: 'Intent parser', model: 'Nano', ms: 9348, color: '#22d3ee', actions: '5 actions parsed' },
  { agent: '02', name: 'Risk reasoner', model: 'Super', ms: 13075, color: '#a78bfa', actions: '5 risk assessments' },
  { agent: '03', name: 'Manifest builder', model: 'Super', ms: 27325, color: '#a78bfa', actions: '5 manifest items' },
  { agent: '04', name: 'Audit logger', model: 'Nano', ms: 21780, color: '#22d3ee', actions: '5 audit entries' },
]
const TOTAL_MS = BENCHMARK_DATA.reduce((s, d) => s + d.ms, 0)
const MAX_MS = Math.max(...BENCHMARK_DATA.map((d) => d.ms))

function PipelineBenchmark() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      {/* Header stats row */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total pipeline', value: (TOTAL_MS / 1000).toFixed(1) + 's', sub: 'end-to-end' },
          { label: 'Fastest agent', value: (Math.min(...BENCHMARK_DATA.map((d) => d.ms)) / 1000).toFixed(1) + 's', sub: 'Agent 01 (Nano)' },
          { label: 'Deepest reasoning', value: (MAX_MS / 1000).toFixed(1) + 's', sub: 'Agent 03 (Super)' },
          { label: 'API calls', value: '4', sub: 'all NIM endpoints' },
        ].map((s) => (
          <div key={s.label}>
            <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: '#22d3ee', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>{s.label}</div>
            <div className="mono" style={{ fontSize: '9px', color: 'var(--very-muted)', marginTop: '1px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {BENCHMARK_DATA.map((d) => {
          const pct = (d.ms / MAX_MS) * 100
          const secs = (d.ms / 1000).toFixed(1)
          const share = Math.round((d.ms / TOTAL_MS) * 100)
          return (
            <div key={d.agent}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="mono" style={{ fontSize: '10px', color: d.color, minWidth: '20px', fontWeight: 600 }}>{d.agent}</span>
                <span style={{ fontSize: '12px', color: 'var(--text)', minWidth: '130px' }}>{d.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)', background: d.model === 'Super' ? 'rgba(167,139,250,0.08)' : 'rgba(34,211,238,0.06)', border: `1px solid ${d.model === 'Super' ? 'rgba(167,139,250,0.25)' : 'rgba(34,211,238,0.2)'}`, borderRadius: '3px', padding: '1px 6px', fontFamily: 'var(--mono)' }}>{d.model}</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: 'auto' }}>{d.actions}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px' }} />
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: pct + '%',
                      background: d.color,
                      borderRadius: '3px',
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text)', minWidth: '36px', textAlign: 'right' }}>{secs}s</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--very-muted)', minWidth: '32px', textAlign: 'right' }}>{share}%</span>
              </div>
            </div>
          )
        })}

        {/* Total bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '20px' }} />
          <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px' }}>
            <div style={{ height: '100%', width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: '1px' }} />
          </div>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 600, minWidth: '36px', textAlign: 'right' }}>{(TOTAL_MS / 1000).toFixed(1)}s</span>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', minWidth: '32px', textAlign: 'right' }}>100%</span>
        </div>
      </div>

      <div style={{ marginTop: '16px', fontSize: '10px', color: 'var(--very-muted)', fontFamily: 'var(--mono)' }}>
        Measured on NVIDIA NIM serverless — GDPR compliance sweep (180k records scenario) — March 16, 2026
      </div>
    </div>
  )
}

function ModelCard({ label, model, agents, why, latency, color }: {
  label: string; model: string; agents: string[]; why: string; latency: string; color: string
}) {
  return (
    <div className="card" style={{ padding: '20px', borderColor: `${color}20` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{label}</div>
          <div className="mono" style={{ fontSize: '10px', color }}>{model}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: '18px', fontWeight: 700, color, lineHeight: 1 }}>{latency}</div>
          <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>avg latency</div>
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {agents.map((a) => (
          <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{a}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--very-muted)', lineHeight: '1.5', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>{why}</div>
    </div>
  )
}
