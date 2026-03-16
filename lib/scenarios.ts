export interface Scenario {
  label: string
  task: string
  context: string
}

export const scenarios: Scenario[] = [
  {
    label: 'Sales Pipeline Cleanup',
    task: 'Review all open deals in the CRM that have had no activity in over 60 days. Archive the stale ones, send a re-engagement email to the account owners, update the deal stages to Stalled, and generate a summary report for the VP of Sales.',
    context: 'Salesforce CRM with 340 open deals. Email system connected. VP of Sales is Sarah Chen.',
  },
  {
    label: 'Dependency Modernization',
    task: 'Scan all package.json files across the monorepo, identify dependencies more than two major versions behind, upgrade them to latest stable versions, run the test suite, and open a pull request with a changelog summary.',
    context: 'GitHub monorepo with 12 services. CI pipeline connected. Main branch protected.',
  },
  {
    label: 'GDPR Compliance Sweep',
    task: 'Identify all customer records where consent was collected before May 2023, send re-consent emails, flag non-responders after 14 days for deletion, and generate a compliance report for the legal team.',
    context: 'PostgreSQL database with 180,000 customer records. Email system connected. Legal contact is privacy@company.com.',
  },
]
