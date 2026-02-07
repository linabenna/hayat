
export enum AgentStatus {
  CLEAR = 'Clear',
  ATTENTION = 'Attention Needed',
  IN_PROGRESS = 'Action In Progress'
}

export enum FamilyMemberRole {
  SPONSOR = 'Sponsor',
  SPOUSE = 'Spouse',
  CHILD = 'Child',
  DOMESTIC_WORKER = 'Domestic Worker'
}

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyMemberRole;
  emiratesId: string;
  visaExpiry: string;
  insuranceExpiry: string;
  passportNumber: string;
}

export interface AgentService {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'error';
  lastChecked: string;
  description: string;
}

export interface AgentAlert {
  id: string;
  agentId: string;
  title: string;
  description: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  explanation: string;
  source?: 'crustdata' | 'manual';
  memberId?: string; // Linked family member
}

export interface AgentConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  services: AgentService[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
