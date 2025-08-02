import { useState, useCallback } from 'react';
import { GoogleSearchResponse } from '@/lib/google-search';

interface UseGoogleSearchOptions {
  initialQuery?: string;
  onSuccess?: (results: GoogleSearchResponse) => void;
  onError?: (error: string) => void;
}

interface SearchParams {
  query: string;
  startIndex?: number;
  count?: number;
  siteSearch?: string;
  dateRestrict?: string;
  gl?: string;
  lr?: string;
}

export function useGoogleSearch(options: UseGoogleSearchOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GoogleSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        q: params.query,
        start: (params.startIndex || 1).toString(),
        num: (params.count || 10).toString(),
      });

      if (params.siteSearch) searchParams.append('siteSearch', params.siteSearch);
      if (params.dateRestrict) searchParams.append('dateRestrict', params.dateRestrict);
      if (params.gl) searchParams.append('gl', params.gl);
      if (params.lr) searchParams.append('lr', params.lr);

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data: GoogleSearchResponse = await response.json();
      setResults(data);
      options.onSuccess?.(data);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const searchSecurity = useCallback(async (query: string, startIndex = 1, count = 10) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/search/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          startIndex,
          count,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Security search failed');
      }

      const data: GoogleSearchResponse = await response.json();
      setResults(data);
      options.onSuccess?.(data);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    search,
    searchSecurity,
    clearResults,
    isLoading,
    results,
    error,
    hasResults: results?.items && results.items.length > 0,
    totalResults: results?.searchInformation?.totalResults || '0',
    searchTime: results?.searchInformation?.formattedSearchTime || '0',
  };
}