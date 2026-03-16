'use client'

import { ManifestItem } from '@/lib/types'

interface ManifestCardProps {
  item: ManifestItem
}

function ReverseIcon({ reversible }: { reversible: boolean }) {
  if (reversible) {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <path
          d="M2 6C2 3.79 3.79 2 6 2C7.38 2 8.6 2.7 9.31 3.77L10 3.5V5.5H8L8.84 4.84C8.35 4.01 7.24 3.5 6 3.5C4.62 3.5 3.5 4.62 3.5 6C3.5 7.38 4.62 8.5 6 8.5C6.78 8.5 7.47 8.17 7.95 7.63L9.01 8.5C8.27 9.35 7.2 9.9 6 9.9C3.62 9.9 2 8.21 2 6Z"
          fill="#4ade80"
        />
      </svg>
    )
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M6 1L6 11M3 8L6 11L9 8"
        stroke="#f87171"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 4H10" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

const riskColors: Record<string, { text: string; bg: string; border: string }> = {
  LOW: { text: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.3)' },
  MEDIUM: { text: '#facc15', bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.3)' },
  HIGH: { text: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.3)' },
  CRITICAL: { text: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)' },
}

export default function ManifestCard({ item }: ManifestCardProps) {
  const riskStyle = riskColors[item.riskLevel] ?? riskColors.LOW
  const needsAttention = item.requiresApproval

  return (
    <div
      className="card"
      style={{
        padding: '16px',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
        <span
          className="mono"
          style={{
            fontSize: '10px',
            color: 'var(--muted)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '3px',
            padding: '1px 5px',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          {String(item.sequence).padStart(2, '0')}
        </span>
        <p style={{ fontSize: '14px', flex: 1, lineHeight: '1.5', color: 'var(--text)' }}>
          {item.plainLanguage}
        </p>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'var(--mono)',
            color: riskStyle.text,
            background: riskStyle.bg,
            border: `1px solid ${riskStyle.border}`,
            borderRadius: '3px',
            padding: '2px 6px',
            flexShrink: 0,
            letterSpacing: '0.05em',
          }}
        >
          {item.riskLevel}
        </span>
      </div>

      {/* Second row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '11px',
          color: 'var(--muted)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ReverseIcon reversible={item.isReversible} />
          <span style={{ color: item.isReversible ? '#4ade80' : '#f87171' }}>
            {item.isReversible ? 'Reversible' : 'Irreversible'}
          </span>
        </span>
        <span>
          Confidence:{' '}
          <span style={{ color: 'var(--text)' }}>
            {Math.round(item.confidence * 100)}%
          </span>
        </span>
        <span className="mono" style={{ color: 'var(--very-muted)', fontSize: '10px' }}>
          {item.verb} {item.target}
        </span>
      </div>

      {/* Rationale */}
      <div
        style={{
          marginTop: '8px',
          fontSize: '11px',
          color: 'var(--muted)',
          lineHeight: '1.5',
        }}
      >
        {item.rationale}
      </div>

      {/* Attention bar */}
      {needsAttention && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px 10px',
            background: item.riskLevel === 'CRITICAL' ? 'rgba(248,113,113,0.06)' : 'rgba(250,204,21,0.06)',
            border: `1px solid ${item.riskLevel === 'CRITICAL' ? 'rgba(248,113,113,0.3)' : 'rgba(250,204,21,0.25)'}`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M7 1.5L12.5 11.5H1.5L7 1.5Z"
              stroke={item.riskLevel === 'CRITICAL' ? '#f87171' : '#facc15'}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M7 5.5V8.5"
              stroke={item.riskLevel === 'CRITICAL' ? '#f87171' : '#facc15'}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle
              cx="7"
              cy="10"
              r="0.6"
              fill={item.riskLevel === 'CRITICAL' ? '#f87171' : '#facc15'}
            />
          </svg>
          <span
            style={{
              fontSize: '11px',
              color: item.riskLevel === 'CRITICAL' ? '#f87171' : '#facc15',
            }}
          >
            This action requires explicit approval before execution
          </span>
        </div>
      )}
    </div>
  )
}
