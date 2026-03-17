'use client'

export default function SystemDiagram() {
  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes flowGlow {
          0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 0px rgba(34, 211, 238, 0)); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.6)); }
        }
        
        @keyframes dashFlow {
          to { stroke-dashoffset: -20; }
        }
        
        .flow-box-01 { animation: flowGlow 8s ease-in-out 0s infinite; }
        .flow-box-02 { animation: flowGlow 8s ease-in-out 1s infinite; }
        .flow-box-03 { animation: flowGlow 8s ease-in-out 2s infinite; }
        .flow-box-04 { animation: flowGlow 8s ease-in-out 4s infinite; }
        .flow-box-05 { animation: flowGlow 8s ease-in-out 5s infinite; }
        
        .flow-arrow {
          stroke-dasharray: 5, 5;
          animation: dashFlow 1s linear infinite;
        }
        
        .human-review-box {
          animation: flowGlow 8s ease-in-out 3s infinite;
        }
      `}</style>
      <svg
        width="100%"
        viewBox="0 0 1100 450"
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
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(34,211,238,0.5)" />
        </marker>
        <marker
          id="arrow-down"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L6,0 L3,6 z" fill="rgba(34,211,238,0.5)" />
        </marker>
      </defs>

      {/* User Input block */}
      <rect
        x="50" y="180" width="130" height="85" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <text x="115" y="218" textAnchor="middle" fill="rgba(228,228,231,0.8)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Task input
      </text>
      <text x="115" y="238" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        task + context
      </text>

      {/* Arrow: User -> Agent 01 */}
      <line
        x1="180" y1="222" x2="231" y2="222"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />

      {/* Agent 01 block */}
      <rect
        x="235" y="170" width="150" height="105" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-01"
      />
      <text x="310" y="195" textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="ui-monospace,monospace" fontWeight="600">
        01
      </text>
      <text x="310" y="217" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Intent parser
      </text>
      <text x="310" y="238" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-nano-9b
      </text>
      <text x="310" y="257" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0, 1024 tok
      </text>

      {/* Arrow: 01 -> 02 */}
      <line
        x1="385" y1="222" x2="431" y2="222"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />
      <text x="408" y="155" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="ui-monospace,monospace">
        ParsedAction[]
      </text>

      {/* Agent 02 block - cyan border (powerful model) */}
      <rect
        x="435" y="170" width="150" height="105" rx="4"
        fill="rgba(34,211,238,0.04)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-02"
      />
      <text x="510" y="195" textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="ui-monospace,monospace" fontWeight="600">
        02
      </text>
      <text x="510" y="217" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Risk reasoner
      </text>
      <text x="510" y="238" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-super-49b
      </text>
      <text x="510" y="257" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0.1, 2048 tok
      </text>

      {/* Arrow: 02 -> 03 */}
      <line
        x1="585" y1="222" x2="631" y2="222"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />
      <text x="608" y="155" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="ui-monospace,monospace">
        RiskAssessment[]
      </text>

      {/* Agent 03 block - cyan border */}
      <rect
        x="635" y="170" width="150" height="105" rx="4"
        fill="rgba(34,211,238,0.04)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-03"
      />
      <text x="710" y="195" textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="ui-monospace,monospace" fontWeight="600">
        03
      </text>
      <text x="710" y="217" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Manifest builder
      </text>
      <text x="710" y="238" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-super-49b
      </text>
      <text x="710" y="257" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0, 2048 tok
      </text>

      {/* Arrow: 03 -> Human review */}
      <line
        x1="785" y1="222" x2="831" y2="222"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />
      <text x="808" y="155" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="ui-monospace,monospace">
        Manifest
      </text>

      {/* Human review block - yellow border */}
      <rect
        x="835" y="180" width="130" height="85" rx="4"
        fill="rgba(250,204,21,0.04)"
        stroke="rgba(250,204,21,0.4)"
        strokeWidth="1.5"
        className="human-review-box"
      />
      <text x="900" y="218" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Human review
      </text>
      <text x="900" y="238" textAnchor="middle" fill="rgba(250,204,21,0.7)" fontSize="10" fontFamily="-apple-system,system-ui,sans-serif">
        approve / reject
      </text>

      {/* Arrow: Human review -> down to Agent 04 area */}
      {/* Down from human block */}
      <line
        x1="900" y1="265" x2="900" y2="360"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        className="flow-arrow"
      />
      <text x="920" y="315" textAnchor="start" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="ui-monospace,monospace">
        approved
      </text>
      {/* Left to Agent 04 */}
      <line
        x1="900" y1="360" x2="789" y2="360"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />

      {/* Agent 04 block */}
      <rect
        x="635" y="320" width="150" height="85" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-04"
      />
      <text x="710" y="343" textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="ui-monospace,monospace" fontWeight="600">
        04
      </text>
      <text x="710" y="365" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Audit logger
      </text>
      <text x="710" y="384" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="10" fontFamily="ui-monospace,monospace">
        nemotron-nano-9b
      </text>
      <text x="710" y="398" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="ui-monospace,monospace">
        T=0, 1024 tok
      </text>

      {/* Arrow: Agent 04 -> Output */}
      <line
        x1="785" y1="360" x2="831" y2="360"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />

      {/* Output block - green border */}
      <rect
        x="835" y="320" width="130" height="85" rx="4"
        fill="rgba(74,222,128,0.04)"
        stroke="rgba(74,222,128,0.4)"
        strokeWidth="1.5"
        className="flow-box-05"
      />
      <text x="900" y="358" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="13" fontFamily="-apple-system,system-ui,sans-serif">
        Audit log
      </text>
      <text x="900" y="378" textAnchor="middle" fill="rgba(74,222,128,0.7)" fontSize="10" fontFamily="-apple-system,system-ui,sans-serif">
        timestamped
      </text>

      {/* Legend */}
      <rect x="50" y="420" width="8" height="8" rx="1" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
      <text x="64" y="429" fill="rgba(113,113,122,0.7)" fontSize="9" fontFamily="ui-monospace,monospace">nemotron-super-49b (deep reasoning)</text>
      <rect x="280" y="420" width="8" height="8" rx="1" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="294" y="429" fill="rgba(113,113,122,0.7)" fontSize="9" fontFamily="ui-monospace,monospace">nemotron-nano-9b (speed)</text>
      <rect x="480" y="420" width="8" height="8" rx="1" fill="rgba(250,204,21,0.04)" stroke="rgba(250,204,21,0.4)" strokeWidth="1" />
      <text x="494" y="429" fill="rgba(113,113,122,0.7)" fontSize="9" fontFamily="ui-monospace,monospace">human in the loop</text>
    </svg>
    </div>
  )
}
