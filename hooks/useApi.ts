// Custom hooks for API data fetching with SWR

import swr, { mutate } from 'swr';
import { swrFetcher, handleApiError } from '@/lib/api';
import { 
  CyberSearchResponse, 
  CyberSearchFilters, 
  DashboardMetrics, 
  ApiResponse 
} from '@/types/api';

const useSWR = swr;

// Hook for cyber search with caching and real-time updates
export function useCyberSearch(filters: CyberSearchFilters) {
  // Build cache key from filters
  const cacheKey = filters.query 
    ? `/api/cyber-search?${new URLSearchParams({
        query: filters.query,
        ...(filters.country && { country: filters.country }),
        ...(filters.service && { service: filters.service }),
        ...(filters.page && { page: filters.page.toString() }),
        ...(filters.perPage && { perPage: filters.perPage.toString() }),
      }).toString()}`
    : null;

  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<CyberSearchResponse>>(
    cacheKey,
    swrFetcher,
    {
      // Refresh every 30 seconds for live updates
      refreshInterval: 30000,
      // Revalidate on focus for fresh data
      revalidateOnFocus: true,
      // Don't retry on error immediately
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      // Keep previous data while loading new data
      keepPreviousData: true,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  return {
    data: data?.data,
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
    // Helper to clear cache and refetch
    refresh: () => {
      if (cacheKey) {
        mutate(cacheKey);
      }
    },
  };
}

// Hook for dashboard metrics
export function useDashboardMetrics() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      // Refresh every 10 seconds for real-time dashboard
      refreshInterval: 10000,
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 3000,
    }
  );

  return {
    data: data?.data,
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
    refresh: () => mutate('/api/dashboard'),
  };
}

// Hook for security score with optimistic updates
export function useSecurityScore() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
    }
  );

  return {
    securityScore: data?.data?.securityScore,
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
  };
}

// Hook for threat intelligence
export function useThreatIntelligence() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 20000, // Slower refresh for threat intel
      revalidateOnFocus: true,
    }
  );

  return {
    threats: data?.data?.threats || [],
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
  };
}

// Hook for recent events with real-time updates
export function useRecentEvents() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 5000, // Very frequent updates for events
      revalidateOnFocus: true,
    }
  );

  return {
    events: data?.data?.recentEvents || [],
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
  };
}

// Hook for system status
export function useSystemStatus() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 8000,
      revalidateOnFocus: true,
    }
  );

  return {
    status: data?.data?.systemStatus || [],
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
  };
}

// Hook for alerts with high priority refresh
export function useAlerts() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 6000, // Frequent updates for alerts
      revalidateOnFocus: true,
      errorRetryCount: 5, // More retries for critical alerts
    }
  );

  return {
    alerts: data?.data?.alerts || [],
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
  };
}

// Hook for IoT devices
export function useIoTDevices() {
  const { data, error, isLoading, mutate: refetch } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 12000,
      revalidateOnFocus: true,
    }
  );

  return {
    devices: data?.data?.iotDevices || [],
    isLoading,
    isError: !!error,
    error: error ? handleApiError(error) : null,
    refetch: () => refetch(),
  };
}

// Utility hook to clear all cached data
export function useCacheManager() {
  const clearAll = () => {
    // Clear specific API caches
    mutate('/api/dashboard');
    // Clear all cyber search caches
    mutate(key => typeof key === 'string' && key.startsWith('/api/cyber-search'));
  };

  const clearDashboard = () => {
    mutate('/api/dashboard');
  };

  const clearSearch = () => {
    mutate(key => typeof key === 'string' && key.startsWith('/api/cyber-search'));
  };

  return {
    clearAll,
    clearDashboard,
    clearSearch,
  };
}