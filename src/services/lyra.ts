/**
 * Lyra Multi-Agent Orchestration Service
 * Handles coordination between agents
 */

import {IAgent, AgentContext, AgentDecision} from '../types/agent';

export class LyraOrchestrator {
  public agents: Map<string, IAgent> = new Map();
  private isRunning: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agent: IAgent): void {
    this.agents.set(agent.id, agent);
  }

  /**
   * Initialize all registered agents
   */
  async initializeAll(): Promise<void> {
    const initPromises = Array.from(this.agents.values()).map(agent =>
      agent.initialize().catch(err => {
        console.error(`Failed to initialize agent ${agent.id}:`, err);
      })
    );
    await Promise.all(initPromises);
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(intervalMs: number = 60000): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.monitoringInterval = setInterval(() => {
      this.monitorAll().catch(err => {
        console.error('Error in monitoring cycle:', err);
      });
    }, intervalMs);

    // Initial monitoring
    this.monitorAll().catch(err => {
      console.error('Error in initial monitoring:', err);
    });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isRunning = false;
  }

  /**
   * Monitor all agents
   */
  async monitorAll(): Promise<void> {
    const context: AgentContext = {
      familyStructure: await this.getFamilyStructure(),
      currentUser: await this.getCurrentUser(),
      timestamp: new Date().toISOString(),
    };

    const monitorPromises = Array.from(this.agents.values()).map(agent =>
      agent.monitor().catch(err => {
        console.error(`Error monitoring agent ${agent.id}:`, err);
        return 'clear' as const;
      })
    );

    await Promise.all(monitorPromises);
  }

  /**
   * Get decisions from all agents for a given context
   */
  async getDecisions(context: AgentContext): Promise<AgentDecision[]> {
    const decisions: AgentDecision[] = [];

    for (const agent of this.agents.values()) {
      try {
        const actions = await agent.evaluate();
        for (const action of actions) {
          const reasoning = await agent.explain(action.id);
          const trace = await agent.getTrace(action.id);
          
          decisions.push({
            action,
            reasoning,
            confidence: this.calculateConfidence(action, trace),
            trace,
          });
        }
      } catch (err) {
        console.error(`Error getting decisions from agent ${agent.id}:`, err);
      }
    }

    // Sort by priority and confidence
    return decisions.sort((a, b) => {
      if (a.action.priority !== b.action.priority) {
        return b.action.priority - a.action.priority;
      }
      return b.confidence - a.confidence;
    });
  }

  /**
   * Execute an action through the appropriate agent
   */
  async executeAction(actionId: string, agentId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    return agent.act(actionId);
  }

  /**
   * Get all agent widget states
   */
  async getWidgetStates(): Promise<Map<string, any>> {
    const states = new Map();
    
    for (const agent of this.agents.values()) {
      try {
        const state = await agent.getWidgetState();
        states.set(agent.id, state);
      } catch (err) {
        console.error(`Error getting widget state for agent ${agent.id}:`, err);
      }
    }

    return states;
  }

  /**
   * Cleanup all agents
   */
  async cleanup(): Promise<void> {
    this.stopMonitoring();
    const cleanupPromises = Array.from(this.agents.values()).map(agent =>
      agent.cleanup().catch(err => {
        console.error(`Error cleaning up agent ${agent.id}:`, err);
      })
    );
    await Promise.all(cleanupPromises);
  }

  // Private helper methods
  private calculateConfidence(action: any, trace: any): number {
    // Simple confidence calculation based on data quality
    // In production, this would be more sophisticated
    return 0.85; // Placeholder
  }

  private async getFamilyStructure(): Promise<any> {
    // TODO: Implement actual family structure retrieval
    return {};
  }

  private async getCurrentUser(): Promise<any> {
    // TODO: Implement actual user retrieval
    return {};
  }
}

export const lyraOrchestrator = new LyraOrchestrator();
