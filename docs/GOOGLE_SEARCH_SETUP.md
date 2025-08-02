# Google Custom Search API Integration

This document provides comprehensive instructions for setting up and using the Google Custom Search API integration in the Salem Cyber Vault project.

## Overview

The Google Custom Search API integration allows users to perform web searches directly from the Salem Cyber Vault dashboard. The integration includes:

- Secure server-side API key management
- Custom search interface with Halloween cybersecurity theme
- Security-focused search enhancements
- Pagination and result management
- Error handling and loading states

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Custom Search API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click on it and press "Enable"

### 2. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Recommended) Restrict the API key:
   - Click on the API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Custom Search API"
   - Under "Application restrictions", you can restrict by HTTP referrers for additional security

### 3. Create Custom Search Engine

1. Go to [Google Custom Search Engine](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. Enter configuration:
   - **Sites to search**: Enter `*` to search the entire web, or specify particular domains
   - **Name**: "Salem Cyber Vault Security Search" (or your preferred name)
   - **Language**: Select your preferred language
4. Click "Create"
5. After creation, click "Control Panel" for your search engine
6. Copy the "Search engine ID" (format: `xxxxxxxxx:xxxxxxxxx`)

### 4. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local`:
   ```env
   GOOGLE_CUSTOM_SEARCH_API_KEY=your_actual_api_key_here
   GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here
   NEXT_PUBLIC_APP_NAME=Salem Cyber Vault
   ```

### 5. Verify Installation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/dashboard/cyber-search`
3. Click on the "Google Search" tab
4. Try a test search query

## API Endpoints

### `/api/search` (GET/POST)

General Google Custom Search endpoint.

**GET Parameters:**
- `q` (required): Search query
- `start` (optional): Starting index (default: 1)
- `num` (optional): Number of results (default: 10, max: 10)
- `siteSearch` (optional): Restrict to specific site
- `dateRestrict` (optional): Date restriction
- `gl` (optional): Geolocation
- `lr` (optional): Language restriction

**POST Body:**
```json
{
  "query": "cybersecurity best practices",
  "startIndex": 1,
  "count": 10,
  "siteSearch": "example.com",
  "dateRestrict": "m1",
  "gl": "us",
  "lr": "lang_en",
  "safe": "active"
}
```

### `/api/search/security` (GET/POST)

Security-enhanced search endpoint that automatically adds security-related terms to improve relevance.

**Example usage:**
```javascript
// Search for general term with security focus
fetch('/api/search/security', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'password management',
    count: 10
  })
})
```

## Component Usage

### useGoogleSearch Hook

```typescript
import { useGoogleSearch } from '@/lib/hooks/use-google-search';

function MyComponent() {
  const {
    search,
    searchSecurity,
    isLoading,
    results,
    error,
    hasResults,
    totalResults,
    searchTime,
    clearResults,
  } = useGoogleSearch({
    onSuccess: (results) => console.log('Search successful:', results),
    onError: (error) => console.error('Search failed:', error),
  });

  const handleSearch = async () => {
    await search({
      query: 'cybersecurity framework',
      startIndex: 1,
      count: 10,
    });
  };

  const handleSecuritySearch = async () => {
    await searchSecurity('malware analysis', 1, 10);
  };

  // Component JSX...
}
```

### GoogleSearchResults Component

```typescript
import { GoogleSearchResults } from '@/components/google-search-results';

function SearchPage() {
  return (
    <GoogleSearchResults
      results={results}
      isLoading={isLoading}
      error={error}
      onLoadMore={() => loadMoreResults()}
      hasMore={hasMoreResults}
    />
  );
}
```

## Service Layer

### GoogleCustomSearchService

The core service class provides methods for interacting with the Google Custom Search API:

```typescript
import { createGoogleSearchService } from '@/lib/google-search';

// Create service instance (reads from environment variables)
const searchService = createGoogleSearchService();

// Basic search
const results = await searchService.search({
  query: 'penetration testing tools',
  count: 10,
});

// Security-focused search
const securityResults = await searchService.searchSecurityContent('vulnerability assessment');

// Domain-specific search
const domainResults = await searchService.searchByDomain('github.com', 'security tools');
```

## Security Considerations

### API Key Protection

- ✅ API key is stored server-side only
- ✅ Environment variables are not exposed to client
- ✅ API routes handle all external requests
- ✅ Rate limiting handled by Google's API quotas

### Input Validation

- ✅ Query parameters are validated
- ✅ XSS protection through proper HTML escaping
- ✅ Safe search enabled by default
- ✅ Error handling prevents information leakage

### Best Practices

1. **Monitor API Usage**: Check your Google Cloud Console for API usage and quotas
2. **Implement Caching**: Consider implementing result caching for frequently searched terms
3. **Rate Limiting**: Implement client-side debouncing to reduce API calls
4. **Error Handling**: Always handle API errors gracefully

## Customization

### Search Engine Configuration

In your Google Custom Search Engine control panel, you can:

- Add specific sites to search or exclude
- Configure SafeSearch settings
- Add custom refinements and filters
- Configure the look and feel (though this integration uses a custom UI)

### UI Customization

The search interface uses the Salem Cyber Vault Halloween theme. Key customization points:

- **Colors**: Modify the orange/black color scheme in the components
- **Icons**: Replace Lucide React icons with custom ones
- **Layout**: Adjust the card layouts and spacing
- **Animation**: Modify the loading states and transitions

### Advanced Features

#### Custom Search Operators

The integration supports Google's search operators:

- `site:example.com` - Search specific site
- `filetype:pdf` - Search for specific file types  
- `"exact phrase"` - Exact phrase matching
- `-excluded` - Exclude terms
- `OR` - Alternative terms

#### Date Restrictions

Use the `dateRestrict` parameter:
- `d1` - Past day
- `w1` - Past week
- `m1` - Past month
- `y1` - Past year

## Troubleshooting

### Common Issues

**Error: "API key not provided"**
- Check that `GOOGLE_CUSTOM_SEARCH_API_KEY` is set in `.env.local`
- Ensure the file is properly loaded (restart dev server)

**Error: "Search engine ID not provided"**
- Check that `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` is set in `.env.local`
- Verify the search engine ID format is correct

**Error: "API quota exceeded"**
- Check your Google Cloud Console for quota limits
- Google Custom Search API has a free tier limit of 100 searches per day

**No results returned**
- Verify your Custom Search Engine is configured to search the entire web (`*`)
- Check if the search query is too specific
- Ensure SafeSearch settings match your expectations

### Debug Mode

To enable additional logging, add debug statements in the service:

```typescript
// In google-search.ts
console.log('Search request:', {
  query,
  apiKey: apiKey.substring(0, 10) + '...',
  searchEngineId
});
```

## API Quotas and Limits

### Free Tier
- 100 search queries per day
- 10 results per query maximum

### Paid Tier
- 10,000 queries per day
- $5 per 1,000 additional queries
- Same 10 results per query limit

## Support and Resources

### Google Documentation
- [Custom Search API Reference](https://developers.google.com/custom-search/v1/reference)
- [Custom Search Engine Help](https://support.google.com/customsearch/)

### Project Resources
- Check the `lib/google-search.ts` file for service implementation
- Review `components/google-search-results.tsx` for UI components
- Examine `app/api/search/route.ts` for API endpoint implementation

## Contributing

When contributing to the Google Custom Search integration:

1. Follow the existing code style and patterns
2. Add proper TypeScript types for any new features
3. Include error handling for all API calls
4. Maintain the Halloween cybersecurity theme consistency
5. Add appropriate tests for new functionality
6. Update this documentation for any changes