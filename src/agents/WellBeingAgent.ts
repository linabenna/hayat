/**
 * Family Well-Being Agent
 * Tracks vaccinations, medical fitness tests, insurance validity
 * Uses Uplift AI for risk assessment and prioritization
 */

import {BaseAgent} from './BaseAgent';
import {AgentStatus, AgentAction, VaccinationRequirement, MedicalFitnessTest, InsuranceStatus, FamilyMember} from '../types';
import {upliftAIService, RiskAssessment} from '../services/uplift';
import {differenceInDays, parseISO} from 'date-fns';

export class WellBeingAgent extends BaseAgent {
  id = 'wellbeing';
  name = 'Family Well-Being';
  description = 'Monitors vaccinations, medical fitness, and insurance';

  private vaccinations: Map<string, VaccinationRequirement[]> = new Map();
  private medicalTests: Map<string, MedicalFitnessTest[]> = new Map();
  private insuranceStatuses: Map<string, InsuranceStatus> = new Map();
  private familyGuardian: any; // FamilyGuardianAgent

  setFamilyGuardian(guardian: any): void {
    this.familyGuardian = guardian;
  }

  async initialize(): Promise<void> {
    await this.loadWellBeingData();
  }

  async monitor(): Promise<AgentStatus> {
    if (!this.familyGuardian) {
      return 'clear';
    }

    const structure = this.familyGuardian.getFamilyStructure();
    if (!structure) {
      return 'clear';
    }

    // Check for urgent items
    const now = new Date();
    
    // Check vaccinations
    for (const [memberId, vaccines] of this.vaccinations.entries()) {
      for (const vaccine of vaccines) {
        if (!vaccine.completed) {
          const dueDate = parseISO(vaccine.dueDate);
          const daysUntilDue = differenceInDays(dueDate, now);
          if (daysUntilDue <= 0 || daysUntilDue <= 30) {
            return 'attention_needed';
          }
        }
      }
    }

    // Check medical fitness tests
    for (const [memberId, tests] of this.medicalTests.entries()) {
      for (const test of tests) {
        const expiryDate = parseISO(test.expiryDate);
        const daysUntilExpiry = differenceInDays(expiryDate, now);
        if (daysUntilExpiry <= 30) {
          return 'attention_needed';
        }
      }
    }

    // Check insurance
    for (const status of this.insuranceStatuses.values()) {
      if (!status.valid) {
        return 'attention_needed';
      }
      const expiryDate = parseISO(status.expiryDate);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      if (daysUntilExpiry <= 30) {
        return 'attention_needed';
      }
    }

    return 'clear';
  }

  async evaluate(): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];
    const assessments: Array<{assessment: RiskAssessment; action: Partial<AgentAction>}> = [];

    if (!this.familyGuardian) {
      return actions;
    }

    const structure = this.familyGuardian.getFamilyStructure();
    if (!structure) {
      return actions;
    }

    const now = new Date();

    // Evaluate vaccinations
    for (const [memberId, vaccines] of this.vaccinations.entries()) {
      const member = structure.members.find(m => m.id === memberId);
      if (!member) continue;

      for (const vaccine of vaccines) {
        if (vaccine.completed) continue;

        const dueDate = parseISO(vaccine.dueDate);
        const daysUntilDue = differenceInDays(dueDate, now);

        const assessment = await upliftAIService.evaluateRisk(
          'vaccination',
          daysUntilDue,
          member.role,
          true, // Vaccinations are mandatory
        );

        assessments.push({
          assessment,
          action: {
            agentId: this.id,
            type: 'notification',
            description: `${member.name} - ${vaccine.vaccineName} due ${daysUntilDue > 0 ? `in ${daysUntilDue} days` : 'now'}`,
            reason: this.explainVaccinationConsequence(member.role, daysUntilDue),
            priority: assessment.priority,
            createdAt: new Date().toISOString(),
            status: 'pending',
          },
        });
      }
    }

    // Evaluate medical fitness tests
    for (const [memberId, tests] of this.medicalTests.entries()) {
      const member = structure.members.find(m => m.id === memberId);
      if (!member) continue;

      for (const test of tests) {
        const expiryDate = parseISO(test.expiryDate);
        const daysUntilExpiry = differenceInDays(expiryDate, now);

        const assessment = await upliftAIService.evaluateRisk(
          'medical_fitness',
          daysUntilExpiry,
          member.role,
          true,
        );

        assessments.push({
          assessment,
          action: {
            agentId: this.id,
            type: 'renewal_start',
            description: `${member.name} - ${test.testType} expires ${daysUntilExpiry > 0 ? `in ${daysUntilExpiry} days` : 'now'}`,
            reason: 'Medical fitness test expiry can affect residency status',
            priority: assessment.priority,
            createdAt: new Date().toISOString(),
            status: 'pending',
          },
        });
      }
    }

    // Evaluate insurance
    for (const [memberId, insurance] of this.insuranceStatuses.entries()) {
      const member = structure.members.find(m => m.id === memberId);
      if (!member) continue;

      if (!insurance.valid) {
        assessments.push({
          assessment: {
            stressLevel: 0.9,
            legalRisk: 0.8,
            familyImpact: member.role === 'sponsor' ? 1.0 : 0.7,
            overallUrgency: 'critical',
            priority: 95,
          },
          action: {
            agentId: this.id,
            type: 'notification',
            description: `${member.name} - Insurance is invalid`,
            reason: 'Invalid insurance can affect visa renewal and access to healthcare',
            priority: 95,
            createdAt: new Date().toISOString(),
            status: 'pending',
          },
        });
        continue;
      }

      const expiryDate = parseISO(insurance.expiryDate);
      const daysUntilExpiry = differenceInDays(expiryDate, now);

      const assessment = await upliftAIService.evaluateRisk(
        'insurance',
        daysUntilExpiry,
        member.role,
        true,
      );

      assessments.push({
        assessment,
        action: {
          agentId: this.id,
          type: 'renewal_start',
          description: `${member.name} - Insurance expires ${daysUntilExpiry > 0 ? `in ${daysUntilExpiry} days` : 'now'}`,
          reason: 'Insurance renewal is required for visa maintenance',
          priority: assessment.priority,
          createdAt: new Date().toISOString(),
          status: 'pending',
        },
      });
    }

    // Prioritize using Uplift AI
    const prioritizedAssessments = await upliftAIService.prioritizeItems(
      assessments.map(a => a.assessment),
    );

    // Create actions from prioritized assessments
    for (const prioritized of prioritizedAssessments) {
      const found = assessments.find(a => a.assessment === prioritized);
      if (found) {
        actions.push({
          id: this.generateActionId(),
          ...found.action,
        } as AgentAction);
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
    // - Open booking system for vaccinations
    // - Initiate medical test renewal
    // - Guide insurance renewal

    action.status = 'completed';
    return true;
  }

  // Private helper methods
  private explainVaccinationConsequence(role: string, daysUntilDue: number): string {
    if (daysUntilDue < 0) {
      return 'Overdue vaccination can affect school enrollment and residency status for children. Immediate action required.';
    }
    if (daysUntilDue <= 7) {
      return 'Vaccination is due soon. Missing mandatory vaccinations can result in school enrollment issues and affect residency status.';
    }
    return 'Upcoming vaccination requirement. Early scheduling ensures compliance and avoids last-minute issues.';
  }

  private async loadWellBeingData(): Promise<void> {
    // In production, load from storage or API
    // For demo, create sample data
    const sampleVaccination: VaccinationRequirement = {
      memberId: 'member_1',
      vaccineName: 'COVID-19 Booster',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    };

    if (!this.vaccinations.has('member_1')) {
      this.vaccinations.set('member_1', []);
    }
    this.vaccinations.get('member_1')!.push(sampleVaccination);
  }
}
