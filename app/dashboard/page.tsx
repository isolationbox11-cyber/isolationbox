"use client"

import { useState } from "react"
import { Search, Eye, Shield, AlertTriangle, ExternalLink, Loader2, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { unifiedSearch } from "@/app/utils/apis"

interface ApiResponse {
  source: string;
  data: any[];
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

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ApiResponse[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      const results = await unifiedSearch(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'critical': return 'text-red-500 border-red-500/50'
      case 'high': return 'text-red-400 border-red-400/50'
      case 'medium': return 'text-yellow-500 border-yellow-500/50'
      case 'low': return 'text-green-500 border-green-500/50'
      default: return 'text-blue-500 border-blue-500/50'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 space-y-6 p-8 blue-bg-texture min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Eye className="h-10 w-10 text-blue-500 animate-pulse-blue" />
          Cyber Research Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Unified Intelligence Platform</span>
          <Shield className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      {/* Main Search Interface */}
      <Card className="border-blue-500/30 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Search className="h-5 w-5" />
            Unified Cyber Intelligence Search
          </CardTitle>
          <CardDescription>
            Search across Shodan, VirusTotal, GreyNoise, AlienVault OTX, CISA CVE, and Google Dorking simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500/70" />
              <Input
                placeholder="Enter IP address, domain, hash, CVE, or search term..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-blue-500/30 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={isSearching}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 blue-glow-button"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isSearching ? "Searching..." : "Search All APIs"}
            </Button>
          </div>

          {/* Example searches */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Examples:</span>
            {[
              "apache",
              "8.8.8.8", 
              "google.com",
              "CVE-2023-38408",
              "webcam"
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(example)}
                className="text-xs border-blue-500/30 text-blue-600 hover:bg-blue-50"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-500" />
            Search Results for "{searchQuery}"
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((apiResult, index) => (
              <Card key={index} className="border-blue-500/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-blue-600">{apiResult.source}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-blue-500/70" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getApiDescription(apiResult.source)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {apiResult.status === 'loading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {apiResult.status === 'error' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {apiResult.status === 'success' && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {apiResult.data.length} result(s)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {apiResult.error ? (
                    <Alert className="border-red-500/30">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {apiResult.error}
                      </AlertDescription>
                    </Alert>
                  ) : apiResult.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No results found</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {apiResult.data.map((result: SearchResult, resultIndex) => (
                        <div key={resultIndex} className="p-3 border border-blue-500/20 rounded-lg bg-background/30">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm truncate flex-1">{result.title}</h4>
                            <div className="flex gap-1">
                              {result.risk && (
                                <Badge variant="outline" className={`text-xs ${getRiskColor(result.risk)}`}>
                                  {result.risk}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.title)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {result.description}
                          </p>
                          
                          {/* Metadata */}
                          {result.metadata && Object.keys(result.metadata).length > 0 && (
                            <div className="space-y-1">
                              {Object.entries(result.metadata).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-muted-foreground capitalize">{key}:</span>
                                  <code className="bg-blue-500/10 px-1 rounded text-blue-600">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value).substring(0, 30)}
                                  </code>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {result.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(result.url, '_blank')}
                              className="w-full mt-2 text-xs border-blue-500/30 text-blue-600 hover:bg-blue-50"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Information Panel */}
      {!hasSearched && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-blue-500/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-600">🔍 About This Dashboard</CardTitle>
              <CardDescription>
                Unified cyber research platform for security intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This dashboard provides a unified interface to query multiple cyber intelligence APIs simultaneously:
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  "Shodan: Internet-connected device search",
                  "VirusTotal: File and URL reputation analysis", 
                  "GreyNoise: Internet noise and threat classification",
                  "AlienVault OTX: Open threat intelligence",
                  "CISA CVE: Vulnerability database search",
                  "Google Dorking: Advanced search techniques"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-600">⚠️ Usage Guidelines</CardTitle>
              <CardDescription>
                Ethical and responsible use guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-500/30">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Research Only:</strong> This tool is for legitimate security research, 
                  education, and defensive purposes only.
                </AlertDescription>
              </Alert>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Only query data that is publicly accessible</li>
                <li>• Respect API rate limits and terms of service</li>
                <li>• Do not attempt unauthorized access to systems</li>
                <li>• Report vulnerabilities through proper channels</li>
                <li>• Follow responsible disclosure practices</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function getApiDescription(source: string): string {
  const descriptions: Record<string, string> = {
    'Shodan': 'Search engine for Internet-connected devices and services',
    'VirusTotal': 'Analyzes files and URLs for viruses, worms, trojans and other malware',
    'GreyNoise': 'Identifies and classifies Internet background noise and threats',
    'AlienVault OTX': 'Open threat intelligence platform with community-driven data',
    'CISA CVE': 'National Vulnerability Database for known security vulnerabilities',
    'Google Dorking': 'Advanced Google search techniques to find security-relevant information',
    'Yandex Dorking': 'Advanced Yandex search techniques for intelligence gathering'
  }
  return descriptions[source] || 'Cyber intelligence data source'
}