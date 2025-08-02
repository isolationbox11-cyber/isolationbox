import { WhoisRecord, ApiError } from './types';

const WHOISXML_API_KEY = process.env.NEXT_PUBLIC_WHOISXML_API_KEY;
const WHOISXML_BASE_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';
const WAYBACK_API_BASE = 'https://web.archive.org/cdx/search/cdx';

// Rate limiting
let lastRequest = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequest = Date.now();
}

export class WhoisAPI {
  private static async makeRequest(url: string): Promise<any> {
    await rateLimit();
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('WHOIS API request failed:', error);
      throw error;
    }
  }

  static async getWhoisRecord(domain: string): Promise<WhoisRecord | null> {
    if (!WHOISXML_API_KEY || WHOISXML_API_KEY === 'your_whoisxml_api_key_here') {
      console.warn('WHOISXML API key not configured, returning demo data');
      return this.getDemoWhoisRecord(domain);
    }

    try {
      const url = `${WHOISXML_BASE_URL}?apiKey=${WHOISXML_API_KEY}&domainName=${domain}&outputFormat=JSON`;
      const data = await this.makeRequest(url);
      
      if (data.WhoisRecord) {
        const record = data.WhoisRecord;
        return {
          domain: record.domainName || domain,
          registrar: record.registrarName || 'Unknown',
          creation_date: record.createdDate || 'Unknown',
          expiration_date: record.expiresDate || 'Unknown',
          nameservers: record.nameServers?.hostNames || [],
          status: record.status || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('WHOIS lookup failed:', error);
      return this.getDemoWhoisRecord(domain);
    }
  }

  private static getDemoWhoisRecord(domain: string): WhoisRecord {
    return {
      domain,
      registrar: 'Demo Registrar Inc.',
      creation_date: '2020-01-15',
      expiration_date: '2025-01-15',
      nameservers: ['ns1.example.com', 'ns2.example.com'],
      status: ['clientTransferProhibited']
    };
  }

  static async getWaybackTimeline(domain: string, limit: number = 10): Promise<any[]> {
    try {
      const url = `${WAYBACK_API_BASE}?url=${domain}&output=json&limit=${limit}&fl=timestamp,original,statuscode`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Wayback API error: ${response.status}`);
      }
      
      const text = await response.text();
      const lines = text.trim().split('\n');
      
      // Skip header line and parse data
      const data = lines.slice(1).map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return line.split(' ');
        }
      });
      
      return data.map((entry: any) => ({
        timestamp: Array.isArray(entry) ? entry[0] : entry.timestamp,
        url: Array.isArray(entry) ? entry[1] : entry.original,
        status: Array.isArray(entry) ? entry[2] : entry.statuscode,
        date: this.formatWaybackDate(Array.isArray(entry) ? entry[0] : entry.timestamp)
      }));
    } catch (error) {
      console.error('Wayback timeline failed:', error);
      return this.getDemoTimeline(domain);
    }
  }

  private static formatWaybackDate(timestamp: string): string {
    if (!timestamp || timestamp.length < 14) return 'Unknown';
    
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10);
    const minute = timestamp.substring(10, 12);
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  private static getDemoTimeline(domain: string): any[] {
    const now = new Date();
    return [
      {
        timestamp: '20240101120000',
        url: `http://${domain}`,
        status: '200',
        date: '2024-01-01 12:00'
      },
      {
        timestamp: '20230615080000',
        url: `https://${domain}`,
        status: '200',
        date: '2023-06-15 08:00'
      },
      {
        timestamp: '20230201140000',
        url: `http://${domain}`,
        status: '404',
        date: '2023-02-01 14:00'
      },
      {
        timestamp: '20220810100000',
        url: `http://${domain}`,
        status: '200',
        date: '2022-08-10 10:00'
      }
    ];
  }

  static async searchDomains(query: string): Promise<string[]> {
    try {
      // This would typically use a domain search API
      // For demo purposes, return some sample domains
      return [
        `${query}.com`,
        `${query}.net`,
        `${query}.org`,
        `www.${query}.com`,
        `shop.${query}.com`
      ].slice(0, 5);
    } catch (error) {
      console.error('Domain search failed:', error);
      return [];
    }
  }
}