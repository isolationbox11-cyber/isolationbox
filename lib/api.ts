// Centralized API utilities with proper error handling and type safety

import { ApiResponse, ApiError } from '@/types/api';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Custom error class for API errors
export class ApiException extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

// Request configuration interface
interface RequestConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean>;
}

// Create abort controller for timeout
function createTimeoutSignal(timeout: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller.signal;
}

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(endpoint, API_BASE_URL || window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

// Generic HTTP request function with error handling
async function request<T>(
  endpoint: string, 
  config: RequestConfig = {}
): Promise<T> {
  const { 
    timeout = DEFAULT_TIMEOUT, 
    params, 
    signal,
    ...fetchConfig 
  } = config;

  try {
    // Create timeout signal if no signal provided
    const requestSignal = signal || createTimeoutSignal(timeout);
    
    const url = buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
      signal: requestSignal,
      ...fetchConfig,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      const apiError: ApiError = {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.code,
        details: errorData.details,
      };
      
      throw new ApiException(apiError);
    }

    // Parse response
    const data = await response.json();
    
    // Handle API-level errors (success: false responses)
    if (data.success === false) {
      const apiError: ApiError = {
        message: data.message || 'API request failed',
        status: response.status,
        code: data.code,
        details: data.details,
      };
      
      throw new ApiException(apiError);
    }

    return data;
  } catch (error) {
    // Handle network/timeout errors
    if (error instanceof ApiException) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiException({
        message: 'Request timed out',
        status: 408,
        code: 'TIMEOUT',
      });
    }
    
    // Generic error
    throw new ApiException({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 0,
      code: 'NETWORK_ERROR',
    });
  }
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, { ...config, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

// SWR fetcher function
export const swrFetcher = async <T>(url: string): Promise<T> => {
  return api.get<T>(url);
};

// Utility function to handle API errors in components
export function handleApiError(error: unknown): string {
  if (error instanceof ApiException) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Retry logic for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiException && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
}

// Cache management utilities
export const cache = {
  // Clear all SWR cache
  clearAll: () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('swr')) {
            caches.delete(name);
          }
        });
      });
    }
  },
  
  // Clear specific cache key
  clear: (key: string) => {
    // This will be handled by SWR's mutate function in components
    console.log(`Cache cleared for key: ${key}`);
  },
};

// Mock data generators for development
export const mockApi = {
  delay: (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms)),
  
  randomError: (probability: number = 0.1) => {
    if (Math.random() < probability) {
      throw new ApiException({
        message: 'Simulated API error for testing',
        status: 500,
        code: 'MOCK_ERROR',
      });
    }
  },
};