'use client'

import { AgentStatus, ParsedAction, RiskAssessment, Manifest } from '@/lib/types'

interface AgentStepProps {
  number: string
  name: string
  model: string
  status: AgentStatus
  isLast?: boolean
  nextStatus?: AgentStatus
  summaryData?: {
    parsedActions?: ParsedAction[]
    riskAssessments?: RiskAssessment[]
    manifest?: Manifest
    auditCount?: number
  }
}

function StatusIcon({ status }: { status: AgentStatus }) {
  if (status === 'idle') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="rgba(113,113,122,0.5)" strokeWidth="1" />
      </svg>
    )
  }
  if (status === 'running') {
    return (
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{
            background: 'rgba(34,211,238,0.3)',
            animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
          }}
        />
        <span
          className="relative inline-flex h-3 w-3 rounded-full"
          style={{ background: '#22d3ee' }}
        />
      </span>
    )
  }
  if (status === 'complete') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#4ade80" fillOpacity="0.15" />
        <circle cx="10" cy="10" r="9" stroke="#4ade80" strokeWidth="1" />
        <path
          d="M6 10.5L8.5 13L14 7.5"
          stroke="#4ade80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (status === 'error') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#f87171" fillOpacity="0.15" />
        <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1" />
        <path
          d="M7 7L13 13M13 7L7 13"
          stroke="#f87171"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return null
}

function ConnectorLine({ status, nextStatus }: { status: AgentStatus; nextStatus: AgentStatus }) {
  let color = 'rgba(63,63,70,0.6)'
  let dasharray = '4 4'

  if (status === 'complete' && nextStatus === 'complete') {
    color = '#22d3ee'
    dasharray = 'none'
  } else if (status === 'complete' && nextStatus === 'running') {
    color = '#22d3ee'
    dasharray = '4 4'
  }

  return (
    <div className="flex justify-center" style={{ paddingLeft: '24px' }}>
      <div
        style={{
          width: '1px',
          height: '20px',
          background:
            dasharray === 'none'
              ? color
              : `repeating-linear-gradient(to bottom, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`,
        }}
      />
    </div>
  )
}

export default function AgentStep({
  number,
  name,
  model,
  status,
  isLast,
  nextStatus,
  summaryData,
}: AgentStepProps) {
  const isActive = status === 'running' || status === 'complete'

  const riskCounts = summaryData?.riskAssessments
    ? {
        high: summaryData.riskAssessments.filter((r) => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').length,
        medium: summaryData.riskAssessments.filter((r) => r.riskLevel === 'MEDIUM').length,
        low: summaryData.riskAssessments.filter((r) => r.riskLevel === 'LOW').length,
      }
    : null

  return (
    <>
      <div
        className="card"
        style={{
          padding: '16px',
          borderColor:
            status === 'running'
              ? 'rgba(34,211,238,0.3)'
              : status === 'complete'
              ? 'rgba(74,222,128,0.2)'
              : status === 'error'
              ? 'rgba(248,113,113,0.3)'
              : 'rgba(255,255,255,0.06)',
          transition: 'border-color 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span
                className="mono"
                style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 600 }}
              >
                {number}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                {name}
              </span>
            </div>
            <div
              className="mono"
              style={{ fontSize: '10px', color: 'var(--muted)' }}
            >
              {model}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <StatusIcon status={status} />
          </div>
        </div>

        {status === 'complete' && summaryData && (
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {summaryData.parsedActions && (
              <div>
                <div
                  style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}
                >
                  Identified {summaryData.parsedActions.length} atomic actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {summaryData.parsedActions.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className="mono"
                      style={{ fontSize: '10px', color: 'var(--muted)', display: 'flex', gap: '6px' }}
                    >
                      <span style={{ color: '#22d3ee', minWidth: '32px' }}>{a.id}</span>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>
                        {a.verb} {a.target}
                      </span>
                    </div>
                  ))}
                  {summaryData.parsedActions.length > 5 && (
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--very-muted)' }}>
                      +{summaryData.parsedActions.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
            {riskCounts && (
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Risk assessed -{' '}
                {riskCounts.high > 0 && (
                  <span style={{ color: '#f87171' }}>{riskCounts.high} high</span>
                )}
                {riskCounts.high > 0 && riskCounts.medium > 0 && ', '}
                {riskCounts.medium > 0 && (
                  <span style={{ color: '#facc15' }}>{riskCounts.medium} medium</span>
                )}
                {(riskCounts.high > 0 || riskCounts.medium > 0) && riskCounts.low > 0 && ', '}
                {riskCounts.low > 0 && (
                  <span style={{ color: '#4ade80' }}>{riskCounts.low} low</span>
                )}
              </div>
            )}
            {summaryData.manifest && (
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Manifest ready -{' '}
                <span style={{ color: 'var(--text)' }}>{summaryData.manifest.totalActions} actions</span>
                {summaryData.manifest.irreversibleCount > 0 && (
                  <span>
                    ,{' '}
                    <span style={{ color: '#facc15' }}>
                      {summaryData.manifest.irreversibleCount} require approval
                    </span>
                  </span>
                )}
              </div>
            )}
            {summaryData.auditCount !== undefined && (
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Audit log generated -{' '}
                <span style={{ color: '#4ade80' }}>{summaryData.auditCount} entries</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!isLast && nextStatus !== undefined && (
        <ConnectorLine status={status} nextStatus={nextStatus} />
      )}
    </>
  )
}
