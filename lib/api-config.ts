/**
 * API Configuration with Environment Variable Support
 * This replaces the hardcoded API keys with environment variables
 */

export interface APIConfig {
  key: string;
  baseUrl: string;
  isConfigured: boolean;
  name: string;
  description: string;
  signupUrl: string;
}

// Helper function to check if an API key is properly configured
const isValidApiKey = (key: string | undefined): boolean => {
  return Boolean(key && key.trim() !== '' && !key.includes('your_') && !key.includes('YOUR_'));
};

// API Configuration Object
export const API_CONFIG = {
  SHODAN: {
    key: process.env.NEXT_PUBLIC_SHODAN_API_KEY || '',
    baseUrl: 'https://api.shodan.io',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_SHODAN_API_KEY),
    name: 'Shodan',
    description: 'Internet-connected device discovery and analysis',
    signupUrl: 'https://account.shodan.io/'
  },
  VIRUSTOTAL: {
    key: process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY || '',
    baseUrl: 'https://www.virustotal.com/api/v3',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY),
    name: 'VirusTotal',
    description: 'Malware analysis and file/URL scanning',
    signupUrl: 'https://www.virustotal.com/gui/my-apikey'
  },
  ABUSEIPDB: {
    key: process.env.NEXT_PUBLIC_ABUSEIPDB_API_KEY || '',
    baseUrl: 'https://api.abuseipdb.com/api/v2',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_ABUSEIPDB_API_KEY),
    name: 'AbuseIPDB',
    description: 'IP address reputation and abuse reporting',
    signupUrl: 'https://www.abuseipdb.com/api'
  },
  GREYNOISE: {
    key: process.env.NEXT_PUBLIC_GREYNOISE_API_KEY || '',
    baseUrl: 'https://api.greynoise.io/v3',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_GREYNOISE_API_KEY),
    name: 'GreyNoise',
    description: 'Internet background noise and scanning activity analysis',
    signupUrl: 'https://viz.greynoise.io/account/api-key'
  },
  GOOGLE_CSE: {
    key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    baseUrl: 'https://www.googleapis.com/customsearch/v1',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY) && isValidApiKey(process.env.NEXT_PUBLIC_GOOGLE_CSE_ID),
    name: 'Google Custom Search',
    description: 'Threat intelligence and OSINT searches',
    signupUrl: 'https://developers.google.com/custom-search/v1/introduction'
  },
  ALIENVAULT_OTX: {
    key: process.env.NEXT_PUBLIC_ALIENVAULT_OTX_API_KEY || '',
    baseUrl: 'https://otx.alienvault.com/api/v1',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_ALIENVAULT_OTX_API_KEY),
    name: 'AlienVault OTX',
    description: 'Threat intelligence and indicators of compromise',
    signupUrl: 'https://otx.alienvault.com/api'
  },
  HIBP: {
    key: process.env.NEXT_PUBLIC_HIBP_API_KEY || '',
    baseUrl: 'https://haveibeenpwned.com/api/v3',
    isConfigured: isValidApiKey(process.env.NEXT_PUBLIC_HIBP_API_KEY),
    name: 'Have I Been Pwned',
    description: 'Data breach detection and password compromise checking',
    signupUrl: 'https://haveibeenpwned.com/API/Key'
  }
} as const;

// Get all configured APIs
export const getConfiguredAPIs = (): APIConfig[] => {
  return Object.values(API_CONFIG).filter(api => api.isConfigured);
};

// Get all unconfigured APIs
export const getUnconfiguredAPIs = (): APIConfig[] => {
  return Object.values(API_CONFIG).filter(api => !api.isConfigured);
};

// Check if minimum required APIs are configured
export const hasMinimumAPIsConfigured = (): boolean => {
  const requiredAPIs = [API_CONFIG.SHODAN, API_CONFIG.VIRUSTOTAL];
  return requiredAPIs.every(api => api.isConfigured);
};

// Get API status summary
export const getAPIStatusSummary = () => {
  const configured = getConfiguredAPIs();
  const unconfigured = getUnconfiguredAPIs();
  const total = Object.keys(API_CONFIG).length;
  
  return {
    configured: configured.length,
    unconfigured: unconfigured.length,
    total,
    percentage: Math.round((configured.length / total) * 100),
    hasMinimumRequired: hasMinimumAPIsConfigured(),
    configuredAPIs: configured,
    unconfiguredAPIs: unconfigured
  };
};

// Export individual configurations for backward compatibility
export const SHODAN_API_KEY = API_CONFIG.SHODAN.key;
export const VIRUSTOTAL_API_KEY = API_CONFIG.VIRUSTOTAL.key;
export const ABUSEIPDB_API_KEY = API_CONFIG.ABUSEIPDB.key;
export const GREYNOISE_API_KEY = API_CONFIG.GREYNOISE.key;
export const GOOGLE_API_KEY = API_CONFIG.GOOGLE_CSE.key;
export const GOOGLE_CSE_ID = process.env.NEXT_PUBLIC_GOOGLE_CSE_ID || '';