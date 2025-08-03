/**
 * ZoomEye React Hooks
 * Client-side hooks for interacting with ZoomEye API through our secure backend
 * Halloween-themed cybersecurity monitoring for Salem Cyber Vault
 */

import { useState, useCallback } from 'react';
import { ZoomEyeApiResponse, ZoomEyeSearchParams } from './zoomeye';

interface UseZoomEyeSearchResult {
  data: ZoomEyeApiResponse | null;
  loading: boolean;
  error: string | null;
  search: (params: ZoomEyeSearchParams) => Promise<void>;
  clear: () => void;
}

interface UseZoomEyeUserResult {
  data: any | null;
  loading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<void>;
}

/**
 * Hook for performing ZoomEye searches through our secure backend
 */
export function useZoomEyeSearch(): UseZoomEyeSearchResult {
  const [data, setData] = useState<ZoomEyeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: ZoomEyeSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/zoomeye/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, search, clear };
}

/**
 * Hook for getting ZoomEye user information
 */
export function useZoomEyeUser(): UseZoomEyeUserResult {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/zoomeye/user', {
        method: 'GET',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user info');
      }

      setData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchUserInfo };
}