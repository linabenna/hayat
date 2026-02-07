/**
 * App Constants
 */

export const AGENT_IDS = {
  FAMILY_GUARDIAN: 'family_guardian',
  RESIDENCY_IDENTITY: 'residency_identity',
  COMPLIANCE_SENTINEL: 'compliance_sentinel',
  WELLBEING: 'wellbeing',
} as const;

export const AGENT_NAMES = {
  [AGENT_IDS.FAMILY_GUARDIAN]: 'Family Guardian',
  [AGENT_IDS.RESIDENCY_IDENTITY]: 'Residency & Identity',
  [AGENT_IDS.COMPLIANCE_SENTINEL]: 'Compliance Sentinel',
  [AGENT_IDS.WELLBEING]: 'Family Well-Being',
} as const;

export const URGENCY_COLORS = {
  low: '#10B981', // Green
  medium: '#FBBF24', // Yellow
  high: '#F59E0B', // Orange
  critical: '#EF4444', // Red
} as const;

export const STATUS_COLORS = {
  clear: '#10B981', // Green
  attention_needed: '#F59E0B', // Orange
  action_in_progress: '#3B82F6', // Blue
} as const;

export const MONITORING_INTERVAL_MS = 60000; // 1 minute

export const FINE_DISCOUNT_WINDOW_HOURS = 24; // 24-48h window

export const URGENT_THRESHOLD_DAYS = 30;

export const CRITICAL_THRESHOLD_DAYS = 7;
