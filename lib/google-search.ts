export interface GoogleSearchResult {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId?: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    metatags?: Array<{
      [key: string]: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
}

export interface GoogleSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
    nextPage?: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
  };
  context: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items?: GoogleSearchResult[];
}

export interface SearchOptions {
  query: string;
  startIndex?: number;
  count?: number;
  siteSearch?: string;
  dateRestrict?: string;
  sort?: string;
  gl?: string; // geolocation
  lr?: string; // language restrict
  safe?: 'active' | 'off';
}

export class GoogleCustomSearchService {
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  async search(options: SearchOptions): Promise<GoogleSearchResponse> {
    const {
      query,
      startIndex = 1,
      count = 10,
      siteSearch,
      dateRestrict,
      sort,
      gl,
      lr,
      safe = 'active'
    } = options;

    const params = new URLSearchParams({
      key: this.apiKey,
      cx: this.searchEngineId,
      q: query,
      start: startIndex.toString(),
      num: Math.min(count, 10).toString(), // Google limits to 10 results per request
      safe,
    });

    // Add optional parameters
    if (siteSearch) params.append('siteSearch', siteSearch);
    if (dateRestrict) params.append('dateRestrict', dateRestrict);
    if (sort) params.append('sort', sort);
    if (gl) params.append('gl', gl);
    if (lr) params.append('lr', lr);

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Custom Search API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GoogleSearchResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to perform Google Custom Search: ${error.message}`);
      }
      throw new Error('Failed to perform Google Custom Search: Unknown error');
    }
  }

  async searchSecurityContent(query: string, options?: Partial<SearchOptions>): Promise<GoogleSearchResponse> {
    // Add security-related search terms to improve relevance
    const enhancedQuery = `${query} (cybersecurity OR security OR vulnerability OR threat OR malware OR phishing)`;
    
    return this.search({
      query: enhancedQuery,
      safe: 'active',
      ...options
    });
  }

  async searchByDomain(domain: string, query?: string, options?: Partial<SearchOptions>): Promise<GoogleSearchResponse> {
    const searchQuery = query ? `${query} site:${domain}` : `site:${domain}`;
    
    return this.search({
      query: searchQuery,
      siteSearch: domain,
      ...options
    });
  }
}

// Factory function to create a service instance
export function createGoogleSearchService(): GoogleCustomSearchService {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  if (!apiKey) {
    throw new Error('GOOGLE_CUSTOM_SEARCH_API_KEY environment variable is required');
  }

  if (!searchEngineId) {
    throw new Error('GOOGLE_CUSTOM_SEARCH_ENGINE_ID environment variable is required');
  }

  return new GoogleCustomSearchService(apiKey, searchEngineId);
}