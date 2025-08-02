import { VirusTotalReport, ThreatAlert, ApiError } from './types';

const VIRUSTOTAL_API_KEY = process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/api/v3';

// Rate limiting for VirusTotal (4 requests per minute for free tier)
let lastRequest = 0;
const MIN_REQUEST_INTERVAL = 15000; // 15 seconds between requests

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequest = Date.now();
}

export class VirusTotalAPI {
  private static async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    if (!VIRUSTOTAL_API_KEY || VIRUSTOTAL_API_KEY === 'your_virustotal_api_key_here') {
      throw new Error('VirusTotal API key not configured');
    }

    await rateLimit();

    const url = `${VIRUSTOTAL_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`VirusTotal API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('VirusTotal API request failed:', error);
      throw error;
    }
  }

  static async analyzeUrl(url: string): Promise<VirusTotalReport | null> {
    try {
      // First, submit the URL for analysis
      const urlId = btoa(url).replace(/=/g, '');
      const data = await this.makeRequest(`/urls/${urlId}`);
      return data;
    } catch (error) {
      console.error('VirusTotal URL analysis failed:', error);
      return null;
    }
  }

  static async analyzeIP(ip: string): Promise<VirusTotalReport | null> {
    try {
      const data = await this.makeRequest(`/ip_addresses/${ip}`);
      return data;
    } catch (error) {
      console.error('VirusTotal IP analysis failed:', error);
      return null;
    }
  }

  static async getRecentThreats(): Promise<ThreatAlert[]> {
    try {
      // Get recent files analysis for threat intelligence
      const data = await this.makeRequest('/intelligence/hunting_notification_files?limit=10');
      
      const threats: ThreatAlert[] = [];
      
      if (data.data) {
        data.data.forEach((item: any, index: number) => {
          if (item.attributes) {
            const stats = item.attributes.last_analysis_stats || {};
            const maliciousCount = stats.malicious || 0;
            const suspiciousCount = stats.suspicious || 0;
            
            let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
            if (maliciousCount > 10) severity = 'critical';
            else if (maliciousCount > 5) severity = 'high';
            else if (maliciousCount > 0 || suspiciousCount > 5) severity = 'medium';
            
            threats.push({
              id: `vt-${index}`,
              title: `Malicious File Detected`,
              description: `File detected by ${maliciousCount} security vendors as malicious`,
              severity,
              timestamp: new Date(item.attributes.first_submission_date * 1000).toISOString(),
              source: 'VirusTotal',
              indicators: item.attributes.names || []
            });
          }
        });
      }
      
      return threats;
    } catch (error) {
      console.error('Failed to get recent threats:', error);
      // Return demo data if API fails
      return this.getDemoThreats();
    }
  }

  private static getDemoThreats(): ThreatAlert[] {
    return [
      {
        id: 'demo-1',
        title: 'Ransomware Campaign Detected',
        description: 'New ransomware variant targeting healthcare systems',
        severity: 'critical',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'VirusTotal Demo',
        indicators: ['malware.exe', 'crypto.dll']
      },
      {
        id: 'demo-2',
        title: 'Phishing Domain Identified',
        description: 'Suspicious domain mimicking popular banking site',
        severity: 'high',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: 'VirusTotal Demo',
        indicators: ['evil-bank.com']
      },
      {
        id: 'demo-3',
        title: 'Botnet C&C Server',
        description: 'Command and control server for IoT botnet discovered',
        severity: 'medium',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: 'VirusTotal Demo',
        indicators: ['192.168.1.100']
      }
    ];
  }

  static async searchDomains(query: string): Promise<any[]> {
    try {
      const data = await this.makeRequest(`/domains?limit=10&query=${encodeURIComponent(query)}`);
      return data.data || [];
    } catch (error) {
      console.error('VirusTotal domain search failed:', error);
      return [];
    }
  }
}