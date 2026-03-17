'use client'

import { AuditEntry } from '@/lib/types'

interface AuditLogProps {
  entries: AuditEntry[]
}

export default function AuditLog({ entries }: AuditLogProps) {
  const firstTs = entries[0]?.timestamp ?? ''
  const lastTs = entries[entries.length - 1]?.timestamp ?? ''

  const handleExport = () => {
    const json = JSON.stringify(entries, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clearsign-audit-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>
            Execution audit log
          </div>
          {firstTs && lastTs && (
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)' }}>
              {firstTs} - {lastTs}
            </div>
          )}
        </div>
        <button
          onClick={handleExport}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'var(--muted)',
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            padding: '5px 10px',
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(255,255,255,0.2)'
            el.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(255,255,255,0.1)'
            el.style.color = 'var(--muted)'
          }}
        >
          Export as JSON
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Seq', 'Timestamp', 'Action', 'Outcome', 'Status'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontFamily: 'var(--mono)',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr
                key={entry.sequence}
                style={{
                  background:
                    i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <td
                  className="mono"
                  style={{ padding: '12px 16px', color: 'var(--muted)', whiteSpace: 'nowrap' }}
                >
                  {String(entry.sequence).padStart(2, '0')}
                </td>
                <td
                  className="mono"
                  style={{
                    padding: '12px 16px',
                    color: 'var(--muted)',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.timestamp}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text)', lineHeight: '1.4' }}>
                  {entry.action}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    color: 'var(--muted)',
                    lineHeight: '1.4',
                  }}
                >
                  {entry.outcome}
                </td>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  {entry.approved ? (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--mono)',
                        fontWeight: 600,
                        color: '#4ade80',
                        background: 'rgba(74,222,128,0.08)',
                        border: '1px solid rgba(74,222,128,0.3)',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Approved
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--mono)',
                        fontWeight: 600,
                        color: '#f87171',
                        background: 'rgba(248,113,113,0.08)',
                        border: '1px solid rgba(248,113,113,0.3)',
                        borderRadius: '3px',
                        padding: '2px 6px',
                      }}
                    >
                      Rejected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
