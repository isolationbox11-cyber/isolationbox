import { ShodanDevice, ShodanSearchResult, ApiError } from './types';

const SHODAN_API_KEY = process.env.NEXT_PUBLIC_SHODAN_API_KEY;
const SHODAN_BASE_URL = 'https://api.shodan.io';

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

export class ShodanAPI {
  private static async makeRequest(endpoint: string): Promise<any> {
    if (!SHODAN_API_KEY || SHODAN_API_KEY === 'your_shodan_api_key_here') {
      throw new Error('Shodan API key not configured');
    }

    await rateLimit();

    const url = `${SHODAN_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${SHODAN_API_KEY}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Shodan API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Shodan API request failed:', error);
      throw error;
    }
  }

  static async search(query: string, limit: number = 10): Promise<ShodanSearchResult> {
    try {
      const data = await this.makeRequest(`/shodan/host/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      return {
        matches: data.matches || [],
        total: data.total || 0
      };
    } catch (error) {
      console.error('Shodan search failed:', error);
      throw error;
    }
  }

  static async getHostInfo(ip: string): Promise<ShodanDevice | null> {
    try {
      const data = await this.makeRequest(`/shodan/host/${ip}`);
      return data;
    } catch (error) {
      console.error('Shodan host info failed:', error);
      return null;
    }
  }

  static async searchIoTDevices(): Promise<ShodanDevice[]> {
    try {
      const queries = [
        'product:"IP Camera"',
        'product:"webcam"',
        'port:554 rtsp',
        'port:5060 sip',
        'product:"router"'
      ];
      
      const results: ShodanDevice[] = [];
      
      for (const query of queries) {
        try {
          const searchResult = await this.search(query, 5);
          results.push(...searchResult.matches);
          // Add delay between different queries
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.warn(`Failed to search for: ${query}`, error);
        }
      }
      
      return results.slice(0, 20); // Limit to 20 devices
    } catch (error) {
      console.error('IoT device search failed:', error);
      throw error;
    }
  }

  static async getThreatData(): Promise<{ country: string; attacks: number; latitude?: number; longitude?: number }[]> {
    try {
      // Search for recent attack patterns
      const malwareQuery = 'malware';
      const result = await this.search(malwareQuery, 50);
      
      // Group by country and count
      const countryStats = new Map<string, { count: number; coords?: { lat: number; lon: number } }>();
      
      result.matches.forEach(device => {
        if (device.location?.country_name) {
          const country = device.location.country_name;
          const current = countryStats.get(country) || { count: 0 };
          current.count += 1;
          
          if (device.location.latitude && device.location.longitude && !current.coords) {
            current.coords = {
              lat: device.location.latitude,
              lon: device.location.longitude
            };
          }
          
          countryStats.set(country, current);
        }
      });
      
      return Array.from(countryStats.entries())
        .map(([country, data]) => ({
          country,
          attacks: data.count,
          latitude: data.coords?.lat,
          longitude: data.coords?.lon
        }))
        .sort((a, b) => b.attacks - a.attacks)
        .slice(0, 10);
    } catch (error) {
      console.error('Threat data retrieval failed:', error);
      throw error;
    }
  }
}