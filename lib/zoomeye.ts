/**
 * ZoomEye API Service
 * Provides secure access to ZoomEye search capabilities
 * Halloween-themed cybersecurity monitoring for Salem Cyber Vault
 */

// ZoomEye API Types
export interface ZoomEyeSearchResult {
  ip: string;
  port: number;
  protocol: string;
  banner: string;
  timestamp: string;
  location: {
    country: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
  organization?: string;
  service?: string;
  version?: string;
}

export interface ZoomEyeApiResponse {
  total: number;
  available: number;
  matches: ZoomEyeSearchResult[];
}

export interface ZoomEyeSearchParams {
  query: string;
  page?: number;
  facets?: string;
  type?: 'host' | 'web';
}

/**
 * ZoomEye API Client
 * Handles authentication and requests to ZoomEye API
 */
export class ZoomEyeClient {
  private apiKey: string;
  private baseUrl = 'https://api.zoomeye.org';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Authenticate with ZoomEye API and get user info
   */
  async authenticate(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`ZoomEye authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for hosts using ZoomEye API
   */
  async searchHosts(params: ZoomEyeSearchParams): Promise<ZoomEyeApiResponse> {
    try {
      const searchParams = new URLSearchParams({
        query: params.query,
        page: (params.page || 1).toString(),
      });

      if (params.facets) {
        searchParams.append('facets', params.facets);
      }

      const response = await fetch(`${this.baseUrl}/host/search?${searchParams}`, {
        method: 'GET',
        headers: {
          'API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform ZoomEye response to our standardized format
      return {
        total: data.total || 0,
        available: data.available || 0,
        matches: (data.matches || []).map((match: any) => ({
          ip: match.ip || 'Unknown',
          port: match.portinfo?.port || 0,
          protocol: match.portinfo?.service || 'Unknown',
          banner: match.portinfo?.banner || '',
          timestamp: match.timestamp || new Date().toISOString(),
          location: {
            country: match.geoinfo?.country?.names?.en || 'Unknown',
            city: match.geoinfo?.city?.names?.en || 'Unknown',
            latitude: match.geoinfo?.location?.latitude,
            longitude: match.geoinfo?.location?.longitude,
          },
          organization: match.geoinfo?.organization || undefined,
          service: match.portinfo?.service || undefined,
          version: match.portinfo?.version || undefined,
        })),
      };
    } catch (error) {
      throw new Error(`ZoomEye host search error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for web applications using ZoomEye API
   */
  async searchWeb(params: ZoomEyeSearchParams): Promise<ZoomEyeApiResponse> {
    try {
      const searchParams = new URLSearchParams({
        query: params.query,
        page: (params.page || 1).toString(),
      });

      if (params.facets) {
        searchParams.append('facets', params.facets);
      }

      const response = await fetch(`${this.baseUrl}/web/search?${searchParams}`, {
        method: 'GET',
        headers: {
          'API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Web search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform ZoomEye web response to our standardized format
      return {
        total: data.total || 0,
        available: data.available || 0,
        matches: (data.matches || []).map((match: any) => ({
          ip: match.ip || 'Unknown',
          port: match.port || 80,
          protocol: 'HTTP',
          banner: match.webapp || match.title || '',
          timestamp: match.timestamp || new Date().toISOString(),
          location: {
            country: match.geoinfo?.country?.names?.en || 'Unknown',
            city: match.geoinfo?.city?.names?.en || 'Unknown',
            latitude: match.geoinfo?.location?.latitude,
            longitude: match.geoinfo?.location?.longitude,
          },
          organization: match.geoinfo?.organization || undefined,
          service: match.webapp || undefined,
          version: match.version || undefined,
        })),
      };
    } catch (error) {
      throw new Error(`ZoomEye web search error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user account information and search quota
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`ZoomEye user info error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Halloween-themed search suggestions for ZoomEye
 */
export const spookyZoomEyeQueries = [
  {
    name: "Phantom Cameras",
    query: "device:camera",
    description: "Security cameras lurking in the digital shadows",
    type: "host" as const,
    risk: "Medium",
    explanation: "Surveillance cameras that might be watching... watching you back.",
  },
  {
    name: "Ghost Databases",
    query: "service:mysql",
    description: "MySQL databases floating in cyberspace",
    type: "host" as const,
    risk: "High",
    explanation: "Databases that might contain spectral secrets and haunted data.",
  },
  {
    name: "Zombie Routers",
    query: "device:router",
    description: "Undead network devices shambling through the internet",
    type: "host" as const,
    risk: "Medium",
    explanation: "Routers that refuse to die, potentially with default credentials.",
  },
  {
    name: "Cursed Web Servers",
    query: "app:nginx",
    description: "Web servers hosting mysterious content",
    type: "web" as const,
    risk: "Low",
    explanation: "Web servers running Nginx, gateway to digital realms unknown.",
  },
  {
    name: "Haunted IoT Devices",
    query: "device:iot",
    description: "Internet of Things devices with supernatural connectivity",
    type: "host" as const,
    risk: "High",
    explanation: "Smart devices that might be smarter than their owners intended.",
  },
  {
    name: "Spectral Printers",
    query: "device:printer",
    description: "Printers materializing documents from the ether",
    type: "host" as const,
    risk: "Low",
    explanation: "Network printers that might print more than just documents.",
  },
];

/**
 * Create a ZoomEye client instance
 * Only available server-side for security
 */
export function createZoomEyeClient(): ZoomEyeClient {
  const apiKey = process.env.ZOOMEYE_API_KEY;
  
  if (!apiKey) {
    throw new Error('ZoomEye API key not configured. Please set ZOOMEYE_API_KEY environment variable.');
  }

  return new ZoomEyeClient(apiKey);
}