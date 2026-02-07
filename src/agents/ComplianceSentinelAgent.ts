/**
 * Compliance Sentinel Agent
 * Monitors parking fines (Dubai + Abu Dhabi)
 * Tracks discount windows and escalates tone
 */

import {BaseAgent} from './BaseAgent';
import {AgentStatus, AgentAction, ParkingFine} from '../types';
import {crustdataService} from '../services/crustdata';
import {uaePassService} from '../services/uae-pass';
import {differenceInHours, isAfter, parseISO} from 'date-fns';

export class ComplianceSentinelAgent extends BaseAgent {
  id = 'compliance_sentinel';
  name = 'Compliance Sentinel';
  description = 'Monitors parking fines and ensures timely payment';

  private fines: Map<string, ParkingFine> = new Map();
  private eventUnsubscribe?: () => void;

  async initialize(): Promise<void> {
    await this.loadFines();
    
    // Subscribe to real-time fine events
    this.eventUnsubscribe = crustdataService.subscribeToEvents((event) => {
      if (event.type === 'parking_fine') {
        this.handleNewFine(event.data as ParkingFine);
      }
    });
  }

  async monitor(): Promise<AgentStatus> {
    const now = new Date();
    let hasUrgentFines = false;
    let hasActiveFines = false;

    for (const fine of this.fines.values()) {
      if (fine.status === 'paid') continue;
      
      hasActiveFines = true;
      const discountWindowEnds = parseISO(fine.discountWindowEnds);
      
      if (isAfter(now, discountWindowEnds)) {
        hasUrgentFines = true;
      } else {
        const hoursRemaining = differenceInHours(discountWindowEnds, now);
        if (hoursRemaining <= 12) {
          hasUrgentFines = true;
        }
      }
    }

    if (hasUrgentFines) {
      return 'attention_needed';
    }
    if (hasActiveFines) {
      return 'attention_needed';
    }

    return 'clear';
  }

  async evaluate(): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];
    const now = new Date();

    for (const fine of this.fines.values()) {
      if (fine.status === 'paid') continue;

      const discountWindowEnds = parseISO(fine.discountWindowEnds);
      const hoursRemaining = differenceInHours(discountWindowEnds, now);
      
      // Update escalation level based on time
      if (hoursRemaining < 0) {
        fine.escalationLevel = 'formal';
      } else if (hoursRemaining <= 12) {
        fine.escalationLevel = 'urgent';
      } else {
        fine.escalationLevel = 'friendly';
      }

      const escalationMessage = this.getEscalationMessage(fine);
      const priority = this.calculatePriority(fine, hoursRemaining);

      actions.push({
        id: this.generateActionId(),
        agentId: this.id,
        type: 'payment_initiation',
        description: `${fine.emirate} parking fine: ${fine.amount} AED ${hoursRemaining > 0 ? `(${Math.floor(hoursRemaining)}h discount window)` : '(discount expired)'}`,
        reason: escalationMessage,
        priority,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });
    }

    // Sort by priority (most urgent first)
    actions.sort((a, b) => b.priority - a.priority);
    this.lastActions = actions;
    return actions;
  }

  async act(actionId: string): Promise<boolean> {
    const action = this.lastActions.find(a => a.id === actionId);
    if (!action) {
      return false;
    }

    // Extract fine ID from action (in production, this would be stored in action data)
    const fineId = this.findFineIdFromAction(action);
    if (!fineId) {
      return false;
    }

    const fine = this.fines.get(fineId);
    if (!fine) {
      return false;
    }

    // Create trace
    await this.createTrace(
      'payment_initiation',
      action.reason,
      {fineId, fine, actionId},
    );

    action.status = 'in_progress';

    try {
      // Initiate payment via UAE Pass
      const result = await uaePassService.initiatePayment(
        fine.amount,
        `Parking fine - ${fine.emirate}`,
        fine.id,
      );

      if (result.success) {
        fine.status = 'paid';
        action.status = 'completed';
        await this.saveFines();
        return true;
      } else {
        action.status = 'failed';
        return false;
      }
    } catch (error) {
      action.status = 'failed';
      return false;
    }
  }

  async cleanup(): Promise<void> {
    if (this.eventUnsubscribe) {
      this.eventUnsubscribe();
    }
  }

  protected calculateCountdown(actions: AgentAction[]): number | undefined {
    if (actions.length === 0) return undefined;

    // Find the most urgent fine
    const urgentAction = actions[0];
    const fineId = this.findFineIdFromAction(urgentAction);
    if (!fineId) return undefined;

    const fine = this.fines.get(fineId);
    if (!fine) return undefined;

    const discountWindowEnds = parseISO(fine.discountWindowEnds);
    const now = new Date();
    const secondsRemaining = Math.max(0, Math.floor((discountWindowEnds.getTime() - now.getTime()) / 1000));

    return secondsRemaining > 0 ? secondsRemaining : undefined;
  }

  // Private methods
  private handleNewFine(fine: ParkingFine): void {
    this.fines.set(fine.id, fine);
    this.saveFines();
  }

  private getEscalationMessage(fine: ParkingFine): string {
    switch (fine.escalationLevel) {
      case 'friendly':
        return `You have a parking fine in ${fine.emirate}. Pay within the discount window (24-48h) to save money. The fine amount is ${fine.amount} AED, but you can pay a discounted amount if you act soon.`;
      case 'urgent':
        return `Your parking fine discount window is closing soon. Pay now to avoid the full fine amount. The fine is ${fine.amount} AED in ${fine.emirate}.`;
      case 'formal':
        return `The discount window for your parking fine has expired. The full amount of ${fine.amount} AED is now due. Please pay immediately to avoid additional penalties.`;
      default:
        return `Parking fine in ${fine.emirate}: ${fine.amount} AED`;
    }
  }

  private calculatePriority(fine: ParkingFine, hoursRemaining: number): number {
    if (hoursRemaining < 0) return 95; // Discount expired
    if (hoursRemaining <= 6) return 90; // Very urgent
    if (hoursRemaining <= 12) return 85; // Urgent
    if (hoursRemaining <= 24) return 75; // Important
    return 70; // Should pay soon
  }

  private findFineIdFromAction(action: AgentAction): string | null {
    // In production, fine ID would be stored in action metadata
    // For now, try to match by description
    for (const [fineId, fine] of this.fines.entries()) {
      if (action.description.includes(fine.emirate) && action.description.includes(`${fine.amount} AED`)) {
        return fineId;
      }
    }
    return null;
  }

  private async loadFines(): Promise<void> {
    // In production, load from storage
    // For demo, create a sample fine
    const sampleFine: ParkingFine = {
      id: 'fine_sample_1',
      emirate: 'Dubai',
      amount: 200,
      violationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      discountWindowEnds: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22 hours from now
      status: 'unpaid',
      escalationLevel: 'friendly',
    };
    this.fines.set(sampleFine.id, sampleFine);
  }

  private async saveFines(): Promise<void> {
    // In production, save to storage
    console.log('Saving fines:', Array.from(this.fines.values()));
  }
}
