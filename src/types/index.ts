// Family Structure Types
export type FamilyRole = 'sponsor' | 'spouse' | 'child' | 'domestic_worker';

export type ResidencyType = 'tourist' | 'skilled_expat' | 'domestic_worker';

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyRole;
  residencyType?: ResidencyType;
  dateOfBirth?: string;
  emiratesId?: string;
  visaNumber?: string;
  dependencies?: string[]; // IDs of members this person sponsors
}

export interface FamilyStructure {
  id: string;
  sponsorId: string;
  members: FamilyMember[];
  createdAt: string;
  updatedAt: string;
}

// Agent Status Types
export type AgentStatus = 'clear' | 'attention_needed' | 'action_in_progress';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AgentWidgetState {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  message?: string;
  countdown?: number; // seconds remaining
  urgency: UrgencyLevel;
  lastUpdated: string;
}

// Residency & Identity Types
export interface VisaStatus {
  memberId: string;
  visaNumber: string;
  expiryDate: string;
  gracePeriodEnds?: string;
  renewalInProgress: boolean;
  agency: 'ICP' | 'GDRFA';
}

export interface EmiratesIdStatus {
  memberId: string;
  emiratesId: string;
  expiryDate: string;
  renewalInProgress: boolean;
}

// Compliance Types
export interface ParkingFine {
  id: string;
  emirate: 'Dubai' | 'Abu Dhabi';
  amount: number;
  violationDate: string;
  discountWindowEnds: string; // 24-48h window
  status: 'unpaid' | 'paid' | 'discounted';
  escalationLevel: 'friendly' | 'urgent' | 'formal';
}

// Well-Being Types
export interface VaccinationRequirement {
  memberId: string;
  vaccineName: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface MedicalFitnessTest {
  memberId: string;
  testType: string;
  expiryDate: string;
  renewalInProgress: boolean;
}

export interface InsuranceStatus {
  memberId: string;
  provider: string;
  expiryDate: string;
  valid: boolean;
}

// Agent Action Types
export interface AgentAction {
  id: string;
  agentId: string;
  type: 'notification' | 'workflow_preparation' | 'payment_initiation' | 'renewal_start';
  description: string;
  reason: string; // Trace-backed explanation
  priority: number;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  relatedActionId?: string;
}

// Trace & Explainability
export interface TraceEntry {
  id: string;
  agentId: string;
  action: string;
  reasoning: string;
  data: Record<string, any>;
  timestamp: string;
  userId: string;
}

// UAE Pass Types
export interface UAEPassUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emiratesId: string;
}
