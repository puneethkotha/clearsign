export interface Scenario {
  label: string
  task: string
  context: string
  industry: string
}

export const scenarios: Scenario[] = [
  {
    label: 'Financial Reconciliation',
    industry: 'Banking',
    task: 'Match 847 pending wire transfers from CoreBanking system against customer invoices in NetSuite. Flag discrepancies over $500. Auto-reconcile exact matches. Generate exception report for treasury team by 9 AM.',
    context: 'Production CoreBanking API, NetSuite ERP read/write access, 847 wires totaling $12.3M, treasury team requires SOC2 audit trail, reconciliation SLA is 2 hours.',
  },
  {
    label: 'Patient Data Migration',
    industry: 'Healthcare',
    task: 'Extract 28,000 patient records from legacy Epic EMR system. Validate HIPAA required fields. Transform to FHIR R4 format. Load into new Cerner instance. Verify no data loss. Generate compliance report.',
    context: 'Epic EMR (decommission date: March 31), Cerner Millennium target system, PHI data class, HIPAA audit required, data integrity critical, migration window: 72 hours.',
  },
  {
    label: 'Contract Approval Workflow',
    industry: 'Legal Operations',
    task: 'Review 43 vendor contracts pending in DocuSign. Extract key terms (liability cap, termination clause, payment terms). Flag non-standard terms. Route high-risk contracts to General Counsel. Auto-approve standard agreements under $50K.',
    context: 'DocuSign API, Salesforce CRM, 43 contracts awaiting signature, legal team capacity: 8 contracts/day, business is blocked on 12 urgent deals, approval SLA: 48 hours.',
  },
]
