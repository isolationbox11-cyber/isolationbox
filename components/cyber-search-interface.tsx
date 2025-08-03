"use client"

import { useState } from "react"
import { Search, Filter, Globe, Database, Server, Monitor, ExternalLink, Lightbulb, Eye, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const surveillanceSearchSuggestions = [
  {
    query: "camera",
    description: "Find security cameras and webcams",
    icon: Monitor,
    count: "2.1M",
    externalLink: "https://www.shodan.io/search?query=camera",
    explanation:
      "Security cameras that are connected to the internet. Many are not properly secured!",
  },
  {
    query: "webcam",
    description: "Discover webcams with exposed interfaces",
    icon: Monitor,
    count: "1.8M",
    externalLink: "https://www.shodan.io/search?query=webcam",
    explanation:
      "Webcams that can be accessed through web browsers. Be careful, these might show private spaces!",
  },
  {
    query: "port:25 country:US",
    description: "Email servers in the United States",
    icon: Server,
    count: "890K",
    externalLink: "https://www.shodan.io/search?query=port%3A25+country%3AUS",
    explanation:
      "Email servers located in the United States. Port 25 is used for sending emails between servers.",
  },
  {
    query: "apache country:RU",
    description: "Apache web servers in Russia",
    icon: Database,
    count: "450K",
    externalLink: "https://www.shodan.io/search?query=apache+country%3ARU",
    explanation:
      "Websites using the Apache server software in Russia. Apache is very common web server software.",
  },
  {
    query: "mysql",
    description: "MySQL database servers",
    icon: Database,
    count: "3.2M",
    externalLink: "https://www.shodan.io/search?query=mysql",
    explanation:
      "MySQL databases that might be accessible from the internet. Databases often contain sensitive information!",
  },
  {
    query: "printer",
    description: "Network printers and print servers",
    icon: Server,
    count: "1.5M",
    externalLink: "https://www.shodan.io/search?query=printer",
    explanation:
      "Printers connected to the internet. Some might allow anyone to print or access print history!",
  },
]

const securitySearchDorks = [
  {
    name: "IoT Surveillance",
    query: "Server: IoT port:80",
    risk: "Medium",
    externalLink: "https://www.shodan.io/search?query=Server%3A+IoT+port%3A80",
    explanation:
      "IoT (Internet of Things) devices with web interfaces. These are often security cameras, routers, or smart home devices with weak security.",
  },
  {
    name: "Exposed Webcams",
    query: "webcamxp",
    risk: "High",
    externalLink: "https://www.shodan.io/search?query=webcamxp",
    explanation:
      "WebcamXP is software for managing webcams. Many instances are publicly accessible without passwords!",
  },
  {
    name: "Vulnerable Databases",
    query: "MongoDB port:27017",
    risk: "Critical",
    externalLink: "https://www.shodan.io/search?query=MongoDB+port%3A27017",
    explanation:
      "MongoDB databases that are directly accessible from the internet. These often contain sensitive data and might not require authentication.",
  },
  {
    name: "Unsecured Routers",
    query: "router unconfigured",
    risk: "Medium",
    externalLink: "https://www.shodan.io/search?query=router+unconfigured",
    explanation:
      "Routers that might still use default settings or passwords. These could be vulnerable to attacks!",
  },
  {
    name: "Exposed Services",
    query: "port:9200 elastic",
    risk: "High",
    externalLink: "https://www.shodan.io/search?query=port%3A9200+elastic",
    explanation:
      "Elasticsearch databases that might be accessible without authentication. These often contain sensitive logs and data.",
  },
  {
    name: "Network Monitors",
    query: "bitcoin port:8333",
    risk: "Low",
    externalLink: "https://www.shodan.io/search?query=bitcoin+port%3A8333",
    explanation:
      "Bitcoin nodes running on the internet. These are part of the Bitcoin network but generally not dangerous.",
  },
]

const countries = [
  "United States",
  "China",
  "Russia",
  "Germany",
  "France",
  "Brazil",
  "India",
  "Japan",
  "Canada",
  "Ukraine",
]

const deviceTypes = [
  "Webcam",
  "Router",
  "Server",
  "Database",
  "IoT Device",
  "Printer",
  "Industrial Control System",
  "Smart Home Device",
  "Network Storage",
  "VPN",
]

export function CyberSearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedDeviceType, setSelectedDeviceType] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState("search")

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
    // In a real app, this would trigger an API call
  }

  const handleSuggestionClick = (query: string, externalLink?: string) => {
    setSearchQuery(query)
    if (externalLink) {
      window.open(externalLink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950 text-blue-100">
        <Lightbulb className="h-4 w-4 text-blue-400" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <span className="text-blue-400 font-bold">👁️ Security Eye Vault</span> allows you to search the depths of the internet safely. 
            Navigate through our surveillance network to discover devices and services monitored within the digital realm.
          </span>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900 border border-blue-900/50 mx-auto mb-4">
          <TabsTrigger value="search" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400">
            <Search className="h-4 w-4 mr-2" />Search Protocol
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400">
            <Eye className="h-4 w-4 mr-2" />Security Searches
          </TabsTrigger>
          <TabsTrigger value="learn" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400">
            <Shield className="h-4 w-4 mr-2" />Surveillance Guide
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4">
          {/* Main Search Interface */}
          <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Search className="h-5 w-5" />Digital Surveillance Seeker
              </CardTitle>
              <CardDescription className="text-blue-300/70">
                Search for devices, servers, and digital entities within surveillance networks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500/70" />
                  <Input
                    placeholder="Enter your search query (e.g., 'webcam', 'apache', 'port:22')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-blue-900/50 text-blue-100 placeholder:text-blue-300/50 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-blue-600 hover:bg-blue-700 animate-pulse shadow-[0_0_10px_rgba(0,102,255,0.5)]"
                >
                  <Search className="h-4 w-4 mr-2" />Scan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-950"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showAdvanced && (
                <div className="grid gap-4 md:grid-cols-3 p-4 border rounded-lg border-blue-900/50 bg-slate-900/30">
                  <div className="space-y-2">
                    <Label className="text-blue-300">🌍 Country</Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="bg-slate-900/50 border-blue-900/50 text-blue-100 focus-visible:ring-blue-500/30">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-blue-900">
                        {countries.map((country) => (
                          <SelectItem key={country} value={country.toLowerCase()}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-300">🖥️ Device Type</Label>
                    <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
                      <SelectTrigger className="bg-slate-900/50 border-blue-900/50 text-blue-100 focus-visible:ring-blue-500/30">
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-blue-900">
                        {deviceTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-300">🔌 Port Range</Label>
                    <Input 
                      placeholder="e.g., 80,443,8080-8090" 
                      className="bg-slate-900/50 border-blue-900/50 text-blue-100 placeholder:text-blue-300/50 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common Searches */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900/80 to-blue-950/30">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                  🔍 Common Surveillance Searches
                </CardTitle>
                <CardDescription className="text-blue-300/70">
                  Discover digital entities monitored within surveillance networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {surveillanceSearchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-blue-900/30 rounded-lg hover:bg-blue-950/30 cursor-pointer transition-colors group"
                      onClick={() => handleSuggestionClick(suggestion.query, suggestion.externalLink)}
                    >
                      <div className="flex items-center gap-3">
                        <suggestion.icon className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm text-blue-200">{suggestion.query}</p>
                          <p className="text-xs text-blue-300/70">{suggestion.description}</p>
                          <p className="text-xs text-blue-500 mt-1">👁️ {suggestion.explanation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-slate-900/30">
                          {suggestion.count}
                        </Badge>
                        <ExternalLink className="h-3 w-3 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900/80 to-blue-950/30">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                  🛡️ Latest Security Intelligence
                </CardTitle>
                <CardDescription className="text-blue-300/70">
                  Fresh intel on digital vulnerabilities and surveillance alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center p-3 border border-blue-500/20 rounded-lg bg-slate-900/30 animate-pulse">
                  <div className="mr-3 text-xl">👁️</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-400">Security Eye Special</h4>
                    <p className="text-xs text-blue-300/70">
                      New vulnerability detected in IoT doorbell cameras that could allow unauthorized surveillance access
                    </p>
                  </div>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-slate-900/30">New</Badge>
                </div>
                
                <div className="flex items-center p-3 border border-blue-900/30 rounded-lg">
                  <div className="mr-3 text-xl">🔍</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-200">Router Vulnerability Discovered</h4>
                    <p className="text-xs text-blue-300/70">
                      Popular router models affected by security flaw allowing remote access
                    </p>
                  </div>
                  <Badge variant="outline" className="border-red-500/50 text-red-400 bg-slate-900/30">Critical</Badge>
                </div>
                
                <div className="flex items-center p-3 border border-blue-900/30 rounded-lg">
                  <div className="mr-3 text-xl">🛡️</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-200">Web Server Backdoor</h4>
                    <p className="text-xs text-blue-300/70">
                      Apache servers running version 2.4.49 may have unauthorized access points
                    </p>
                  </div>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-slate-900/30">High</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950">
            <CardHeader>
              <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                <Eye className="h-5 w-5" /> Security Search Protocols
              </CardTitle>
              <CardDescription className="text-blue-300/70">
                Advanced search protocols for finding specific types of monitored devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securitySearchDorks.map((dork, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-blue-900/30 rounded-lg hover:bg-blue-950/30 cursor-pointer transition-colors group"
                    onClick={() => handleSuggestionClick(dork.query, dork.externalLink)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-blue-200">{dork.name}</p>
                        <Badge variant="outline" className={`
                          border-blue-500/50 bg-slate-900/30
                          ${dork.risk === 'Critical' ? 'text-red-400 border-red-500/50' : 
                            dork.risk === 'High' ? 'text-blue-400 border-blue-500/50' : 
                            dork.risk === 'Medium' ? 'text-yellow-400 border-yellow-500/50' : 
                            'text-green-400 border-green-500/50'}
                        `}>
                          {dork.risk} Risk
                        </Badge>
                      </div>
                      <code className="text-xs bg-slate-900/50 px-2 py-1 rounded text-blue-300">{dork.query}</code>
                      <p className="text-xs text-blue-500 mt-1">👁️ {dork.explanation}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-blue-400/50 group-hover:text-blue-400 transition-colors ml-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900/80 to-blue-950/30">
            <CardHeader>
              <CardTitle className="text-blue-400">⚠️ Warning: Digital Surveillance Safety</CardTitle>
              <CardDescription className="text-blue-300/70">
                Monitoring digital systems requires caution and ethical practice
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="p-4 border border-red-900/50 rounded-lg bg-slate-900/30">
                <h4 className="text-red-400 text-lg mt-0">The Security Eye Code</h4>
                <ul className="text-sm text-blue-200/90 space-y-2">
                  <li>Only observe publicly accessible devices - never attempt to breach or access protected systems</li>
                  <li>Respect privacy - do not access personal cameras or private information</li>
                  <li>Report vulnerabilities to system owners or appropriate security channels</li>
                  <li>Never use this knowledge for malicious purposes</li>
                  <li>Remember that even public systems may contain sensitive information</li>
                </ul>
                <div className="mt-4 text-sm text-blue-300/70">
                  Remember: With great surveillance power comes great responsibility. Use Security Eye Vault for education and legitimate security research only.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learn" className="space-y-4">
          <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950">
            <CardHeader>
              <CardTitle className="text-blue-400">🎓 The Surveillance Operator's Guide</CardTitle>
              <CardDescription className="text-blue-300/70">
                Understanding the fundamentals of cyber surveillance for beginners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-slate-900/50 border-blue-900/50">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-blue-400">🔍 What is Cyber Surveillance?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-200/80">
                        Cyber surveillance is like using advanced monitoring tools to detect devices connected to the internet. Unlike regular search engines that find websites, cyber surveillance tools find actual devices - from security cameras and routers to servers and industrial systems.
                      </p>
                      <div className="mt-4 p-3 bg-blue-950/20 rounded-lg border border-blue-900/30">
                        <p className="text-xs text-blue-300">
                          <span className="font-bold">Everyday example:</span> It's like having a security monitoring system that shows you all the visible access points in your digital neighborhood - you can see they exist, but you're just monitoring, not entering.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900/50 border-blue-900/50">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-blue-400">🎭 Common Search Terms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 mb-1">port:80</Badge>
                        <p className="text-xs text-blue-200/80">Finds web servers (most websites use port 80)</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 mb-1">country:US</Badge>
                        <p className="text-xs text-blue-200/80">Finds devices in the United States</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 mb-1">webcam</Badge>
                        <p className="text-xs text-blue-200/80">Finds cameras connected to the internet</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 mb-1">org:"Company Name"</Badge>
                        <p className="text-xs text-blue-200/80">Finds devices belonging to an organization</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-slate-900/50 border-blue-900/50">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-blue-400">🛡️ Is This Legal?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-200/80">
                        Yes! Cyber surveillance is completely legal when used properly. You're only viewing publicly available information about devices that are already exposed to the internet. Think of it like monitoring security cameras from a central control room - you can see they're there, but you're not accessing them.
                      </p>
                      <div className="mt-4 p-3 bg-red-950/20 rounded-lg border border-red-900/30">
                        <p className="text-xs text-red-300 font-bold">Important:</p>
                        <p className="text-xs text-blue-300 mt-1">
                          Never attempt to access, log into, or breach any systems you discover. Only observe what's publicly visible. Unauthorized access is illegal and unethical.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900/50 border-blue-900/50">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-blue-400">👁️ What Can You Monitor?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-blue-200/80">
                        When monitoring, you might discover:
                      </p>
                      <ul className="space-y-2 text-xs text-blue-200/80">
                        <li className="flex items-start gap-2">
                          <Server className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span>Web servers that host websites</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Monitor className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span>Security cameras with public interfaces</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Database className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span>Database systems (though accessing data requires authorization)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Globe className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span>Routers, printers, smart devices, and industrial control systems</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Security-themed educational card */}
          <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950/70">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <div className="text-2xl">👁️</div> Security Eye Special
              </CardTitle>
              <CardDescription className="text-blue-300/70">
                Advanced cyber threats to monitor during enhanced surveillance periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-blue-900/50 rounded-lg bg-slate-900/30">
                <h4 className="text-blue-400 text-lg mb-2">Common Advanced Cyber Threats</h4>
                <ul className="space-y-3 text-sm text-blue-200/90">
                  <li className="flex items-start gap-2">
                    <div className="text-xl mt-0">🎭</div>
                    <div>
                      <p className="font-medium">Social Engineering Attacks</p>
                      <p className="text-xs text-blue-300/70">Attackers sending fake security alerts with malicious links to compromise systems</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="text-xl mt-0">🔍</div>
                    <div>
                      <p className="font-medium">Advanced Persistent Threats</p>
                      <p className="text-xs text-blue-300/70">Malware disguised as legitimate security tools and system monitoring applications</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="text-xl mt-0">👁️</div>
                    <div>
                      <p className="font-medium">Dormant Accounts</p>
                      <p className="text-xs text-blue-300/70">Abandoned accounts with admin access that hackers can exploit for surveillance</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="text-xl mt-0">🛡️</div>
                    <div>
                      <p className="font-medium">Data Exfiltration</p>
                      <p className="text-xs text-blue-300/70">Slow data extraction attacks that gradually drain information over extended periods</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <Button
                variant="outline"
                className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-950/30"
              >
                <Shield className="h-4 w-4 mr-2" />
                View Complete Security Surveillance Guide
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}