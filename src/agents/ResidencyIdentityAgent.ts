/**
 * Residency & Identity Agent
 * Tracks visa expiry, Emirates ID expiry, grace periods
 */

import {BaseAgent} from './BaseAgent';
import {AgentStatus, AgentAction, VisaStatus, EmiratesIdStatus, FamilyMember, ResidencyType} from '../types';
import {crustdataService} from '../services/crustdata';
import {differenceInDays, isAfter, parseISO} from 'date-fns';

export class ResidencyIdentityAgent extends BaseAgent {
  id = 'residency_identity';
  name = 'Residency & Identity';
  description = 'Monitors visa and Emirates ID expiry, tracks grace periods';

  private visaStatuses: Map<string, VisaStatus> = new Map();
  private emiratesIdStatuses: Map<string, EmiratesIdStatus> = new Map();
  private familyGuardian: any; // FamilyGuardianAgent

  setFamilyGuardian(guardian: any): void {
    this.familyGuardian = guardian;
  }

  async initialize(): Promise<void> {
    await this.loadStatuses();
  }

  async monitor(): Promise<AgentStatus> {
    if (!this.familyGuardian) {
      return 'clear';
    }

    const memberIds = this.familyGuardian.getMemberIds();
    if (memberIds.length === 0) {
      return 'clear';
    }

    // Check visa and Emirates ID statuses
    const visaStatuses = await crustdataService.getVisaExpiries(memberIds);
    const emiratesIdStatuses = await crustdataService.getEmiratesIdExpiries(memberIds);

    // Update our cache
    for (const status of visaStatuses) {
      this.visaStatuses.set(status.memberId, status);
    }
    for (const status of emiratesIdStatuses) {
      this.emiratesIdStatuses.set(status.memberId, status);
    }

    // Check for urgent issues
    const now = new Date();
    for (const status of visaStatuses) {
      const expiryDate = parseISO(status.expiryDate);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      
      if (daysUntilExpiry < 0) {
        return 'attention_needed'; // Overdue
      }
      if (daysUntilExpiry <= 30) {
        return 'attention_needed'; // Urgent
      }
    }

    for (const status of emiratesIdStatuses) {
      const expiryDate = parseISO(status.expiryDate);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      
      if (daysUntilExpiry < 0) {
        return 'attention_needed';
      }
      if (daysUntilExpiry <= 30) {
        return 'attention_needed';
      }
    }

    return 'clear';
  }

  async evaluate(): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];
    const now = new Date();

    // Check visa statuses
    for (const [memberId, visaStatus] of this.visaStatuses.entries()) {
      const expiryDate = parseISO(visaStatus.expiryDate);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      const member = this.getMember(memberId);

      if (daysUntilExpiry < 0) {
        // Overdue - critical
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'renewal_start',
          description: `${member?.name || 'Member'}'s visa expired ${Math.abs(daysUntilExpiry)} days ago`,
          reason: this.explainVisaConsequence(member?.residencyType || 'skilled_expat', daysUntilExpiry),
          priority: 100,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      } else if (daysUntilExpiry <= 7) {
        // Very urgent
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'renewal_start',
          description: `${member?.name || 'Member'}'s visa expires in ${daysUntilExpiry} days`,
          reason: this.explainVisaConsequence(member?.residencyType || 'skilled_expat', daysUntilExpiry),
          priority: 95,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      } else if (daysUntilExpiry <= 30) {
        // Urgent
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'workflow_preparation',
          description: `${member?.name || 'Member'}'s visa expires in ${daysUntilExpiry} days`,
          reason: this.explainVisaConsequence(member?.residencyType || 'skilled_expat', daysUntilExpiry),
          priority: 80,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      } else if (daysUntilExpiry <= 60) {
        // Preparation needed
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'workflow_preparation',
          description: `Prepare renewal for ${member?.name || 'Member'}'s visa (expires in ${daysUntilExpiry} days)`,
          reason: 'Early preparation ensures smooth renewal process',
          priority: 60,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      }
    }

    // Check Emirates ID statuses
    for (const [memberId, emiratesIdStatus] of this.emiratesIdStatuses.entries()) {
      const expiryDate = parseISO(emiratesIdStatus.expiryDate);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      const member = this.getMember(memberId);

      if (daysUntilExpiry < 0) {
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'renewal_start',
          description: `${member?.name || 'Member'}'s Emirates ID expired ${Math.abs(daysUntilExpiry)} days ago`,
          reason: 'Expired Emirates ID restricts access to government services and banking',
          priority: 100,
          createdAt: new Date().toISOString(),
          status: 'pending',
        });
      } else if (daysUntilExpiry <= 30) {
        actions.push({
          id: this.generateActionId(),
          agentId: this.id,
          type: 'renewal_start',
          description: `${member?.name || 'Member'}'s Emirates ID expires in ${daysUntilExpiry} days`,
          reason: 'Renewal should be completed before expiry to avoid service disruptions',
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
      {actionId, action},
    );

    action.status = 'in_progress';

    // In production, this would:
    // - Open renewal workflow
    // - Pre-fill forms
    // - Guide user through process

    action.status = 'completed';
    return true;
  }

  protected calculateCountdown(actions: AgentAction[]): number | undefined {
    if (actions.length === 0) return undefined;

    // Find the most urgent action with a deadline
    const urgentAction = actions[0];
    // Extract days from description or calculate from visa/ID status
    // For now, return a placeholder
    return undefined; // Would calculate actual seconds
  }

  // Private helper methods
  private explainVisaConsequence(residencyType: ResidencyType, daysUntilExpiry: number): string {
    if (daysUntilExpiry < 0) {
      switch (residencyType) {
        case 'tourist':
          return 'Overstaying as a tourist can result in fines and future entry bans. Immediate action required.';
        case 'skilled_expat':
          return 'Overstaying your visa can result in fines, legal issues, and affect future residency applications. You may have a grace period, but action is urgent.';
        case 'domestic_worker':
          return 'Overstaying can result in fines and affect your employment status. Contact your sponsor immediately.';
        default:
          return 'Overstaying can result in fines and legal consequences. Immediate action required.';
      }
    }

    if (daysUntilExpiry <= 7) {
      return `Your visa expires in ${daysUntilExpiry} days. ${residencyType === 'skilled_expat' ? 'You may have a grace period after expiry, but renewal should be initiated now.' : 'Renewal must be completed before expiry.'}`;
    }

    if (daysUntilExpiry <= 30) {
      return `Your visa expires in ${daysUntilExpiry} days. Starting renewal now ensures completion before expiry and avoids last-minute complications.`;
    }

    return `Your visa expires in ${daysUntilExpiry} days. Early preparation allows for smooth renewal.`;
  }

  private getMember(memberId: string): FamilyMember | undefined {
    if (!this.familyGuardian) return undefined;
    const structure = this.familyGuardian.getFamilyStructure();
    return structure?.members.find(m => m.id === memberId);
  }

  private async loadStatuses(): Promise<void> {
    // In production, load from storage
  }
}
