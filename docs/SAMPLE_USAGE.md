# Google Custom Search API - Sample Usage

This document provides sample code and usage examples for the Google Custom Search API integration in Salem Cyber Vault.

## Basic Component Usage

### Simple Search Component

```typescript
"use client";

import React, { useState } from 'react';
import { useGoogleSearch } from '@/lib/hooks/use-google-search';
import { GoogleSearchResults } from '@/components/google-search-results';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SimpleSearchExample() {
  const [query, setQuery] = useState('');
  
  const {
    search,
    isLoading,
    results,
    error,
    hasResults,
    clearResults,
  } = useGoogleSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    await search({
      query,
      count: 10,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
        {hasResults && (
          <Button variant="outline" onClick={clearResults}>
            Clear
          </Button>
        )}
      </div>

      <GoogleSearchResults
        results={results}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
```

### Security-Focused Search

```typescript
"use client";

import React, { useState } from 'react';
import { useGoogleSearch } from '@/lib/hooks/use-google-search';
import { GoogleSearchResults } from '@/components/google-search-results';

export function SecuritySearchExample() {
  const [query, setQuery] = useState('');
  
  const {
    searchSecurity,
    isLoading,
    results,
    error,
    totalResults,
    searchTime,
  } = useGoogleSearch({
    onSuccess: (results) => {
      console.log(`Found ${results.searchInformation.totalResults} security-related results`);
    },
    onError: (error) => {
      console.error('Security search failed:', error);
    },
  });

  const handleSecuritySearch = async () => {
    if (!query.trim()) return;
    
    // This automatically enhances the query with security-related terms
    await searchSecurity(query, 1, 10);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-orange-950/20 rounded-lg border border-orange-900/30">
        <h3 className="text-orange-400 font-medium mb-2">🔒 Security-Enhanced Search</h3>
        <p className="text-sm text-orange-200/80 mb-4">
          This search automatically adds security-related terms to improve relevance for cybersecurity research.
        </p>
        
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter security topic (e.g., 'password management', 'vulnerability')"
            className="flex-1 px-3 py-2 bg-black/50 border border-orange-900/50 rounded text-orange-100"
            onKeyPress={(e) => e.key === 'Enter' && handleSecuritySearch()}
          />
          <button
            onClick={handleSecuritySearch}
            disabled={!query.trim() || isLoading}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Security Search'}
          </button>
        </div>
        
        {results && (
          <div className="mt-4 text-sm text-orange-300">
            Found {parseInt(totalResults).toLocaleString()} results in {searchTime}s
          </div>
        )}
      </div>

      <GoogleSearchResults
        results={results}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
```

### Advanced Search with Filters

```typescript
"use client";

import React, { useState } from 'react';
import { useGoogleSearch } from '@/lib/hooks/use-google-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AdvancedSearchExample() {
  const [query, setQuery] = useState('');
  const [siteSearch, setSiteSearch] = useState('');
  const [dateRestrict, setDateRestrict] = useState('');
  const [language, setLanguage] = useState('');
  
  const { search, isLoading, results, error } = useGoogleSearch();

  const handleAdvancedSearch = async () => {
    if (!query.trim()) return;
    
    await search({
      query,
      siteSearch: siteSearch || undefined,
      dateRestrict: dateRestrict || undefined,
      lr: language || undefined,
      count: 10,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query..."
          className="px-3 py-2 border rounded"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Search</label>
            <input
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              placeholder="e.g., github.com"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <Select value={dateRestrict} onValueChange={setDateRestrict}>
              <SelectTrigger>
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any time</SelectItem>
                <SelectItem value="d1">Past day</SelectItem>
                <SelectItem value="w1">Past week</SelectItem>
                <SelectItem value="m1">Past month</SelectItem>
                <SelectItem value="y1">Past year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Any language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any language</SelectItem>
                <SelectItem value="lang_en">English</SelectItem>
                <SelectItem value="lang_es">Spanish</SelectItem>
                <SelectItem value="lang_fr">French</SelectItem>
                <SelectItem value="lang_de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <button
          onClick={handleAdvancedSearch}
          disabled={!query.trim() || isLoading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Advanced Search'}
        </button>
      </div>

      {/* Results would be displayed here */}
    </div>
  );
}
```

## Direct API Usage

### Using the Search Service Directly

```typescript
import { createGoogleSearchService } from '@/lib/google-search';

export async function performBackgroundSearch() {
  try {
    const searchService = createGoogleSearchService();
    
    // Basic search
    const results = await searchService.search({
      query: 'cybersecurity best practices',
      count: 10,
    });
    
    console.log(`Found ${results.searchInformation.totalResults} results`);
    
    // Process results
    results.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ${item.link}`);
      console.log(`   ${item.snippet}`);
    });
    
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Security-enhanced search
export async function performSecuritySearch(topic: string) {
  try {
    const searchService = createGoogleSearchService();
    
    const results = await searchService.searchSecurityContent(topic, {
      count: 10,
      gl: 'us', // US region
      lr: 'lang_en', // English language
    });
    
    return results;
  } catch (error) {
    console.error('Security search failed:', error);
    throw error;
  }
}

// Domain-specific search
export async function searchGitHubForSecurity(query: string) {
  try {
    const searchService = createGoogleSearchService();
    
    const results = await searchService.searchByDomain('github.com', query);
    
    return results;
  } catch (error) {
    console.error('GitHub search failed:', error);
    throw error;
  }
}
```

### API Endpoint Usage

```typescript
// Client-side API calls

// Basic search
export async function clientSearch(query: string) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&num=10`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Search failed');
  }
  
  return response.json();
}

// Security search
export async function clientSecuritySearch(query: string) {
  const response = await fetch('/api/search/security', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      count: 10,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Security search failed');
  }
  
  return response.json();
}

// Advanced search with filters
export async function clientAdvancedSearch(params: {
  query: string;
  siteSearch?: string;
  dateRestrict?: string;
  gl?: string;
  lr?: string;
}) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Advanced search failed');
  }
  
  return response.json();
}
```

## Pagination Example

```typescript
"use client";

import React, { useState, useCallback } from 'react';
import { useGoogleSearch } from '@/lib/hooks/use-google-search';
import { GoogleSearchResults } from '@/components/google-search-results';

export function PaginatedSearchExample() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allResults, setAllResults] = useState<any[]>([]);
  
  const { search, isLoading, results, error } = useGoogleSearch({
    onSuccess: (newResults) => {
      if (currentPage === 1) {
        setAllResults(newResults.items || []);
      } else {
        setAllResults(prev => [...prev, ...(newResults.items || [])]);
      }
    },
  });

  const handleSearch = useCallback(async (page = 1) => {
    if (!query.trim()) return;
    
    setCurrentPage(page);
    const startIndex = (page - 1) * 10 + 1;
    
    await search({
      query,
      startIndex,
      count: 10,
    });
  }, [query, search]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    handleSearch(nextPage);
  }, [currentPage, handleSearch]);

  const hasMoreResults = results?.queries?.nextPage?.[0] !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query..."
          className="flex-1 px-3 py-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
        />
        <button
          onClick={() => handleSearch(1)}
          disabled={!query.trim() || isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {allResults.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Showing {allResults.length} of {results?.searchInformation?.totalResults || 0} results
          </div>
          
          {/* Custom results display */}
          <div className="space-y-4">
            {allResults.map((item, index) => (
              <div key={index} className="p-4 border rounded">
                <h3 className="font-medium text-blue-600 hover:underline">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-600">{item.displayLink}</p>
                <p className="mt-2 text-sm">{item.snippet}</p>
              </div>
            ))}
          </div>
          
          {hasMoreResults && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More Results'}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}
```

## Error Handling Examples

```typescript
import { useGoogleSearch } from '@/lib/hooks/use-google-search';

export function ErrorHandlingExample() {
  const {
    search,
    isLoading,
    results,
    error,
  } = useGoogleSearch({
    onError: (error) => {
      // Custom error handling
      if (error.includes('quota exceeded')) {
        console.log('Search quota exceeded, implement caching or try later');
      } else if (error.includes('API key')) {
        console.log('API key issue, check configuration');
      } else {
        console.log('General search error:', error);
      }
    },
  });

  const handleSearchWithErrorHandling = async (query: string) => {
    try {
      await search({ query });
    } catch (error) {
      // Additional error handling if needed
      if (error instanceof Error) {
        if (error.message.includes('Network')) {
          // Handle network errors
          console.log('Network error, check connection');
        }
      }
    }
  };

  return (
    <div>
      {/* Component JSX */}
      {error && (
        <div className="error-display">
          <h4>Search Error</h4>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
```

These examples demonstrate the flexibility and power of the Google Custom Search integration in Salem Cyber Vault. The API is designed to be simple to use while providing advanced functionality for complex search scenarios.