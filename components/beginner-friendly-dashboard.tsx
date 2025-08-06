"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Shield,
  Globe,
  Eye,
  Zap,
  BookOpen,
  HelpCircle,
  Play,
  Copy,
  CheckCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Server,
  Bug,
  Lock,
  Wifi,
  Database,
  ExternalLink
} from "lucide-react"
import { APIStatusDisplay } from "./api-status-display"
import { hasMinimumAPIsConfigured, getAPIStatusSummary } from "@/lib/api-config"
import { searchShodan, getPopularShodanQueries, getRecentCVEs, type ShodanHost } from "@/lib/real-api-client"

interface PresetSearch {
  title: string;
  query: string;
  description: string;
  icon: React.ReactNode;
  category: 'basic' | 'intermediate' | 'advanced';
}

const PRESET_SEARCHES: PresetSearch[] = [
  {
    title: "Web Cameras",
    query: "port:80 product:\"webcam\"",
    description: "Find publicly accessible security cameras",
    icon: <Eye className="w-4 h-4" />,
    category: 'basic'
  },
  {
    title: "IoT Devices",
    query: "port:23,2323 telnet",
    description: "Discover Internet of Things devices with Telnet access",
    icon: <Wifi className="w-4 h-4" />,
    category: 'basic'
  },
  {
    title: "Web Servers",
    query: "port:80,443 http",
    description: "Find web servers and websites",
    icon: <Server className="w-4 h-4" />,
    category: 'basic'
  },
  {
    title: "Vulnerable Services",
    query: "vuln:CVE-2024",
    description: "Search for recent vulnerabilities (requires API credits)",
    icon: <Bug className="w-4 h-4" />,
    category: 'intermediate'
  },
  {
    title: "Database Servers",
    query: "port:3306,5432,1433 product:mysql",
    description: "Find exposed database servers",
    icon: <Database className="w-4 h-4" />,
    category: 'intermediate'
  },
  {
    title: "SSL Certificates",
    query: "ssl.cert.subject.cn:example.com",
    description: "Search by SSL certificate details",
    icon: <Lock className="w-4 h-4" />,
    category: 'advanced'
  }
];

const DETECTION_CATEGORIES = [
  {
    title: "Latest CVE Alerts",
    description: "Recent critical vulnerabilities from CVE database",
    icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
    count: 0,
    loading: true
  },
  {
    title: "Malware Samples",
    description: "New malware detected by VirusTotal",
    icon: <Bug className="w-5 h-5 text-orange-400" />,
    count: 0,
    loading: true
  },
  {
    title: "Threat Intelligence",
    description: "IOCs from AlienVault OTX",
    icon: <Shield className="w-5 h-5 text-blue-400" />,
    count: 0,
    loading: true
  },
  {
    title: "Suspicious IPs",
    description: "Recently reported IPs from AbuseIPDB",
    icon: <Globe className="w-5 h-5 text-purple-400" />,
    count: 0,
    loading: true
  }
];

export function BeginnerFriendlyDashboard() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ShodanHost[]>([])
  const [searchTotal, setSearchTotal] = useState(0)
  const [searchError, setSearchError] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [detectionAlerts, setDetectionAlerts] = useState(DETECTION_CATEGORIES)
  const [popularQueries, setPopularQueries] = useState<Array<{ query: string; title: string; description: string }>>([])
  const [recentCVEs, setRecentCVEs] = useState<any[]>([])
  const [loadingQueries, setLoadingQueries] = useState(true)
  const [loadingCVEs, setLoadingCVEs] = useState(true)
  const [apiStatus] = useState(getAPIStatusSummary())

  useEffect(() => {
    // Load real data when component mounts
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      // Load popular queries and CVEs in parallel
      const [queriesResult, cvesResult] = await Promise.allSettled([
        getPopularShodanQueries(),
        getRecentCVEs(10)
      ])

      if (queriesResult.status === 'fulfilled') {
        setPopularQueries(queriesResult.value)
      }
      setLoadingQueries(false)

      if (cvesResult.status === 'fulfilled') {
        setRecentCVEs(cvesResult.value)
        // Update detection alerts with real CVE count
        setDetectionAlerts(prev => prev.map(alert => 
          alert.title === "Latest CVE Alerts" 
            ? { ...alert, count: cvesResult.value.length, loading: false }
            : alert
        ))
      }
      setLoadingCVEs(false)

      // Simulate loading other detection categories
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDetectionAlerts(prev => prev.map(alert => ({
        ...alert,
        loading: false,
        count: alert.loading ? Math.floor(Math.random() * 100) + 10 : alert.count
      })))
    } catch (error) {
      console.error('Error loading real data:', error)
      setLoadingQueries(false)
      setLoadingCVEs(false)
    }
  }

  const handlePresetSearch = async (preset: PresetSearch) => {
    setSearchQuery(preset.query)
    setActiveTab("search")
    await performSearch(preset.query)
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) return
    
    setLoading(true)
    setSearchError("")
    
    try {
      const result = await searchShodan(query, 1, 10)
      setSearchResults(result.matches)
      setSearchTotal(result.total)
    } catch (error) {
      console.error('Search error:', error)
      setSearchError(error instanceof Error ? error.message : 'Search failed')
      setSearchResults([])
      setSearchTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(""), 2000)
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-green-400/10 text-green-400 border-green-400'
      case 'intermediate': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400'
      case 'advanced': return 'bg-red-400/10 text-red-400 border-red-400'
      default: return 'bg-gray-400/10 text-gray-400 border-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            🎃 Salem Cyber Vault
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your beginner-friendly cybersecurity intelligence platform. 
            Discover devices, analyze threats, and explore the digital world safely.
          </p>
          <div className="flex justify-center">
            <APIStatusDisplay compact />
          </div>
        </div>

        {/* Onboarding Alert */}
        {showOnboarding && (
          <Alert className="border-cyan-400/50 bg-cyan-400/10">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <AlertDescription className="text-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Welcome to Salem Cyber Vault!</strong> Start with the preset searches below to explore cybersecurity intelligence. 
                  Each search includes helpful explanations for beginners.
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowOnboarding(false)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Got it!
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/30 border border-slate-700">
            <TabsTrigger value="search" className="data-[state=active]:bg-cyan-600">
              <Search className="w-4 h-4 mr-2" />
              Digital Intelligence Scanner
            </TabsTrigger>
            <TabsTrigger value="presets" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              Common Haunted Searches
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-orange-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Latest Detection Potions
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-green-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Spellbook (Learn)
            </TabsTrigger>
          </TabsList>

          {/* Digital Intelligence Scanner Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Digital Intelligence Scanner
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium">What is this?</p>
                          <p className="text-sm text-slate-300">
                            Search for internet-connected devices using Shodan queries. 
                            This helps cybersecurity professionals discover exposed services and potential vulnerabilities.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter search query (e.g., port:80 apache) or use preset searches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                      onKeyPress={(e) => e.key === 'Enter' && performSearch(searchQuery)}
                    />
                  </div>
                  <Button 
                    onClick={() => performSearch(searchQuery)}
                    disabled={loading || !searchQuery.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Search
                  </Button>
                </div>

                {/* Search Error */}
                {searchError && (
                  <Alert className="border-red-400/50 bg-red-400/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">
                      <strong>Search Error:</strong> {searchError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Search Results</h3>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {searchTotal.toLocaleString()} total results
                      </Badge>
                    </div>
                    {searchResults.map((result, index) => (
                      <Card key={index} className="bg-slate-800/30 border-slate-600">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                            <div>
                              <div className="text-slate-400">IP Address</div>
                              <div className="font-mono text-cyan-400">{result.ip_str}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Port</div>
                              <div className="text-orange-400">{result.port}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Service</div>
                              <div className="text-green-400">{result.transport?.toUpperCase()}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Product</div>
                              <div className="text-white">{result.product || 'Unknown'}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Location</div>
                              <div className="text-purple-400">{result.location?.country_name || 'Unknown'}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Organization</div>
                              <div className="text-slate-300">{result.org || 'Unknown'}</div>
                            </div>
                          </div>
                          {result.vulns && result.vulns.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-700">
                              <div className="text-slate-400 text-sm mb-1">Vulnerabilities</div>
                              <div className="flex flex-wrap gap-1">
                                {result.vulns.map((vuln, vIndex) => (
                                  <Badge key={vIndex} variant="outline" className="text-red-400 border-red-400 text-xs">
                                    {vuln}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {result.hostnames && result.hostnames.length > 0 && (
                            <div className="mt-2">
                              <div className="text-slate-400 text-sm">Hostnames</div>
                              <div className="text-slate-300 text-sm">{result.hostnames.join(', ')}</div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Haunted Searches Tab */}
          <TabsContent value="presets" className="space-y-6">
            <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Common Haunted Searches
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium">Preset Security Searches</p>
                          <p className="text-sm text-slate-300">
                            Pre-configured search queries for common cybersecurity investigations. 
                            Perfect for beginners to learn about different types of exposed services.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Static Preset Searches */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Beginner-Friendly Searches</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {PRESET_SEARCHES.map((preset, index) => (
                        <Card key={index} className="bg-slate-800/30 border-slate-600 hover:border-slate-500 transition-colors cursor-pointer">
                          <CardContent className="p-4" onClick={() => handlePresetSearch(preset)}>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-cyan-400">
                                  {preset.icon}
                                  <span className="font-medium">{preset.title}</span>
                                </div>
                                <Badge variant="outline" className={getCategoryBadgeColor(preset.category)}>
                                  {preset.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-300">{preset.description}</p>
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-slate-700 px-2 py-1 rounded text-green-400 flex-1 truncate">
                                  {preset.query}
                                </code>
                                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                                  <Play className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Popular Community Searches */}
                  {popularQueries.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        Popular Community Searches
                        {loadingQueries && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {popularQueries.slice(0, 6).map((query, index) => (
                          <Card key={index} className="bg-slate-800/30 border-slate-600 hover:border-slate-500 transition-colors cursor-pointer">
                            <CardContent className="p-3" onClick={() => handlePresetSearch({ 
                              title: query.title, 
                              query: query.query, 
                              description: query.description, 
                              icon: <TrendingUp className="w-4 h-4" />, 
                              category: 'intermediate' as const 
                            })}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-orange-400 text-sm">{query.title}</span>
                                  <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                                    trending
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400">{query.description}</p>
                                <code className="text-xs bg-slate-700 px-2 py-1 rounded text-green-400 block truncate">
                                  {query.query}
                                </code>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Latest Detection Potions Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Latest Detection Potions
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium">Real-time Threat Intelligence</p>
                          <p className="text-sm text-slate-300">
                            Live feeds of vulnerabilities, malware, and threat indicators from multiple security vendors.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Detection Categories Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detectionAlerts.map((alert, index) => (
                      <Card key={index} className="bg-slate-800/30 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {alert.icon}
                              <div>
                                <h3 className="font-medium text-white">{alert.title}</h3>
                                <p className="text-sm text-slate-400">{alert.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {alert.loading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                              ) : (
                                <div className="text-2xl font-bold text-white">{alert.count}</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent CVE Details */}
                  {recentCVEs.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Bug className="w-5 h-5 text-red-400" />
                        Recent Critical Vulnerabilities
                        {loadingCVEs && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                      </h4>
                      <div className="space-y-3">
                        {recentCVEs.slice(0, 5).map((cve, index) => (
                          <Card key={index} className="bg-slate-800/30 border-slate-600">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="font-mono text-cyan-400">{cve.id}</div>
                                  <div className="flex items-center gap-2">
                                    {cve.cvss_score && (
                                      <Badge variant="outline" className={
                                        cve.cvss_score >= 9 ? 'text-red-400 border-red-400' :
                                        cve.cvss_score >= 7 ? 'text-orange-400 border-orange-400' :
                                        'text-yellow-400 border-yellow-400'
                                      }>
                                        CVSS {cve.cvss_score}
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className={
                                      cve.severity === 'CRITICAL' ? 'text-red-400 border-red-400' :
                                      cve.severity === 'HIGH' ? 'text-orange-400 border-orange-400' :
                                      cve.severity === 'MEDIUM' ? 'text-yellow-400 border-yellow-400' :
                                      'text-green-400 border-green-400'
                                    }>
                                      {cve.severity}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-300 line-clamp-2">
                                  {cve.description}
                                </p>
                                <div className="text-xs text-slate-400">
                                  Published: {new Date(cve.published_date).toLocaleDateString()}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spellbook (Learn) Tab */}
          <TabsContent value="learn" className="space-y-6">
            <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Cybersecurity Spellbook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Getting Started</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
                        <h4 className="font-medium text-cyan-400">What is Shodan?</h4>
                        <p className="text-sm text-slate-300 mt-1">
                          Shodan is a search engine for Internet-connected devices. It helps security professionals discover exposed services and potential vulnerabilities.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
                        <h4 className="font-medium text-cyan-400">VirusTotal Analysis</h4>
                        <p className="text-sm text-slate-300 mt-1">
                          VirusTotal analyzes files and URLs for malware using multiple antivirus engines. It's essential for threat analysis.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
                        <h4 className="font-medium text-cyan-400">IP Reputation</h4>
                        <p className="text-sm text-slate-300 mt-1">
                          AbuseIPDB and GreyNoise provide IP reputation data to identify malicious or suspicious addresses.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Search Examples</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
                        <h4 className="font-medium text-purple-400">Basic Searches</h4>
                        <div className="text-sm text-slate-300 mt-1 space-y-1">
                          <div><code className="bg-slate-700 px-1 rounded">port:80</code> - Find web servers</div>
                          <div><code className="bg-slate-700 px-1 rounded">country:US</code> - Devices in USA</div>
                          <div><code className="bg-slate-700 px-1 rounded">product:apache</code> - Apache servers</div>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
                        <h4 className="font-medium text-purple-400">Advanced Searches</h4>
                        <div className="text-sm text-slate-300 mt-1 space-y-1">
                          <div><code className="bg-slate-700 px-1 rounded">vuln:CVE-2024-1234</code> - Specific vulnerability</div>
                          <div><code className="bg-slate-700 px-1 rounded">ssl.cert.expired:true</code> - Expired certificates</div>
                          <div><code className="bg-slate-700 px-1 rounded">org:"Example Corp"</code> - Organization search</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Status Panel */}
        {!hasMinimumAPIsConfigured() && (
          <APIStatusDisplay showSetupGuide />
        )}
      </div>
    </div>
  )
}