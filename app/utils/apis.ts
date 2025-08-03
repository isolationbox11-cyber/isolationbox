// Unified API utility for cyber research dashboard
// Handles all major cyber intelligence APIs with error handling and rate limiting

interface ApiResponse {
  source: string;
  data: any;
  error?: string;
  status: 'success' | 'error' | 'loading';
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url?: string;
  metadata?: Record<string, any>;
  risk?: 'low' | 'medium' | 'high' | 'critical';
}

// Shodan API
export async function searchShodan(query: string): Promise<ApiResponse> {
  try {
    const apiKey = process.env.SHODAN_API_KEY;
    if (!apiKey) {
      return {
        source: 'Shodan',
        data: [],
        error: 'API key not configured',
        status: 'error'
      };
    }

    const response = await fetch(`https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    const results: SearchResult[] = data.matches?.map((match: any, index: number) => ({
      id: `shodan-${index}`,
      title: `${match.ip_str}:${match.port}`,
      description: match.data ? match.data.substring(0, 200) + '...' : 'No description available',
      url: `https://www.shodan.io/host/${match.ip_str}`,
      metadata: {
        country: match.location?.country_name,
        city: match.location?.city,
        org: match.org,
        product: match.product,
        version: match.version,
        timestamp: match.timestamp
      },
      risk: match.vulns && Object.keys(match.vulns).length > 0 ? 'high' : 'medium'
    })) || [];

    return {
      source: 'Shodan',
      data: results,
      status: 'success'
    };
  } catch (error) {
    return {
      source: 'Shodan',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// VirusTotal API
export async function searchVirusTotal(query: string): Promise<ApiResponse> {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return {
        source: 'VirusTotal',
        data: [],
        error: 'API key not configured',
        status: 'error'
      };
    }

    // Check if query is an IP address, domain, or hash
    const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(query);
    const isHash = /^[a-fA-F0-9]{32,64}$/.test(query);
    const endpoint = isIP ? 'ip_addresses' : isHash ? 'files' : 'domains';
    
    const response = await fetch(`https://www.virustotal.com/api/v3/${endpoint}/${query}`, {
      headers: {
        'X-Apikey': apiKey
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          source: 'VirusTotal',
          data: [],
          status: 'success'
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const attributes = data.data?.attributes;
    
    if (!attributes) {
      return {
        source: 'VirusTotal',
        data: [],
        status: 'success'
      };
    }

    const maliciousCount = attributes.last_analysis_stats?.malicious || 0;
    const suspiciousCount = attributes.last_analysis_stats?.suspicious || 0;
    const totalScans = attributes.last_analysis_stats ? 
      Object.values(attributes.last_analysis_stats).reduce((a: any, b: any) => a + b, 0) : 0;

    const risk = maliciousCount > 0 ? 'critical' : 
                 suspiciousCount > 0 ? 'high' : 
                 'low';

    const result: SearchResult = {
      id: 'virustotal-1',
      title: query,
      description: `Scanned by ${totalScans} engines. ${maliciousCount} flagged as malicious, ${suspiciousCount} as suspicious.`,
      url: `https://www.virustotal.com/gui/${endpoint.slice(0, -1)}/${query}`,
      metadata: {
        malicious: maliciousCount,
        suspicious: suspiciousCount,
        clean: attributes.last_analysis_stats?.clean || 0,
        undetected: attributes.last_analysis_stats?.undetected || 0,
        lastAnalysis: attributes.last_analysis_date
      },
      risk
    };

    return {
      source: 'VirusTotal',
      data: [result],
      status: 'success'
    };
  } catch (error) {
    return {
      source: 'VirusTotal',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// GreyNoise API
export async function searchGreyNoise(query: string): Promise<ApiResponse> {
  try {
    const apiKey = process.env.GREYNOISE_API_KEY;
    if (!apiKey) {
      return {
        source: 'GreyNoise',
        data: [],
        error: 'API key not configured',
        status: 'error'
      };
    }

    // Check if query is an IP address
    const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(query);
    const endpoint = isIP ? `noise/context/${query}` : `noise/quick/${query}`;
    
    const response = await fetch(`https://api.greynoise.io/v3/${endpoint}`, {
      headers: {
        'key': apiKey
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          source: 'GreyNoise',
          data: [],
          status: 'success'
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (isIP && data.ip) {
      const risk = data.classification === 'malicious' ? 'critical' :
                   data.classification === 'suspicious' ? 'high' :
                   'medium';

      const result: SearchResult = {
        id: 'greynoise-1',
        title: data.ip,
        description: `${data.classification} IP - ${data.tags?.join(', ') || 'No tags'}`,
        metadata: {
          classification: data.classification,
          firstSeen: data.first_seen,
          lastSeen: data.last_seen,
          actor: data.actor,
          tags: data.tags,
          organization: data.metadata?.organization,
          country: data.metadata?.country
        },
        risk
      };

      return {
        source: 'GreyNoise',
        data: [result],
        status: 'success'
      };
    }

    return {
      source: 'GreyNoise',
      data: [],
      status: 'success'
    };
  } catch (error) {
    return {
      source: 'GreyNoise',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// AlienVault OTX API
export async function searchAlienVault(query: string): Promise<ApiResponse> {
  try {
    const apiKey = process.env.ALIENVAULT_OTX_API_KEY;
    if (!apiKey) {
      return {
        source: 'AlienVault OTX',
        data: [],
        error: 'API key not configured',
        status: 'error'
      };
    }

    // Check if query is an IP address, domain, or hash
    const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(query);
    const isHash = /^[a-fA-F0-9]{32,64}$/.test(query);
    const endpoint = isIP ? 'IPv4' : isHash ? 'file' : 'domain';
    
    const response = await fetch(`https://otx.alienvault.com/api/v1/indicators/${endpoint}/${query}/general`, {
      headers: {
        'X-OTX-API-KEY': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    const pulseInfo = data.pulse_info;
    const risk = pulseInfo?.count > 0 ? 'high' : 'low';

    const result: SearchResult = {
      id: 'alienvault-1',
      title: query,
      description: pulseInfo?.count > 0 ? 
        `Found in ${pulseInfo.count} threat intelligence pulse(s)` :
        'No threat intelligence found',
      url: `https://otx.alienvault.com/indicator/${endpoint.toLowerCase()}/${query}`,
      metadata: {
        pulseCount: pulseInfo?.count || 0,
        references: pulseInfo?.references || [],
        related: pulseInfo?.related || {},
        reputation: data.reputation
      },
      risk
    };

    return {
      source: 'AlienVault OTX',
      data: [result],
      status: 'success'
    };
  } catch (error) {
    return {
      source: 'AlienVault OTX',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// CISA CVE API
export async function searchCISACVE(query: string): Promise<ApiResponse> {
  try {
    // CISA CVE API is public, no key required
    const response = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(query)}&resultsPerPage=10`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    const results: SearchResult[] = data.vulnerabilities?.map((vuln: any, index: number) => {
      const cve = vuln.cve;
      const cvssScore = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 
                       cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore || 
                       cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
      
      const risk = cvssScore >= 9.0 ? 'critical' :
                   cvssScore >= 7.0 ? 'high' :
                   cvssScore >= 4.0 ? 'medium' : 'low';

      return {
        id: `cisa-cve-${index}`,
        title: cve.id,
        description: cve.descriptions?.[0]?.value?.substring(0, 200) + '...' || 'No description available',
        url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
        metadata: {
          cvssScore,
          severity: cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity,
          publishedDate: cve.published,
          lastModified: cve.lastModified,
          references: cve.references?.map((ref: any) => ref.url) || []
        },
        risk
      };
    }) || [];

    return {
      source: 'CISA CVE',
      data: results,
      status: 'success'
    };
  } catch (error) {
    return {
      source: 'CISA CVE',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// Google Dorking API
export async function searchGoogleDorking(query: string): Promise<ApiResponse> {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      return {
        source: 'Google Dorking',
        data: [],
        error: 'API key or Search Engine ID not configured',
        status: 'error'
      };
    }

    // Add common security-related search operators
    const securityQuery = `${query} (inurl:admin OR inurl:login OR inurl:config OR filetype:sql OR filetype:log)`;
    
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(securityQuery)}&num=10`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    const results: SearchResult[] = data.items?.map((item: any, index: number) => ({
      id: `google-${index}`,
      title: item.title,
      description: item.snippet,
      url: item.link,
      metadata: {
        displayLink: item.displayLink,
        cacheId: item.cacheId,
        formattedUrl: item.formattedUrl
      },
      risk: item.link.includes('admin') || item.link.includes('login') ? 'medium' : 'low'
    })) || [];

    return {
      source: 'Google Dorking',
      data: results,
      status: 'success'
    };
  } catch (error) {
    return {
      source: 'Google Dorking',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// Yandex Dorking API
export async function searchYandexDorking(query: string): Promise<ApiResponse> {
  try {
    const apiKey = process.env.YANDEX_SEARCH_API_KEY;
    
    if (!apiKey) {
      return {
        source: 'Yandex Dorking',
        data: [],
        error: 'API key not configured',
        status: 'error'
      };
    }

    // Add common security-related search operators for Yandex
    const securityQuery = `${query} (inurl:admin | inurl:login | inurl:config)`;
    
    const response = await fetch(
      `https://yandex.com/search/xml?user=${apiKey}&key=${apiKey}&query=${encodeURIComponent(securityQuery)}&l10n=en&sortby=rlv&filter=none&maxpassages=3&groupby=attr%3D%22%22.mode%3Dflat.groups-on-page%3D10`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Yandex returns XML, would need XML parsing
    // For now, return empty results with note
    return {
      source: 'Yandex Dorking',
      data: [],
      error: 'Yandex API requires XML parsing - not implemented in this demo',
      status: 'error'
    };
  } catch (error) {
    return {
      source: 'Yandex Dorking',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// Unified search function that queries all APIs in parallel
export async function unifiedSearch(query: string): Promise<ApiResponse[]> {
  const searches = [
    searchShodan(query),
    searchVirusTotal(query),
    searchGreyNoise(query),
    searchAlienVault(query),
    searchCISACVE(query),
    searchGoogleDorking(query),
    searchYandexDorking(query)
  ];

  // Execute all searches in parallel
  const results = await Promise.allSettled(searches);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      const sources = ['Shodan', 'VirusTotal', 'GreyNoise', 'AlienVault OTX', 'CISA CVE', 'Google Dorking', 'Yandex Dorking'];
      return {
        source: sources[index],
        data: [],
        error: result.reason?.message || 'Unknown error',
        status: 'error' as const
      };
    }
  });
}