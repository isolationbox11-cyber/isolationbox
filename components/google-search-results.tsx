import React from 'react';
import { ExternalLink, Globe, Clock, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GoogleSearchResponse, GoogleSearchResult } from '@/lib/google-search';

interface GoogleSearchResultsProps {
  results: GoogleSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

function SearchResultItem({ result }: { result: GoogleSearchResult }) {
  const getThumbnail = () => {
    return result.pagemap?.cse_thumbnail?.[0]?.src || 
           result.pagemap?.cse_image?.[0]?.src;
  };

  const getMetaDescription = () => {
    return result.pagemap?.metatags?.[0]?.description || result.snippet;
  };

  return (
    <div className="group p-4 border border-orange-900/30 rounded-lg hover:bg-orange-950/20 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {getThumbnail() && (
          <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border border-orange-900/50">
            <img 
              src={getThumbnail()} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-orange-200 group-hover:text-orange-100 line-clamp-2">
                <a 
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  dangerouslySetInnerHTML={{ __html: result.htmlTitle }}
                />
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="h-3 w-3 text-orange-500/70" />
                <span className="text-sm text-orange-400/80">{result.displayLink}</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-orange-400/50 group-hover:text-orange-400 transition-colors flex-shrink-0" />
          </div>
          
          <p 
            className="text-sm text-orange-200/80 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: result.htmlSnippet }}
          />
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-black/30 text-xs">
              {new URL(result.link).hostname}
            </Badge>
            {result.cacheId && (
              <Badge variant="outline" className="border-green-500/50 text-green-400 bg-black/30 text-xs">
                Cached
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 border border-orange-900/30 rounded-lg">
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded bg-orange-950/30" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4 bg-orange-950/30" />
              <Skeleton className="h-4 w-1/2 bg-orange-950/30" />
              <Skeleton className="h-4 w-full bg-orange-950/30" />
              <Skeleton className="h-4 w-2/3 bg-orange-950/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GoogleSearchResults({ 
  results, 
  isLoading, 
  error, 
  onLoadMore, 
  hasMore 
}: GoogleSearchResultsProps) {
  if (isLoading && !results) {
    return (
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <SearchIcon className="h-5 w-5 animate-spin" />
            Conjuring Search Results...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchResultsSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-gradient-to-r from-black to-red-950/30">
        <CardHeader>
          <CardTitle className="text-red-400">🔥 Search Spell Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-200/80">
            The digital spirits are restless: {error}
          </p>
          <p className="text-sm text-red-300/60 mt-2">
            Try rephrasing your query or check your mystical connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!results || !results.items || results.items.length === 0) {
    return (
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-400">🦇 No Spirits Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-200/80">
            The digital realm appears empty for your query. Try a different incantation.
          </p>
          <div className="mt-4 p-3 bg-orange-950/20 rounded-lg border border-orange-900/30">
            <p className="text-sm text-orange-300">
              <span className="font-bold">💡 Tips for better results:</span>
            </p>
            <ul className="text-sm text-orange-200/80 mt-1 space-y-1">
              <li>• Use specific security-related terms</li>
              <li>• Try broader or different keywords</li>
              <li>• Check spelling and try synonyms</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Statistics */}
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-200">
                  Found {parseInt(results.searchInformation.totalResults).toLocaleString()} results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-200">
                  in {results.searchInformation.formattedSearchTime} seconds
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-black/30">
              🔮 Powered by Google
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-400">
            🌐 Web Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.items.map((result, index) => (
              <SearchResultItem key={result.cacheId || index} result={result} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && onLoadMore && (
            <div className="mt-6 text-center">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-950/30"
              >
                {isLoading ? (
                  <>
                    <SearchIcon className="h-4 w-4 mr-2 animate-spin" />
                    Summoning More Results...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Load More Entities
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}