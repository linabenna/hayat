/**
 * Uplift AI Service
 * Evaluates risk and urgency for well-being agent
 */

import {UrgencyLevel} from '../types';

export interface RiskAssessment {
  stressLevel: number; // 0-1
  legalRisk: number; // 0-1
  familyImpact: number; // 0-1
  overallUrgency: UrgencyLevel;
  priority: number; // 0-100
}

export class UpliftAIService {
  /**
   * Evaluate risk and urgency for a well-being item
   */
  async evaluateRisk(
    itemType: 'vaccination' | 'medical_fitness' | 'insurance',
    daysUntilDue: number,
    memberRole: string,
    isMandatory: boolean,
  ): Promise<RiskAssessment> {
    // Calculate stress level
    const stressLevel = this.calculateStressLevel(daysUntilDue, isMandatory);
    
    // Calculate legal risk
    const legalRisk = this.calculateLegalRisk(itemType, daysUntilDue, isMandatory);
    
    // Calculate family impact
    const familyImpact = this.calculateFamilyImpact(memberRole, itemType);
    
    // Determine overall urgency
    const overallUrgency = this.determineUrgency(stressLevel, legalRisk, familyImpact);
    
    // Calculate priority score
    const priority = this.calculatePriority(stressLevel, legalRisk, familyImpact);

    return {
      stressLevel,
      legalRisk,
      familyImpact,
      overallUrgency,
      priority,
    };
  }

  /**
   * Prioritize multiple items
   */
  async prioritizeItems(assessments: RiskAssessment[]): Promise<RiskAssessment[]> {
    return assessments.sort((a, b) => b.priority - a.priority);
  }

  // Private helper methods
  private calculateStressLevel(daysUntilDue: number, isMandatory: boolean): number {
    if (daysUntilDue < 0) return 1.0; // Overdue
    if (daysUntilDue <= 7) return 0.9;
    if (daysUntilDue <= 30) return 0.7;
    if (daysUntilDue <= 60) return 0.5;
    if (daysUntilDue <= 90) return 0.3;
    
    const baseStress = 0.1;
    return isMandatory ? baseStress + 0.2 : baseStress;
  }

  private calculateLegalRisk(
    itemType: string,
    daysUntilDue: number,
    isMandatory: boolean,
  ): number {
    if (!isMandatory) return 0.1;
    if (daysUntilDue < 0) return 1.0;
    if (daysUntilDue <= 7) return 0.9;
    if (daysUntilDue <= 30) return 0.7;
    if (daysUntilDue <= 60) return 0.5;
    
    // Different risk levels by type
    if (itemType === 'vaccination') return 0.8; // High legal risk for missing vaccinations
    if (itemType === 'medical_fitness') return 0.6;
    if (itemType === 'insurance') return 0.7;
    
    return 0.3;
  }

  private calculateFamilyImpact(memberRole: string, itemType: string): number {
    // Sponsor and spouse have higher family impact
    if (memberRole === 'sponsor') return 1.0;
    if (memberRole === 'spouse') return 0.9;
    if (memberRole === 'child') return 0.7;
    if (memberRole === 'domestic_worker') return 0.5;
    
    // Vaccinations for children have high family impact
    if (itemType === 'vaccination' && memberRole === 'child') return 0.9;
    
    return 0.5;
  }

  private determineUrgency(
    stress: number,
    legal: number,
    impact: number,
  ): UrgencyLevel {
    const average = (stress + legal + impact) / 3;
    
    if (average >= 0.8) return 'critical';
    if (average >= 0.6) return 'high';
    if (average >= 0.4) return 'medium';
    return 'low';
  }

  private calculatePriority(stress: number, legal: number, impact: number): number {
    // Weighted priority calculation
    const weighted = stress * 0.3 + legal * 0.4 + impact * 0.3;
    return Math.round(weighted * 100);
  }
}

export const upliftAIService = new UpliftAIService();
