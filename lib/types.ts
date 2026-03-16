export interface ParsedAction {
  id: string
  verb: string
  target: string
  scope: string
  sideEffects: string[]
}

export interface RiskAssessment {
  actionId: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  isReversible: boolean
  dataExposed: string[]
  worstCase: string
  confidence: number
}

export interface ManifestItem {
  actionId: string
  sequence: number
  plainLanguage: string
  verb: string
  target: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  isReversible: boolean
  confidence: number
  rationale: string
  requiresApproval: boolean
}

export interface Manifest {
  taskSummary: string
  totalActions: number
  irreversibleCount: number
  criticalCount: number
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  items: ManifestItem[]
  agentReasoning: string
}

export interface AuditEntry {
  sequence: number
  timestamp: string
  action: string
  outcome: string
  approved: boolean
}

export type AgentStatus = 'idle' | 'running' | 'complete' | 'error'

export interface AgentState {
  parse: AgentStatus
  risk: AgentStatus
  manifest: AgentStatus
  audit: AgentStatus
}
