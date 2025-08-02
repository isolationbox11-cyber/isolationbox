// OTX API client configuration and utilities
export const OTX_BASE_URL = 'https://otx.alienvault.com/api/v1';

export interface OTXIndicator {
  indicator: string;
  type: string;
  created: string;
  description?: string;
  id?: string;
}

export interface OTXPulse {
  id: string;
  name: string;
  description: string;
  created: string;
  modified: string;
  author_name: string;
  public: boolean;
  tags: string[];
  malware_families: string[];
  attack_ids: string[];
  industries: string[];
  indicators: OTXIndicator[];
}

export interface OTXThreatData {
  pulses: OTXPulse[];
  indicators: OTXIndicator[];
}

export class OTXClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = OTX_BASE_URL;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-OTX-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`OTX API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OTX API request failed:', error);
      throw error;
    }
  }

  async getRecentPulses(limit: number = 10): Promise<OTXPulse[]> {
    const data = await this.makeRequest(`/pulses/subscribed?limit=${limit}`);
    return data.results || [];
  }

  async getRecentIndicators(types: string[] = ['IPv4', 'domain', 'hostname'], limit: number = 20): Promise<OTXIndicator[]> {
    const typeParam = types.join(',');
    const data = await this.makeRequest(`/indicators/export?types=${typeParam}&limit=${limit}`);
    return data.results || [];
  }

  async getThreatsByMalwareFamily(family: string): Promise<OTXPulse[]> {
    const data = await this.makeRequest(`/pulses/search?q=malware_families:"${family}"`);
    return data.results || [];
  }

  async getIndicatorDetails(indicator: string, type: string): Promise<any> {
    const data = await this.makeRequest(`/indicators/${type}/${indicator}/general`);
    return data;
  }
}

export function createOTXClient(): OTXClient {
  const apiKey = process.env.OTX_API_KEY;
  
  if (!apiKey) {
    throw new Error('OTX_API_KEY environment variable is not set');
  }
  
  return new OTXClient(apiKey);
}