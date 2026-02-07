import {
  AgentStatus,
  AgentAction,
  UrgencyLevel,
  TraceEntry,
} from './index';

// Base Agent Interface
export interface IAgent {
  id: string;
  name: string;
  description: string;
  
  // Core methods
  initialize(): Promise<void>;
  monitor(): Promise<AgentStatus>;
  getWidgetState(): Promise<AgentWidgetState>;
  
  // Action methods
  evaluate(): Promise<AgentAction[]>;
  act(actionId: string): Promise<boolean>;
  
  // Explainability
  explain(actionId: string): Promise<string>;
  getTrace(actionId: string): Promise<TraceEntry>;
  
  // Lifecycle
  cleanup(): Promise<void>;
}

export interface AgentWidgetState {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  message?: string;
  countdown?: number;
  urgency: UrgencyLevel;
  lastUpdated: string;
  actions?: AgentAction[];
}

export interface AgentContext {
  familyStructure: any; // FamilyStructure
  currentUser: any; // UAEPassUser
  timestamp: string;
}

export interface AgentDecision {
  action: AgentAction;
  reasoning: string;
  confidence: number;
  trace: TraceEntry;
}
