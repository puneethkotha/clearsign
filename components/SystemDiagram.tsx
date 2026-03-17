'use client'

export default function SystemDiagram() {
  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes flowBrighten {
          0%, 15%, 100% { 
            stroke: rgba(34, 211, 238, 0.3);
            stroke-width: 1.5;
            filter: none;
          }
          5%, 10% { 
            stroke: rgba(34, 211, 238, 1);
            stroke-width: 2.5;
            filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.8));
          }
        }
        
        @keyframes flowBrightenYellow {
          0%, 15%, 100% { 
            stroke: rgba(250, 204, 21, 0.4);
            stroke-width: 1.5;
            filter: none;
          }
          5%, 10% { 
            stroke: rgba(250, 204, 21, 1);
            stroke-width: 2.5;
            filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.8));
          }
        }
        
        @keyframes flowBrightenGreen {
          0%, 15%, 100% { 
            stroke: rgba(74, 222, 128, 0.4);
            stroke-width: 1.5;
            filter: none;
          }
          5%, 10% { 
            stroke: rgba(74, 222, 128, 1);
            stroke-width: 2.5;
            filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.8));
          }
        }
        
        @keyframes dashFlow {
          to { stroke-dashoffset: -20; }
        }
        
        .flow-box-01 { animation: flowBrighten 6s ease-in-out 0s infinite; }
        .flow-box-02 { animation: flowBrighten 6s ease-in-out 0.8s infinite; }
        .flow-box-03 { animation: flowBrighten 6s ease-in-out 1.6s infinite; }
        .flow-box-04 { animation: flowBrighten 6s ease-in-out 3.2s infinite; }
        .flow-box-05 { animation: flowBrightenGreen 6s ease-in-out 4s infinite; }
        
        .flow-arrow {
          stroke-dasharray: 5, 5;
          animation: dashFlow 1s linear infinite;
        }
        
        .human-review-box {
          animation: flowBrightenYellow 6s ease-in-out 2.4s infinite;
        }
      `}</style>
      <svg
        width="100%"
        viewBox="0 0 1200 500"
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
        x="40" y="200" width="160" height="100" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <text x="120" y="245" textAnchor="middle" fill="rgba(228,228,231,0.8)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Task input
      </text>
      <text x="120" y="265" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">
        task + context
      </text>

      {/* Arrow: User -> Agent 01 */}
      <line
        x1="200" y1="250" x2="246" y2="250"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />

      {/* Agent 01 block */}
      <rect
        x="250" y="185" width="160" height="130" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-01"
      />
      <text x="330" y="215" textAnchor="middle" fill="#22d3ee" fontSize="13" fontFamily="ui-monospace,monospace" fontWeight="600">
        01
      </text>
      <text x="330" y="240" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Intent parser
      </text>
      <text x="330" y="265" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">
        nemotron-nano-9b
      </text>
      <text x="330" y="290" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="10" fontFamily="ui-monospace,monospace">
        T=0, 1024 tok
      </text>

      {/* Arrow: 01 -> 02 */}
      <line
        x1="410" y1="250" x2="456" y2="250"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />
      <text x="433" y="170" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace,monospace">
        ParsedAction[]
      </text>

      {/* Agent 02 block - cyan border (powerful model) */}
      <rect
        x="460" y="185" width="160" height="130" rx="4"
        fill="rgba(34,211,238,0.04)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-02"
      />
      <text x="540" y="215" textAnchor="middle" fill="#22d3ee" fontSize="13" fontFamily="ui-monospace,monospace" fontWeight="600">
        02
      </text>
      <text x="540" y="240" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Risk reasoner
      </text>
      <text x="540" y="265" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">
        nemotron-super-49b
      </text>
      <text x="540" y="290" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="10" fontFamily="ui-monospace,monospace">
        T=0.1, 2048 tok
      </text>

      {/* Arrow: 02 -> 03 */}
      <line
        x1="620" y1="250" x2="666" y2="250"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />
      <text x="643" y="170" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace,monospace">
        RiskAssessment[]
      </text>

      {/* Agent 03 block - cyan border */}
      <rect
        x="670" y="185" width="160" height="130" rx="4"
        fill="rgba(34,211,238,0.04)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-03"
      />
      <text x="750" y="215" textAnchor="middle" fill="#22d3ee" fontSize="13" fontFamily="ui-monospace,monospace" fontWeight="600">
        03
      </text>
      <text x="750" y="240" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Manifest builder
      </text>
      <text x="750" y="265" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">
        nemotron-super-49b
      </text>
      <text x="750" y="290" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="10" fontFamily="ui-monospace,monospace">
        T=0, 2048 tok
      </text>

      {/* Arrow: 03 -> Human review */}
      <line
        x1="830" y1="250" x2="876" y2="250"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />
      <text x="853" y="170" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace,monospace">
        Manifest
      </text>

      {/* Human review block - yellow border */}
      <rect
        x="880" y="200" width="160" height="100" rx="4"
        fill="rgba(250,204,21,0.04)"
        stroke="rgba(250,204,21,0.4)"
        strokeWidth="1.5"
        className="human-review-box"
      />
      <text x="960" y="245" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Human review
      </text>
      <text x="960" y="265" textAnchor="middle" fill="rgba(250,204,21,0.7)" fontSize="11" fontFamily="-apple-system,system-ui,sans-serif">
        approve / reject
      </text>

      {/* Arrow: Human review -> down to Agent 04 area */}
      {/* Down from human block */}
      <line
        x1="960" y1="300" x2="960" y2="380"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        className="flow-arrow"
      />
      <text x="985" y="345" textAnchor="start" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace,monospace">
        approved
      </text>
      {/* Left to Agent 04 */}
      <line
        x1="960" y1="380" x2="834" y2="380"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />

      {/* Agent 04 block */}
      <rect
        x="670" y="340" width="160" height="100" rx="4"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1.5"
        className="flow-box-04"
      />
      <text x="750" y="370" textAnchor="middle" fill="#22d3ee" fontSize="13" fontFamily="ui-monospace,monospace" fontWeight="600">
        04
      </text>
      <text x="750" y="395" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Audit logger
      </text>
      <text x="750" y="415" textAnchor="middle" fill="rgba(113,113,122,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">
        nemotron-nano-9b
      </text>
      <text x="750" y="430" textAnchor="middle" fill="rgba(113,113,122,0.5)" fontSize="10" fontFamily="ui-monospace,monospace">
        T=0, 1024 tok
      </text>

      {/* Arrow: Agent 04 -> Output */}
      <line
        x1="830" y1="390" x2="876" y2="390"
        stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
        markerEnd="url(#arrow)"
        className="flow-arrow"
      />

      {/* Output block - green border */}
      <rect
        x="880" y="340" width="160" height="100" rx="4"
        fill="rgba(74,222,128,0.04)"
        stroke="rgba(74,222,128,0.4)"
        strokeWidth="1.5"
        className="flow-box-05"
      />
      <text x="960" y="385" textAnchor="middle" fill="rgba(228,228,231,0.9)" fontSize="14" fontFamily="-apple-system,system-ui,sans-serif" fontWeight="500">
        Audit log
      </text>
      <text x="960" y="405" textAnchor="middle" fill="rgba(74,222,128,0.7)" fontSize="11" fontFamily="-apple-system,system-ui,sans-serif">
        timestamped
      </text>

      {/* Legend - top right with container */}
      <rect x="900" y="20" width="280" height="95" rx="6" 
        fill="rgba(0,0,0,0.3)" 
        stroke="rgba(255,255,255,0.1)" 
        strokeWidth="1" 
      />
      
      <rect x="915" y="38" width="12" height="12" rx="2" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.5)" strokeWidth="1" />
      <text x="933" y="48" fill="rgba(228,228,231,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">nemotron-super-49b (deep reasoning)</text>
      
      <rect x="915" y="62" width="12" height="12" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="933" y="72" fill="rgba(228,228,231,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">nemotron-nano-9b (speed)</text>
      
      <rect x="915" y="86" width="12" height="12" rx="2" fill="rgba(250,204,21,0.05)" stroke="rgba(250,204,21,0.5)" strokeWidth="1" />
      <text x="933" y="96" fill="rgba(228,228,231,0.8)" fontSize="11" fontFamily="ui-monospace,monospace">human in the loop</text>
    </svg>
    </div>
  )
}
