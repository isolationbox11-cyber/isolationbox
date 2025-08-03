"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Globe, Database, Server, Monitor, ExternalLink, Lightbulb, Skull, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cyberAPI } from "@/lib/cyber-api"

export function SmartCyberSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedPort, setSelectedPort] = useState("")

  const performSearch = async (query: string) => {
    if (!query.trim()) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Build Shodan search query with filters
      let searchTerm = query
      if (selectedCountry && selectedCountry !== "any") searchTerm += ` country:${selectedCountry}`
      if (selectedPort && selectedPort !== "any") searchTerm += ` port:${selectedPort}`
      
      const results = await cyberAPI.searchShodan(searchTerm, 20)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    performSearch(searchQuery)
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    performSearch(query)
  }

  const smartSuggestions = [
    {
      query: "apache",
      description: "Apache web servers",
      icon: Server,
      risk: "medium",
      explanation: "Web servers that may have configuration vulnerabilities"
    },
    {
      query: "mysql",
      description: "MySQL database servers",
      icon: Database,
      risk: "high",
      explanation: "Database servers that might be exposed to the internet"
    },
    {
      query: "ssh",
      description: "SSH services",
      icon: Monitor,
      risk: "high",
      explanation: "Remote access services that could be targeted for brute force attacks"
    },
    {
      query: "ftp",
      description: "FTP servers",
      icon: Globe,
      risk: "medium",
      explanation: "File transfer services that may have weak authentication"
    },
    {
      query: "webcam",
      description: "Internet-connected cameras",
      icon: Monitor,
      risk: "critical",
      explanation: "Security cameras that may lack proper authentication"
    },
    {
      query: "default password",
      description: "Devices with default credentials",
      icon: Skull,
      risk: "critical",
      explanation: "Devices still using factory default passwords"
    }
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "bg-red-600"
      case "high": return "bg-orange-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-orange-300 flex items-center gap-2">
            <Search className="h-6 w-6" />
            🔮 Smart Cyber Search
          </CardTitle>
          <CardDescription className="text-orange-200/70">
            Intelligent search powered by real-time threat intelligence and Shodan API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                <Input
                  placeholder="Enter search query (e.g., 'apache', 'port:22', 'webcam')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-orange-950/20 border-orange-800/30 text-orange-100 placeholder:text-orange-300/50"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-orange-300 text-sm">Country Filter</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="bg-orange-950/20 border-orange-800/30">
                    <SelectValue placeholder="Any Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Country</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CN">China</SelectItem>
                    <SelectItem value="RU">Russia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-orange-300 text-sm">Port Filter</Label>
                <Select value={selectedPort} onValueChange={setSelectedPort}>
                  <SelectTrigger className="bg-orange-950/20 border-orange-800/30">
                    <SelectValue placeholder="Any Port" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Port</SelectItem>
                    <SelectItem value="22">22 (SSH)</SelectItem>
                    <SelectItem value="80">80 (HTTP)</SelectItem>
                    <SelectItem value="443">443 (HTTPS)</SelectItem>
                    <SelectItem value="21">21 (FTP)</SelectItem>
                    <SelectItem value="3389">3389 (RDP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full border-orange-600 text-orange-300 hover:bg-orange-950/20"
                  onClick={() => {
                    setSelectedCountry("any")
                    setSelectedPort("any")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert className="border-red-800/30 bg-red-950/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="border-orange-800/30 bg-black/40">
          <CardHeader>
            <CardTitle className="text-orange-300">Search Results</CardTitle>
            <CardDescription className="text-orange-200/70">
              Found {searchResults.matches?.length || 0} results for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.matches?.map((result: any, index: number) => (
                <div key={index} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-orange-300">{result.ip_str}:{result.port}</h4>
                      <p className="text-xs text-orange-200/60">
                        {result.product || 'Unknown Service'} • {result.location?.city || 'Unknown'}, {result.location?.country_name || 'Unknown'}
                      </p>
                    </div>
                    <Badge className="bg-blue-600">
                      Port {result.port}
                    </Badge>
                  </div>
                  {result.data && (
                    <div className="mt-2 p-2 bg-black/20 rounded text-xs text-orange-100/70 font-mono">
                      {result.data.substring(0, 200)}...
                    </div>
                  )}
                  <div className="mt-2 text-xs text-orange-200/50">
                    Last updated: {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
              )) || (
                <div className="text-center p-6 text-orange-200/60">
                  <Search className="h-8 w-8 mx-auto mb-2" />
                  <p>No results found</p>
                  <p className="text-xs mt-1">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Suggestions */}
      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-orange-300 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Search Suggestions
          </CardTitle>
          <CardDescription className="text-orange-200/70">
            Popular searches with security risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartSuggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20 hover:bg-orange-950/40 transition-colors cursor-pointer"
                onClick={() => handleQuickSearch(suggestion.query)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <suggestion.icon className="h-4 w-4 text-orange-400" />
                    <h4 className="text-sm font-medium text-orange-300">{suggestion.query}</h4>
                  </div>
                  <Badge className={getRiskColor(suggestion.risk)}>
                    {suggestion.risk.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-orange-200/60 mb-2">{suggestion.description}</p>
                <p className="text-xs text-orange-100/50">{suggestion.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}