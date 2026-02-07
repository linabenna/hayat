/**
 * Crustdata Service
 * Simulates real-time events: fines, expiries, grace periods
 */

import {ParkingFine, VisaStatus, EmiratesIdStatus} from '../types';

export class CrustdataService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'https://api.crustdata.com', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Simulate parking fine event
   */
  async simulateParkingFine(
    emirate: 'Dubai' | 'Abu Dhabi',
    memberId: string,
  ): Promise<ParkingFine> {
    // In production, this would call the actual Crustdata API
    // For now, we simulate the event
    
    const now = new Date();
    const discountWindowEnds = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h from now

    return {
      id: `fine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      emirate,
      amount: Math.floor(Math.random() * 500) + 100, // 100-600 AED
      violationDate: now.toISOString(),
      discountWindowEnds: discountWindowEnds.toISOString(),
      status: 'unpaid',
      escalationLevel: 'friendly',
    };
  }

  /**
   * Get visa expiry events
   */
  async getVisaExpiries(memberIds: string[]): Promise<VisaStatus[]> {
    // Simulate checking visa statuses
    const statuses: VisaStatus[] = [];
    
    for (const memberId of memberIds) {
      // In production, this would query Crustdata API
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 90)); // 0-90 days from now
      
      statuses.push({
        memberId,
        visaNumber: `VISA${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        expiryDate: expiryDate.toISOString(),
        gracePeriodEnds: expiryDate.toISOString(), // Would be calculated based on visa type
        renewalInProgress: false,
        agency: Math.random() > 0.5 ? 'ICP' : 'GDRFA',
      });
    }

    return statuses;
  }

  /**
   * Get Emirates ID expiry events
   */
  async getEmiratesIdExpiries(memberIds: string[]): Promise<EmiratesIdStatus[]> {
    const statuses: EmiratesIdStatus[] = [];
    
    for (const memberId of memberIds) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 180)); // 0-180 days
      
      statuses.push({
        memberId,
        emiratesId: `784-${Math.random().toString().substr(2, 7)}-${Math.random().toString().substr(2, 1)}`,
        expiryDate: expiryDate.toISOString(),
        renewalInProgress: false,
      });
    }

    return statuses;
  }

  /**
   * Subscribe to real-time events
   */
  subscribeToEvents(
    callback: (event: {type: string; data: any}) => void,
  ): () => void {
    // In production, this would set up WebSocket or polling
    const interval = setInterval(() => {
      // Simulate occasional events
      if (Math.random() > 0.95) {
        callback({
          type: 'parking_fine',
          data: this.simulateParkingFine(
            Math.random() > 0.5 ? 'Dubai' : 'Abu Dhabi',
            'member_1',
          ),
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }
}

export const crustdataService = new CrustdataService();
