/**
 * Base Agent Class
 * All agents extend this class
 */

import {IAgent, AgentWidgetState, AgentContext, AgentDecision} from '../types/agent';
import {AgentStatus, AgentAction, UrgencyLevel, TraceEntry} from '../types';
import {traceService} from '../services/trace';

export abstract class BaseAgent implements IAgent {
  abstract id: string;
  abstract name: string;
  abstract description: string;

  protected context: AgentContext | null = null;
  protected lastStatus: AgentStatus = 'clear';
  protected lastActions: AgentAction[] = [];

  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Monitor for issues (to be implemented by subclasses)
   */
  abstract monitor(): Promise<AgentStatus>;

  /**
   * Get widget state
   */
  async getWidgetState(): Promise<AgentWidgetState> {
    const status = await this.monitor();
    const actions = await this.evaluate();
    
    const urgency = this.determineUrgency(status, actions);
    const message = this.generateStatusMessage(status, actions);
    const countdown = this.calculateCountdown(actions);

    return {
      agentId: this.id,
      agentName: this.name,
      status,
      message,
      countdown,
      urgency,
      lastUpdated: new Date().toISOString(),
      actions: actions.slice(0, 3), // Top 3 actions
    };
  }

  /**
   * Evaluate and return actions needed
   */
  abstract evaluate(): Promise<AgentAction[]>;

  /**
   * Execute an action
   */
  abstract act(actionId: string): Promise<boolean>;

  /**
   * Explain why an action was taken
   */
  async explain(actionId: string): Promise<string> {
    const action = this.lastActions.find(a => a.id === actionId);
    if (!action) {
      return 'Action not found';
    }

    const trace = await this.getTrace(actionId);
    if (trace) {
      return traceService.generateExplanation(trace);
    }

    return action.reason || 'No explanation available';
  }

  /**
   * Get trace for an action
   */
  async getTrace(actionId: string): Promise<TraceEntry> {
    const trace = await traceService.getTrace(this.id, actionId);
    if (!trace) {
      throw new Error(`Trace not found for action ${actionId}`);
    }
    return trace;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Override in subclasses if needed
  }

  /**
   * Set context for the agent
   */
  setContext(context: AgentContext): void {
    this.context = context;
  }

  /**
   * Create a trace entry for an action
   */
  protected async createTrace(
    action: string,
    reasoning: string,
    data: Record<string, any>,
  ): Promise<TraceEntry> {
    const userId = this.context?.currentUser?.uuid || 'unknown';
    return traceService.createTrace(this.id, action, reasoning, data, userId);
  }

  // Helper methods
  protected determineUrgency(status: AgentStatus, actions: AgentAction[]): UrgencyLevel {
    if (status === 'clear') return 'low';
    if (actions.length === 0) return 'low';
    
    const maxPriority = Math.max(...actions.map(a => a.priority));
    if (maxPriority >= 90) return 'critical';
    if (maxPriority >= 70) return 'high';
    if (maxPriority >= 50) return 'medium';
    return 'low';
  }

  protected generateStatusMessage(status: AgentStatus, actions: AgentAction[]): string | undefined {
    if (status === 'clear') {
      return undefined; // Silent when compliant
    }
    
    if (actions.length > 0) {
      return actions[0].description;
    }
    
    return 'Attention needed';
  }

  protected calculateCountdown(actions: AgentAction[]): number | undefined {
    // Override in subclasses to provide countdown
    return undefined;
  }

  protected generateActionId(): string {
    return `${this.id}_action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
