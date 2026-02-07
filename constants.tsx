
import { AgentConfig, FamilyMember, FamilyMemberRole } from './types';

export const AGENTS: AgentConfig[] = [
  {
    id: 'guardian',
    name: 'Family Guardian',
    icon: '🌳',
    description: 'The core orchestrator of your family ecosystem.',
    services: [
      { id: 'g1', name: 'Family Structure Map', status: 'active', lastChecked: '10m ago', description: 'Monitoring dependencies between sponsor and dependents.' },
      { id: 'g2', name: 'Agent Orchestration', status: 'active', lastChecked: '2m ago', description: 'Directing residency and compliance flows.' }
    ]
  },
  {
    id: 'residency',
    name: 'Residency & Identity',
    icon: '🛂',
    description: 'Tracks Visas and Emirates IDs for all members.',
    services: [
      { id: 'r1', name: 'Visa Expiry Monitor', status: 'warning', lastChecked: '5m ago', description: 'Tracking ICP and GDRFA databases.' },
      { id: 'r4', name: 'Auto-Renewal Agent', status: 'active', lastChecked: 'Now', description: 'Automated GDRFA submission engine.' },
      { id: 'r2', name: 'Emirates ID Validity', status: 'active', lastChecked: '1h ago', description: 'Cross-referencing EID with Federal Authority records.' }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance Sentinel',
    icon: '🚨',
    description: 'Monitors fines and legal obligations across Emirates.',
    services: [
      { id: 'c1', name: 'Dubai RTA Fines', status: 'error', lastChecked: '1m ago', description: 'Real-time sync with Dubai traffic database.' },
      { id: 'c2', name: 'Abu Dhabi Fines', status: 'active', lastChecked: '1m ago', description: 'Monitoring ITC Abu Dhabi violations.' }
    ]
  },
  {
    id: 'wellbeing',
    name: 'Family Well-Being',
    icon: '✨',
    description: 'Health, insurance, and medical compliance.',
    services: [
      { id: 'w1', name: 'Medical Insurance', status: 'active', lastChecked: '1d ago', description: 'Tracking DHA/DOH policy validity.' },
      { id: 'w2', name: 'Child Vaccinations', status: 'active', lastChecked: '2d ago', description: 'Aligning with UAE National Immunization Program.' }
    ]
  }
];

export const MOCK_FAMILY: FamilyMember[] = [
  {
    id: '1',
    name: 'Ahmed Al-Mansoori',
    role: FamilyMemberRole.SPONSOR,
    emiratesId: '784-1985-1234567-1',
    visaExpiry: '2026-10-15',
    insuranceExpiry: '2025-12-31',
    passportNumber: 'N1234567A'
  },
  {
    id: '2',
    name: 'Sara Al-Mansoori',
    role: FamilyMemberRole.SPOUSE,
    emiratesId: '784-1988-7654321-2',
    visaExpiry: '2026-10-15',
    insuranceExpiry: '2025-12-31',
    passportNumber: 'N8888888B'
  },
  {
    id: '3',
    name: 'Zayed Al-Mansoori',
    role: FamilyMemberRole.CHILD,
    emiratesId: '784-2015-1122334-3',
    visaExpiry: '2026-10-15',
    insuranceExpiry: '2025-12-31',
    passportNumber: 'N1112223C'
  },
  {
    id: '4',
    name: 'Mary Poppins',
    role: FamilyMemberRole.DOMESTIC_WORKER,
    emiratesId: '784-1992-0099887-4',
    visaExpiry: '2025-06-01',
    insuranceExpiry: '2025-06-01',
    passportNumber: 'P9988776D'
  }
];
