'use client'

export default function SystemDiagram() {
  return (
    <svg
      width="100%"
      viewBox="0 0 900 420"
      style={{ display: 'block', background: 'transparent' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.25)" />
        </marker>
        <marker
          id="arrow-down"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L6,0 L3,6 z" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>

      {/* User Input block */}
      <rect
        x="30" y="160" width="120" height="80" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <text x="90" y="196" textAnchor="middle" fill="rgba(228,228,231,0.8)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Task input
      </text>
      <text x="90" y="214" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        task + context
      </text>

      {/* Arrow: User -> Agent 01 */}
      <line
        x1="150" y1="200" x2="196" y2="200"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        markerEnd="url(#arrow)"
      />

      {/* Agent 01 block */}
      <rect
        x="200" y="160" width="140" height="100" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <text x="270" y="183" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="600">
        01
      </text>
      <text x="270" y="203" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Intent parser
      </text>
      <text x="270" y="222" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-nano-9b
      </text>
      <text x="270" y="240" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0, 1024 tok
      </text>

      {/* Arrow: 01 -> 02 */}
      <line
        x1="340" y1="200" x2="376" y2="200"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        markerEnd="url(#arrow)"
      />
      <text x="358" y="193" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="ui-monospace,monospace">
        ParsedAction[]
      </text>

      {/* Agent 02 block — cyan border (powerful model) */}
      <rect
        x="380" y="160" width="140" height="100" rx="4"
        fill="rgba(34,211,238,0.04)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1"
      />
      <text x="450" y="183" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="600">
        02
      </text>
      <text x="450" y="203" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Risk reasoner
      </text>
      <text x="450" y="222" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-super-49b
      </text>
      <text x="450" y="240" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0.1, 2048 tok
      </text>

      {/* Arrow: 02 -> 03 */}
      <line
        x1="520" y1="200" x2="556" y2="200"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        markerEnd="url(#arrow)"
      />
      <text x="538" y="193" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="ui-monospace,monospace">
        RiskAssessment[]
      </text>

      {/* Agent 03 block — cyan border */}
      <rect
        x="560" y="160" width="140" height="100" rx="4"
        fill="rgba(34,211,238,0.04)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1"
      />
      <text x="630" y="183" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="600">
        03
      </text>
      <text x="630" y="203" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Manifest builder
      </text>
      <text x="630" y="222" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-super-49b
      </text>
      <text x="630" y="240" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0, 2048 tok
      </text>

      {/* Arrow: 03 -> Human review */}
      <line
        x1="700" y1="200" x2="736" y2="200"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        markerEnd="url(#arrow)"
      />
      <text x="718" y="193" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="ui-monospace,monospace">
        Manifest
      </text>

      {/* Human review block — yellow border */}
      <rect
        x="740" y="160" width="120" height="80" rx="4"
        fill="rgba(250,204,21,0.04)"
        stroke="rgba(250,204,21,0.4)"
        strokeWidth="1"
      />
      <text x="800" y="196" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Human review
      </text>
      <text x="800" y="214" textAnchor="middle" fill="rgba(250,204,21,0.7)" fontSize="10" fontFamily="-apple-system,system-ui,sans-serif">
        approve / reject
      </text>

      {/* Arrow: Human review -> down to Agent 04 area */}
      {/* Down from human block */}
      <line
        x1="800" y1="240" x2="800" y2="340"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      />
      {/* Left to Agent 04 */}
      <line
        x1="800" y1="340" x2="704" y2="340"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        markerEnd="url(#arrow)"
      />
      <text x="752" y="334" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="ui-monospace,monospace">
        approved
      </text>

      {/* Agent 04 block */}
      <rect
        x="560" y="300" width="140" height="80" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <text x="630" y="320" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="600">
        04
      </text>
      <text x="630" y="340" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Audit logger
      </text>
      <text x="630" y="358" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-nano-9b
      </text>
      <text x="630" y="372" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0, 1024 tok
      </text>

      {/* Arrow: Agent 04 -> Output */}
      <line
        x1="700" y1="340" x2="736" y2="340"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        markerEnd="url(#arrow)"
      />

      {/* Output block — green border */}
      <rect
        x="740" y="300" width="120" height="80" rx="4"
        fill="rgba(74,222,128,0.04)"
        stroke="rgba(74,222,128,0.4)"
        strokeWidth="1"
      />
      <text x="800" y="336" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="12" fontFamily="-apple-system,system-ui,sans-serif">
        Audit log
      </text>
      <text x="800" y="354" textAnchor="middle" fill="rgba(74,222,128,0.7)" fontSize="10" fontFamily="-apple-system,system-ui,sans-serif">
        timestamped
      </text>

      {/* Legend */}
      <rect x="30" y="360" width="8" height="8" rx="1" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
      <text x="44" y="369" fill="rgba(113,113,122,0.7)" fontSize="9" fontFamily="ui-monospace,monospace">nemotron-super-49b (deep reasoning)</text>
      <rect x="220" y="360" width="8" height="8" rx="1" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="234" y="369" fill="rgba(113,113,122,0.7)" fontSize="9" fontFamily="ui-monospace,monospace">nemotron-nano-9b (speed)</text>
      <rect x="380" y="360" width="8" height="8" rx="1" fill="rgba(250,204,21,0.04)" stroke="rgba(250,204,21,0.4)" strokeWidth="1" />
      <text x="394" y="369" fill="rgba(113,113,122,0.7)" fontSize="9" fontFamily="ui-monospace,monospace">human in the loop</text>
    </svg>
  )
}
