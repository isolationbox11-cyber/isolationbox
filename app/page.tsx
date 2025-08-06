"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { FloatingEyes } from "@/components/floating-eyes"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveThreatFeed } from "@/components/live-threat-feed"
import { SearchInterface } from "@/components/search-interface"
import { APIStatusIndicator } from "@/components/api-status-indicator"
import { AdvancedShodanDashboard } from "@/components/advanced-shodan-dashboard"
import { 
  Shield, 
  Globe, 
  Search, 
  Activity, 
  AlertTriangle, 
  Database,
  Eye,
  Zap,
  Settings,
  BarChart3,
  Users,
  Lock
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchLoading(true)
    try {
      // This will use the API integrations with fallback data
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "search", label: "Threat Search", icon: Search },
    { id: "map", label: "Threat Map", icon: Globe },
    { id: "feed", label: "Live Feed", icon: Activity },
    { id: "shodan", label: "Shodan Pro", icon: Database },
    { id: "apis", label: "API Status", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Floating Eyes Background */}
      <FloatingEyes />
      
      <SidebarProvider>
        <div className="flex min-h-screen relative z-10">
          {/* Sidebar */}
          <Sidebar className="bg-black/40 backdrop-blur-xl border-purple-500/20 border-r">
            <SidebarContent className="p-4">
              {/* Logo/Title */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="w-8 h-8 text-purple-400" />
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Cyber Watch Vault
                </h1>
                <p className="text-xs text-slate-400 mt-1">Intelligence Platform</p>
              </div>

              {/* Navigation Menu */}
              <SidebarMenu className="space-y-2">
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                          : "text-slate-300 hover:bg-purple-600/10 hover:text-purple-300"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">Security Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Threat Level</span>
                    <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/40">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Active Scans</span>
                    <span className="text-xs text-cyan-300">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">APIs Online</span>
                    <span className="text-xs text-green-300">4/5</span>
                  </div>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {sidebarItems.find(item => item.id === activeTab)?.label || "Dashboard"}
                </h2>
                <p className="text-slate-400 mt-1">
                  Real-time cybersecurity intelligence and monitoring
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-600/20 text-green-300 border-green-500/40 animate-pulse">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  LIVE
                </Badge>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500">
                  <Zap className="w-4 h-4 mr-2" />
                  Emergency Scan
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Security Score Card */}
                  <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-400 mb-2">87</div>
                        <div className="text-sm text-slate-400">Out of 100</div>
                        <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                          <div className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Threats Detected Card */}
                  <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Threats Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">23</div>
                        <div className="text-sm text-slate-400">Last 24 hours</div>
                        <div className="flex justify-center gap-2 mt-4">
                          <Badge className="bg-red-600/20 text-red-300 border-red-500/40">High: 3</Badge>
                          <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/40">Med: 20</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Monitors Card */}
                  <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Active Monitors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">156</div>
                        <div className="text-sm text-slate-400">Endpoints monitored</div>
                        <div className="flex justify-center gap-2 mt-4">
                          <Badge className="bg-green-600/20 text-green-300 border-green-500/40">Online: 152</Badge>
                          <Badge className="bg-red-600/20 text-red-300 border-red-500/40">Offline: 4</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-xl lg:col-span-2 xl:col-span-3">
                    <CardHeader>
                      <CardTitle className="text-purple-300">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { type: "threat", msg: "Suspicious login attempt from 192.168.1.100", time: "2 min ago", severity: "high" },
                          { type: "scan", msg: "Vulnerability scan completed on production servers", time: "15 min ago", severity: "info" },
                          { type: "alert", msg: "New CVE-2024-1234 affects your infrastructure", time: "1 hour ago", severity: "medium" },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.severity === "high" ? "bg-red-400" :
                              activity.severity === "medium" ? "bg-orange-400" : "bg-blue-400"
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-slate-200 text-sm">{activity.msg}</p>
                              <p className="text-slate-400 text-xs">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "search" && (
                <div className="space-y-6">
                  <SearchInterface 
                    onSearch={handleSearch} 
                    loading={searchLoading} 
                    resultCount={searchResults.length} 
                  />
                  {searchResults.length > 0 && (
                    <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-purple-300">Search Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-slate-300">
                          Found {searchResults.length} results
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "map" && <ThreatWorldMap />}
              {activeTab === "feed" && <LiveThreatFeed />}
              {activeTab === "shodan" && <AdvancedShodanDashboard />}
              {activeTab === "apis" && <APIStatusIndicator />}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}