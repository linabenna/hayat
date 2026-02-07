/**
 * Family Guardian Agent
 * Orchestrator that maintains family structure and coordinates other agents
 */

import {BaseAgent} from './BaseAgent';
import {AgentStatus, AgentAction, FamilyStructure, FamilyMember} from '../types';
import {crustdataService} from '../services/crustdata';

export class FamilyGuardianAgent extends BaseAgent {
  id = 'family_guardian';
  name = 'Family Guardian';
  description = 'Maintains family structure and coordinates all agents';

  private familyStructure: FamilyStructure | null = null;

  async initialize(): Promise<void> {
    // Load family structure from storage
    await this.loadFamilyStructure();
  }

  async monitor(): Promise<AgentStatus> {
    if (!this.familyStructure) {
      return 'attention_needed'; // Need to set up family
    }

    // Check if any members need attention
    const hasIssues = this.familyStructure.members.some(member => {
      // Check for missing critical information
      if (member.role === 'sponsor' && !member.emiratesId) {
        return true;
      }
      if (member.role !== 'sponsor' && !member.visaNumber) {
        return true;
      }
      return false;
    });

    return hasIssues ? 'attention_needed' : 'clear';
  }

  async evaluate(): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    if (!this.familyStructure) {
      actions.push({
        id: this.generateActionId(),
        agentId: this.id,
        type: 'notification',
        description: 'Set up your family structure',
        reason: 'Family structure is required for HAYAT to monitor your obligations',
        priority: 100,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });
      return actions;
    }

    // Check for incomplete member information
    for (const member of this.familyStructure.members) {
      if (member.role === 'sponsor' && !member.emiratesId) {
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'notification',
          description: `Complete ${member.name}'s Emirates ID information`,
          reason: 'Sponsor Emirates ID is required for all government services',
          priority: 90,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      }

      if (member.role !== 'sponsor' && !member.visaNumber) {
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'notification',
          description: `Add visa information for ${member.name}`,
          reason: 'Visa information is required to track residency status',
          priority: 85,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      }
    }

    this.lastActions = actions;
    return actions;
  }

  async act(actionId: string): Promise<boolean> {
    const action = this.lastActions.find(a => a.id === actionId);
    if (!action) {
      return false;
    }

    // Create trace
    await this.createTrace(
      action.type,
      action.reason,
      {actionId, familyStructure: this.familyStructure},
    );

    // Update action status
    action.status = 'in_progress';

    // In production, this would trigger UI to collect missing information
    // For now, we'll just mark as completed
    action.status = 'completed';
    return true;
  }

  /**
   * Get family structure
   */
  getFamilyStructure(): FamilyStructure | null {
    return this.familyStructure;
  }

  /**
   * Update family structure
   */
  async updateFamilyStructure(structure: FamilyStructure): Promise<void> {
    this.familyStructure = structure;
    await this.saveFamilyStructure();
    
    // Create trace
    await this.createTrace(
      'family_structure_updated',
      'Family structure was updated',
      {structure},
    );
  }

  /**
   * Add family member
   */
  async addFamilyMember(member: FamilyMember): Promise<void> {
    if (!this.familyStructure) {
      throw new Error('Family structure not initialized');
    }

    this.familyStructure.members.push(member);
    this.familyStructure.updatedAt = new Date().toISOString();
    await this.saveFamilyStructure();

    await this.createTrace(
      'member_added',
      `Added ${member.name} to family structure`,
      {member},
    );
  }

  /**
   * Get all member IDs
   */
  getMemberIds(): string[] {
    if (!this.familyStructure) {
      return [];
    }
    return this.familyStructure.members.map(m => m.id);
  }

  // Private methods
  private async loadFamilyStructure(): Promise<void> {
    // In production, load from AsyncStorage or backend
    // For now, create a default structure
    this.familyStructure = {
      id: 'family_1',
      sponsorId: 'member_1',
      members: [
        {
          id: 'member_1',
          name: 'Ahmed Al Maktoum',
          role: 'sponsor',
          residencyType: 'skilled_expat',
          emiratesId: '784-1234567-1',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async saveFamilyStructure(): Promise<void> {
    // In production, save to AsyncStorage or backend
    console.log('Saving family structure:', this.familyStructure);
  }
}
