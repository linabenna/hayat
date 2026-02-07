/**
 * Trace Service for Explainability and Auditability
 * Every agent action must be traceable
 */

import {TraceEntry} from '../types';

export class TraceService {
  private traces: Map<string, TraceEntry[]> = new Map();

  /**
   * Create a trace entry for an agent action
   */
  async createTrace(
    agentId: string,
    action: string,
    reasoning: string,
    data: Record<string, any>,
    userId: string,
  ): Promise<TraceEntry> {
    const trace: TraceEntry = {
      id: this.generateTraceId(),
      agentId,
      action,
      reasoning,
      data,
      timestamp: new Date().toISOString(),
      userId,
    };

    if (!this.traces.has(agentId)) {
      this.traces.set(agentId, []);
    }
    this.traces.get(agentId)!.push(trace);

    // In production, this would persist to a database
    await this.persistTrace(trace);

    return trace;
  }

  /**
   * Get trace for a specific action
   */
  async getTrace(agentId: string, actionId: string): Promise<TraceEntry | null> {
    const agentTraces = this.traces.get(agentId) || [];
    return agentTraces.find(t => t.id === actionId) || null;
  }

  /**
   * Get all traces for an agent
   */
  async getAgentTraces(agentId: string): Promise<TraceEntry[]> {
    return this.traces.get(agentId) || [];
  }

  /**
   * Get traces for a user
   */
  async getUserTraces(userId: string): Promise<TraceEntry[]> {
    const allTraces: TraceEntry[] = [];
    for (const traces of this.traces.values()) {
      allTraces.push(...traces.filter(t => t.userId === userId));
    }
    return allTraces.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Generate explanation for why an action was taken
   */
  generateExplanation(trace: TraceEntry): string {
    return `The ${trace.agentId} agent took the action "${trace.action}" because: ${trace.reasoning}. This decision was made at ${new Date(trace.timestamp).toLocaleString()} based on the following data: ${JSON.stringify(trace.data, null, 2)}`;
  }

  // Private methods
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async persistTrace(trace: TraceEntry): Promise<void> {
    // In production, persist to database
    // For now, we'll use AsyncStorage or a backend API
    console.log('Persisting trace:', trace.id);
  }
}

export const traceService = new TraceService();
