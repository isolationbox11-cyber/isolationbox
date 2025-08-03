"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Globe, Server, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useZoomEyeSearch, useZoomEyeUser } from "@/lib/use-zoomeye"
import { spookyZoomEyeQueries } from "@/lib/zoomeye"

export function ZoomEyeInterface() {
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<'host' | 'web'>('host')
  const [currentPage, setCurrentPage] = useState(1)
  const [showConnectionStatus, setShowConnectionStatus] = useState(false)

  const { data, loading, error, search, clear } = useZoomEyeSearch()
  const { data: userInfo, loading: userLoading, error: userError, fetchUserInfo } = useZoomEyeUser()

  // Check ZoomEye connection status on mount
  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setCurrentPage(1)
    await search({
      query: query.trim(),
      page: 1,
      type: searchType,
    })
  }

  const handleSuggestionClick = (suggestionQuery: string, type: 'host' | 'web') => {
    setQuery(suggestionQuery)
    setSearchType(type)
  }

  const handlePageChange = async (page: number) => {
    if (!query.trim()) return
    
    setCurrentPage(page)
    await search({
      query: query.trim(),
      page,
      type: searchType,
    })
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'text-red-400 border-red-500/50'
      case 'high': return 'text-orange-400 border-orange-500/50'
      case 'medium': return 'text-yellow-400 border-yellow-500/50'
      case 'low': return 'text-green-400 border-green-500/50'
      default: return 'text-orange-400 border-orange-500/50'
    }
  }

  return (
    <div className="space-y-6">
      {/* ZoomEye Connection Status */}
      <Alert className={`border-orange-500/30 bg-gradient-to-r from-black to-orange-950 text-orange-100 ${showConnectionStatus ? '' : 'cursor-pointer'}`}
             onClick={() => !showConnectionStatus && setShowConnectionStatus(true)}>
        <Eye className="h-4 w-4 text-orange-400" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <span className="text-orange-400 font-bold">👁️ ZoomEye Integration</span> - 
            {userLoading ? ' Connecting to the digital realm...' : 
             userError ? ' ❌ Connection failed' :
             userInfo ? ` ✅ Connected as ${userInfo.email} (${userInfo.plan})` : 
             ' Click to check connection status'}
          </span>
          {!showConnectionStatus && (
            <Button variant="ghost" size="sm" className="text-orange-400 hover:bg-orange-950/30">
              Show Status
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {showConnectionStatus && userInfo && (
        <Card className="border-green-500/30 bg-gradient-to-r from-black to-green-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              ZoomEye Connection Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-300">Plan:</span>
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-black/30">
                  {userInfo.plan}
                </Badge>
              </div>
              {userInfo.resources && (
                <div className="flex justify-between">
                  <span className="text-green-300">Available Searches:</span>
                  <span className="text-green-400">{userInfo.resources.search || 'Unlimited'}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {userError && (
        <Card className="border-red-500/30 bg-gradient-to-r from-black to-red-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              ZoomEye Connection Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300 text-sm">{userError}</p>
            <Button 
              onClick={fetchUserInfo}
              variant="outline" 
              size="sm" 
              className="mt-3 border-red-500/50 text-red-400 hover:bg-red-950/30"
              disabled={userLoading}
            >
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList className="bg-black border border-orange-900/50">
          <TabsTrigger value="search" className="data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-400">
            <Search className="h-4 w-4 mr-2" />Live ZoomEye Search
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-400">
            <Eye className="h-4 w-4 mr-2" />Spectral Queries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* Search Interface */}
          <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Eye className="h-5 w-5" />
                ZoomEye Digital Reconnaissance
              </CardTitle>
              <CardDescription className="text-orange-300/70">
                Live search powered by ZoomEye API - peer into the digital realm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Controls */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-orange-300">Search Query</Label>
                  <Input
                    placeholder="Enter your incantation (e.g., 'device:camera', 'port:80')..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-black/50 border-orange-900/50 text-orange-100 placeholder:text-orange-300/50 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-orange-300">Search Type</Label>
                  <Select value={searchType} onValueChange={(value: 'host' | 'web') => setSearchType(value)}>
                    <SelectTrigger className="bg-black/50 border-orange-900/50 text-orange-100 focus-visible:ring-orange-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-orange-900">
                      <SelectItem value="host">🖥️ Host Search</SelectItem>
                      <SelectItem value="web">🌐 Web Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading || !query.trim()}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 animate-pulse shadow-[0_0_10px_rgba(255,102,0,0.5)]"
                  >
                    {loading ? (
                      <>👁️ Peering...</>
                    ) : (
                      <><Search className="h-4 w-4 mr-2" />Summon</>
                    )}
                  </Button>
                  {data && (
                    <Button 
                      onClick={clear} 
                      variant="outline"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-950"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {error && (
            <Alert className="border-red-500/30 bg-gradient-to-r from-black to-red-950">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {data && (
            <Card className="border-orange-500/30 bg-gradient-to-r from-black/80 to-orange-950/30">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center justify-between">
                  <span>🔮 Digital Séance Results</span>
                  <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-black/30">
                    {data.matches.length} of {data.total} entities summoned
                  </Badge>
                </CardTitle>
                <CardDescription className="text-orange-300/70">
                  Page {currentPage} • Found {data.total} spectral entities in total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.matches.map((result, index) => (
                    <Card key={index} className="bg-black/50 border-orange-900/30 hover:border-orange-700/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Server className="h-4 w-4 text-orange-400" />
                              <span className="font-mono text-orange-300 font-bold">{result.ip}:{result.port}</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <Shield className="h-3 w-3 text-orange-500" />
                                <span className="text-orange-200">{result.protocol}</span>
                              </div>
                              {result.service && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-3 w-3 text-orange-500" />
                                  <span className="text-orange-200">{result.service}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-orange-400 mb-1">Location</h4>
                            <div className="text-xs text-orange-200/80 space-y-1">
                              <div>{result.location.city}, {result.location.country}</div>
                              {result.organization && (
                                <div className="text-orange-300/70">{result.organization}</div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-orange-400 mb-1">Banner</h4>
                            <div className="text-xs text-orange-200/80 font-mono bg-black/30 p-2 rounded border border-orange-900/30">
                              {result.banner ? result.banner.substring(0, 100) + (result.banner.length > 100 ? '...' : '') : 'No banner available'}
                            </div>
                            <div className="text-xs text-orange-300/50 mt-1">
                              {formatTimestamp(result.timestamp)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {data.total > data.matches.length && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                      variant="outline"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-950"
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-orange-300">
                      Page {currentPage}
                    </span>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={data.matches.length < 20 || loading}
                      variant="outline"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-950"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Spectral Search Incantations
              </CardTitle>
              <CardDescription className="text-orange-300/70">
                Pre-configured queries to discover different types of digital entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {spookyZoomEyeQueries.map((suggestion, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/50 border-orange-900/30 hover:border-orange-700/50 cursor-pointer transition-colors group"
                    onClick={() => handleSuggestionClick(suggestion.query, suggestion.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-orange-300 group-hover:text-orange-200">
                          {suggestion.name}
                        </h4>
                        <Badge variant="outline" className={`${getRiskColor(suggestion.risk)} bg-black/30`}>
                          {suggestion.risk}
                        </Badge>
                      </div>
                      <p className="text-xs text-orange-300/70 mb-2">{suggestion.description}</p>
                      <code className="text-xs bg-black/50 px-2 py-1 rounded text-orange-300 block mb-2">
                        {suggestion.query}
                      </code>
                      <p className="text-xs text-orange-500">🔮 {suggestion.explanation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}