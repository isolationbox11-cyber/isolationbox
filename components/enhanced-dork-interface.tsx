"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Filter, 
  Globe, 
  Database, 
  Server, 
  Monitor, 
  ExternalLink, 
  Lightbulb, 
  Skull, 
  Ghost, 
  Copy,
  Eye,
  Shield,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Link
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  googleDorks, 
  yandexDorks, 
  halloweenThemedDorks,
  searchEngines,
  generateSearchUrl,
  getAllCategories,
  getDorksByCategory,
  getRiskColor,
  type DorkQuery,
  type SearchEngine
} from "@/lib/dork-libraries"

interface SearchResult {
  title: string
  url: string
  snippet: string
  displayUrl: string
}

const mockGoogleResults: SearchResult[] = [
  {
    title: "Exposed Configuration File - config.env",
    url: "https://example-vulnerable-site.com/config/.env",
    snippet: "DB_PASSWORD=admin123 API_KEY=sk_test_abc123... This file contains sensitive database credentials and API keys that should not be publicly accessible.",
    displayUrl: "example-vulnerable-site.com"
  },
  {
    title: "Database Configuration | Internal Server",
    url: "https://internal-server.example.org/backup/.env",
    snippet: "Environment configuration file with database settings... SECRET_KEY=super_secret_key_here STRIPE_KEY=rk_live_...",
    displayUrl: "internal-server.example.org"
  },
  {
    title: "Application Settings - Development Environment",
    url: "https://dev.company.com/settings/env",
    snippet: "Development environment variables file... Contains API keys, database passwords, and other sensitive configuration data.",
    displayUrl: "dev.company.com"
  }
]

const mockYandexResults: SearchResult[] = [
  {
    title: "Открытая папка администратора - Admin Directory",
    url: "https://ru-server.example.ru/admin/",
    snippet: "Административная панель сервера. Administrative server panel with exposed directory listing containing sensitive files.",
    displayUrl: "ru-server.example.ru"
  },
  {
    title: "Конфигурация сервера | Server Configuration",
    url: "https://internal.example.org.ru/config/",
    snippet: "Server configuration files and admin tools... Панель администратора с настройками сервера.",
    displayUrl: "internal.example.org.ru"
  }
]

export function EnhancedDorkInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(searchEngines[0])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRisk, setSelectedRisk] = useState("all")
  const [activeTab, setActiveTab] = useState("google")
  const [showResults, setShowResults] = useState(false)
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([])
  const [copiedText, setCopiedText] = useState("")

  const allDorks = activeTab === "google" ? googleDorks : 
                   activeTab === "yandex" ? yandexDorks : 
                   halloweenThemedDorks

  const categories = getAllCategories(allDorks)
  const filteredDorks = allDorks.filter(dork => {
    const categoryMatch = selectedCategory === "all" || dork.category === selectedCategory
    const riskMatch = selectedRisk === "all" || dork.risk === selectedRisk
    return categoryMatch && riskMatch
  })

  const handleDorkClick = (dork: DorkQuery) => {
    setSearchQuery(dork.query)
    
    // Show mock results for demo purposes
    setCurrentResults(activeTab === "yandex" ? mockYandexResults : mockGoogleResults)
    setShowResults(true)
    
    // Also open the actual search in a new tab
    const searchUrl = generateSearchUrl(selectedEngine, dork.query)
    window.open(searchUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCustomSearch = () => {
    if (!searchQuery.trim()) return
    
    // Show mock results for demo purposes
    setCurrentResults(activeTab === "yandex" ? mockYandexResults : mockGoogleResults)
    setShowResults(true)
    
    // Open the actual search in a new tab
    const searchUrl = generateSearchUrl(selectedEngine, searchQuery)
    window.open(searchUrl, '_blank', 'noopener,noreferrer')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(""), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <Alert className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950 text-orange-100">
        <Lightbulb className="h-4 w-4 text-orange-400" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <span className="text-orange-400 font-bold">🔮 Enhanced Salem Cyber Vault</span> now includes Google and Yandex dorking capabilities! 
            Explore the digital realm with powerful search incantations from multiple search engines.
          </span>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black border border-orange-900/50 mx-auto mb-4">
          <TabsTrigger value="google" className="data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-400">
            <Search className="h-4 w-4 mr-2" />Google Dorks
          </TabsTrigger>
          <TabsTrigger value="yandex" className="data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-400">
            <Globe className="h-4 w-4 mr-2" />Yandex Dorks
          </TabsTrigger>
          <TabsTrigger value="halloween" className="data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-400">
            <Skull className="h-4 w-4 mr-2" />Halloween Special
          </TabsTrigger>
          <TabsTrigger value="safety" className="data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-400">
            <Shield className="h-4 w-4 mr-2" />Safety Guide
          </TabsTrigger>
        </TabsList>

        {/* Custom Search Bar */}
        <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Search className="h-5 w-5" />
              Custom Dork Conjuring
            </CardTitle>
            <CardDescription className="text-orange-300/70">
              Enter your own search dork or select from our curated collection below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500/70" />
                <Input
                  placeholder={`Enter your ${activeTab} dork query...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-orange-900/50 text-orange-100 placeholder:text-orange-300/50 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
                  onKeyPress={(e) => e.key === "Enter" && handleCustomSearch()}
                />
              </div>
              <Button 
                onClick={handleCustomSearch} 
                className="bg-orange-600 hover:bg-orange-700 animate-pulse shadow-[0_0_10px_rgba(255,102,0,0.5)]"
              >
                <Search className="h-4 w-4 mr-2" />Cast Spell
              </Button>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(searchQuery)}
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-950"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedText === searchQuery ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>

            {/* Search Engine Selector */}
            <div className="flex gap-4 items-center">
              <Label className="text-orange-300">Search Engine:</Label>
              <Select value={selectedEngine.name} onValueChange={(name) => 
                setSelectedEngine(searchEngines.find(e => e.name === name) || searchEngines[0])
              }>
                <SelectTrigger className="w-32 bg-black/50 border-orange-900/50 text-orange-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-orange-900">
                  {searchEngines.map((engine) => (
                    <SelectItem key={engine.name} value={engine.name}>
                      {engine.icon} {engine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Label className="text-orange-300">Category:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-black/50 border-orange-900/50 text-orange-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-orange-900">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-orange-300">Risk Level:</Label>
            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger className="w-32 bg-black/50 border-orange-900/50 text-orange-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-orange-900">
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="google" className="space-y-4">
          <DorkLibraryDisplay 
            dorks={filteredDorks} 
            onDorkClick={handleDorkClick}
            title="🔍 Google Dorks Library"
            description="Powerful Google search operators for cybersecurity reconnaissance"
            copiedText={copiedText}
            onCopy={copyToClipboard}
          />
        </TabsContent>

        <TabsContent value="yandex" className="space-y-4">
          <DorkLibraryDisplay 
            dorks={filteredDorks} 
            onDorkClick={handleDorkClick}
            title="🌐 Yandex Dorks Library"
            description="Specialized Yandex search operators for Eastern European and Russian domains"
            copiedText={copiedText}
            onCopy={copyToClipboard}
          />
        </TabsContent>

        <TabsContent value="halloween" className="space-y-4">
          <DorkLibraryDisplay 
            dorks={filteredDorks} 
            onDorkClick={handleDorkClick}
            title="🎃 Halloween Special Dorks"
            description="Spooky-themed dorks for the Halloween season!"
            copiedText={copiedText}
            onCopy={copyToClipboard}
          />
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <SafetyGuideContent />
        </TabsContent>
      </Tabs>

      {/* Search Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl bg-black border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-orange-400 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Search Results Preview
            </DialogTitle>
            <DialogDescription className="text-orange-300/70">
              Educational demonstration of potential search results. Always verify and act responsibly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {currentResults.map((result, index) => (
              <SearchResultCard 
                key={index} 
                result={result} 
                onOpenLink={openInNewTab}
                onCopyUrl={() => copyToClipboard(result.url)}
                copiedText={copiedText}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DorkLibraryDisplayProps {
  dorks: DorkQuery[]
  onDorkClick: (dork: DorkQuery) => void
  title: string
  description: string
  copiedText: string
  onCopy: (text: string) => void
}

function DorkLibraryDisplay({ dorks, onDorkClick, title, description, copiedText, onCopy }: DorkLibraryDisplayProps) {
  return (
    <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
      <CardHeader>
        <CardTitle className="text-lg text-orange-400">{title}</CardTitle>
        <CardDescription className="text-orange-300/70">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dorks.map((dork, index) => (
            <div
              key={index}
              className="p-4 border border-orange-900/30 rounded-lg hover:bg-orange-950/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-orange-200">{dork.name}</h3>
                  <Badge variant="outline" className={`${getRiskColor(dork.risk)} bg-black/30`}>
                    {dork.risk} Risk
                  </Badge>
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-black/30">
                    {dork.category}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopy(dork.query)}
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-950 h-8 px-2"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedText === dork.query ? "✓" : ""}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDorkClick(dork)}
                    className="bg-orange-600 hover:bg-orange-700 h-8 px-2"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Search
                  </Button>
                </div>
              </div>
              
              <code className="text-xs bg-black/50 px-2 py-1 rounded text-orange-300 block mb-2">
                {dork.query}
              </code>
              
              <p className="text-sm text-orange-200/80 mb-2">{dork.description}</p>
              
              <div className="text-xs text-orange-500">
                <p className="mb-1">🔮 {dork.explanation}</p>
                <div className="ml-4">
                  {dork.tips.map((tip, tipIndex) => (
                    <p key={tipIndex} className="text-orange-400/70">• {tip}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SearchResultCardProps {
  result: SearchResult
  onOpenLink: (url: string) => void
  onCopyUrl: () => void
  copiedText: string
}

function SearchResultCard({ result, onOpenLink, onCopyUrl, copiedText }: SearchResultCardProps) {
  return (
    <div className="p-4 border border-orange-900/30 rounded-lg bg-black/30">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-orange-400 font-medium text-sm hover:underline cursor-pointer"
              onClick={() => onOpenLink(result.url)}>
            {result.title}
          </h3>
          <p className="text-green-400 text-xs">{result.displayUrl}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onCopyUrl}
            className="border-orange-500/50 text-orange-400 hover:bg-orange-950 h-8 px-2"
          >
            <Copy className="h-3 w-3" />
            {copiedText === result.url ? "✓" : ""}
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenLink(result.url)}
            className="bg-orange-600 hover:bg-orange-700 h-8 px-2"
          >
            <Link className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <p className="text-orange-200/70 text-sm">{result.snippet}</p>
      <div className="mt-2 flex items-center gap-2">
        <AlertTriangle className="h-3 w-3 text-red-400" />
        <span className="text-xs text-red-400">Educational purposes only - Do not access unauthorized systems</span>
      </div>
    </div>
  )
}

function SafetyGuideContent() {
  return (
    <div className="space-y-6">
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            🧙‍♀️ The Digital Witch's Code of Ethics
          </CardTitle>
          <CardDescription className="text-orange-300/70">
            Sacred rules for responsible dorking and cyber reconnaissance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-500/50 bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>WARNING:</strong> Dorking reveals publicly indexed information but accessing found systems without authorization is illegal and unethical.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-black/50 border-green-500/30">
              <CardHeader className="py-4">
                <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                  ✅ Ethical Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-green-200/80">
                <p>• Use dorks for educational and research purposes only</p>
                <p>• Report vulnerabilities through responsible disclosure</p>
                <p>• Respect privacy and never access personal information</p>
                <p>• Help organizations improve their security posture</p>
                <p>• Share knowledge to improve overall cybersecurity</p>
                <p>• Follow all applicable laws and regulations</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-red-500/30">
              <CardHeader className="py-4">
                <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                  ❌ Forbidden Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-red-200/80">
                <p>• Never attempt to access found systems</p>
                <p>• Don't download or view sensitive files</p>
                <p>• Avoid accessing personal cameras or documents</p>
                <p>• Never use findings for malicious purposes</p>
                <p>• Don't share sensitive information publicly</p>
                <p>• Avoid causing harm or disruption to services</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/50 border-orange-500/30">
            <CardHeader className="py-4">
              <CardTitle className="text-lg text-orange-400">🎓 Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-orange-200/80">
              <p>Dorking helps cybersecurity professionals understand:</p>
              <ul className="space-y-1 ml-4">
                <li>• How search engines index web content</li>
                <li>• Common misconfigurations that expose sensitive data</li>
                <li>• The importance of proper access controls</li>
                <li>• How attackers discover targets and vulnerabilities</li>
                <li>• Best practices for securing web applications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-blue-500/30">
            <CardHeader className="py-4">
              <CardTitle className="text-lg text-blue-400">🛡️ Protecting Your Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-200/80">
              <p>Use these techniques to audit your own organization:</p>
              <ul className="space-y-1 ml-4">
                <li>• Search for your domain with sensitive file types</li>
                <li>• Look for exposed admin panels and login pages</li>
                <li>• Check for leaked configuration files and credentials</li>
                <li>• Monitor for exposed database dumps and backups</li>
                <li>• Verify that sensitive areas require authentication</li>
                <li>• Implement proper robots.txt and access controls</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}