import { API_KEYS } from '../apiKeys';
import { fetchGreyNoiseIP } from './greynoiseApi';
import { getShodanHostDetails, advancedShodanSearch } from './advanced-shodan-client';
import { fetchOTXIP, fetchOTXPulses } from './otxApi';
import { fetchAbuseIPDB } from './abuseipdbApi';
import { fetchVirusTotal } from './virustotalApi';

export interface UnifiedThreatData {
  ip: string;
  timestamp: string;
  greynoise: any;
  shodan: any;
  otx: any;
  abuseipdb: any;
  virustotal: any;
  riskScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardStats {
  totalQueries: number;
  activeBots: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  countries: number;
  malwareDetected: number;
  recentAlerts: number;
}

export interface LiveFeedItem {
  id: string;
  timestamp: Date;
  type: 'malware' | 'botnet' | 'phishing' | 'vulnerability' | 'scanning';
  source: string;
  target: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    country: string;
    city: string;
  };
}

export async function getUnifiedThreatIntel(ip: string): Promise<UnifiedThreatData> {
  const timestamp = new Date().toISOString();
  
  try {
    const [greynoiseResult, shodanResult, otxResult, abuseResult, vtResult] = await Promise.allSettled([
      fetchGreyNoiseIP({ ip, apiKey: API_KEYS.greynoise }),
      getShodanHostDetails(ip),
      fetchOTXIP({ ip, apiKey: API_KEYS.alienvault_otx }),
      fetchAbuseIPDB({ ip, apiKey: API_KEYS.abuseipdb[0] }),
      fetchVirusTotal({ resource: ip, apiKey: API_KEYS.virustotal })
    ]);

    const data = {
      ip,
      timestamp,
      greynoise: greynoiseResult.status === 'fulfilled' ? greynoiseResult.value : null,
      shodan: shodanResult.status === 'fulfilled' ? shodanResult.value : null,
      otx: otxResult.status === 'fulfilled' ? otxResult.value : null,
      abuseipdb: abuseResult.status === 'fulfilled' ? abuseResult.value : null,
      virustotal: vtResult.status === 'fulfilled' ? vtResult.value : null,
      riskScore: 0,
      threatLevel: 'low' as const
    };

    // Calculate risk score and threat level
    const riskScore = calculateRiskScore(data);
    data.riskScore = riskScore;
    data.threatLevel = getThreatLevel(riskScore);

    return data;
  } catch (error) {
    console.error('Unified threat intel failed:', error);
    return {
      ip,
      timestamp,
      greynoise: null,
      shodan: null,
      otx: null,
      abuseipdb: null,
      virustotal: null,
      riskScore: 0,
      threatLevel: 'low'
    };
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get some recent threat intelligence data to calculate stats
    const [shodanStats, otxPulses] = await Promise.allSettled([
      advancedShodanSearch('*', { facets: ['country'], page: 1 }),
      fetchOTXPulses({ apiKey: API_KEYS.alienvault_otx, limit: 50 })
    ]);

    const shodanData = shodanStats.status === 'fulfilled' ? shodanStats.value : null;
    const otxData = otxPulses.status === 'fulfilled' ? otxPulses.value : null;

    return {
      totalQueries: shodanData?.total || 0,
      activeBots: Math.floor((shodanData?.total || 0) * 0.15), // Estimate 15% are bots
      threatLevel: 'medium',
      countries: shodanData?.facets?.country?.length || 0,
      malwareDetected: otxData?.results?.length || 0,
      recentAlerts: Math.floor(Math.random() * 50) + 10 // Mock data for now
    };
  } catch (error) {
    console.error('Dashboard stats failed:', error);
    return {
      totalQueries: 0,
      activeBots: 0,
      threatLevel: 'low',
      countries: 0,
      malwareDetected: 0,
      recentAlerts: 0
    };
  }
}

export async function getLiveThreatFeed(): Promise<LiveFeedItem[]> {
  try {
    const [otxPulses, shodanData] = await Promise.allSettled([
      fetchOTXPulses({ apiKey: API_KEYS.alienvault_otx, limit: 20 }),
      advancedShodanSearch('malware OR botnet OR "command and control"', { page: 1 })
    ]);

    const feeds: LiveFeedItem[] = [];

    // Process OTX pulses
    if (otxPulses.status === 'fulfilled' && otxPulses.value?.results) {
      otxPulses.value.results.slice(0, 10).forEach((pulse: any, index: number) => {
        feeds.push({
          id: `otx-${pulse.id || index}`,
          timestamp: new Date(pulse.created || Date.now()),
          type: categorizeThreatType(pulse.tags),
          source: 'OTX',
          target: pulse.indicators?.[0]?.indicator || 'Multiple',
          severity: mapSeverityFromTags(pulse.tags),
          description: pulse.description || pulse.name || 'New threat detected',
          location: {
            country: 'Global',
            city: 'Various'
          }
        });
      });
    }

    // Process Shodan data
    if (shodanData.status === 'fulfilled' && shodanData.value?.matches) {
      shodanData.value.matches.slice(0, 10).forEach((match: any, index: number) => {
        feeds.push({
          id: `shodan-${match.ip_str}-${index}`,
          timestamp: new Date(match.timestamp || Date.now()),
          type: 'scanning',
          source: match.ip_str,
          target: 'Network Scan',
          severity: match.vulns?.length > 0 ? 'high' : 'medium',
          description: `${match.product || 'Unknown service'} on port ${match.port}`,
          location: {
            country: match.location?.country_name || 'Unknown',
            city: match.location?.city || 'Unknown'
          }
        });
      });
    }

    return feeds.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20);
  } catch (error) {
    console.error('Live threat feed failed:', error);
    return [];
  }
}

function calculateRiskScore(data: Partial<UnifiedThreatData>): number {
  let score = 0;

  // GreyNoise scoring
  if (data.greynoise?.classification === 'malicious') score += 40;
  else if (data.greynoise?.classification === 'suspicious') score += 20;

  // Shodan scoring
  if (data.shodan?.vulns?.length > 0) score += 30;
  if (data.shodan?.tags?.includes('malware')) score += 25;

  // OTX scoring
  if (data.otx?.pulse_info?.count > 0) score += 20;

  // AbuseIPDB scoring
  if (data.abuseipdb?.abuseConfidencePercentage > 50) score += 35;
  else if (data.abuseipdb?.abuseConfidencePercentage > 25) score += 15;

  // VirusTotal scoring
  if (data.virustotal?.data?.attributes?.last_analysis_stats?.malicious > 0) score += 40;
  else if (data.virustotal?.data?.attributes?.last_analysis_stats?.suspicious > 0) score += 20;

  return Math.min(score, 100);
}

function getThreatLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

function categorizeThreatType(tags: string[]): 'malware' | 'botnet' | 'phishing' | 'vulnerability' | 'scanning' {
  if (!tags) return 'vulnerability';
  
  const tagStr = tags.join(' ').toLowerCase();
  if (tagStr.includes('malware') || tagStr.includes('trojan') || tagStr.includes('virus')) return 'malware';
  if (tagStr.includes('botnet') || tagStr.includes('bot')) return 'botnet';
  if (tagStr.includes('phish')) return 'phishing';
  if (tagStr.includes('scan')) return 'scanning';
  return 'vulnerability';
}

function mapSeverityFromTags(tags: string[]): 'low' | 'medium' | 'high' | 'critical' {
  if (!tags) return 'low';
  
  const tagStr = tags.join(' ').toLowerCase();
  if (tagStr.includes('critical') || tagStr.includes('high')) return 'critical';
  if (tagStr.includes('medium') || tagStr.includes('moderate')) return 'high';
  if (tagStr.includes('low')) return 'medium';
  return 'low';
}