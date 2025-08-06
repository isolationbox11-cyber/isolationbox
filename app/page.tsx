"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatsCards } from "@/components/stats-cards"
import { LiveThreatFeed } from "@/components/live-threat-feed"
import { ApiStatusChart } from "@/components/api-status-chart"
import { FloatingEyes } from "@/components/floating-eyes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Shield, Activity, Globe } from "lucide-react"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cyber Intelligence Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time threat intelligence from multiple security APIs
              </p>
            </div>
            
            <StatsCards />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <LiveThreatFeed />
              <ApiStatusChart />
            </div>
          </div>
        )
      
      case "search":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Search Intelligence</h1>
              <p className="text-muted-foreground">
                Query multiple threat intelligence APIs simultaneously
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Multi-API Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter IP address, domain, or hash..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search All APIs
                  </Button>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Shodan</Badge>
                  <Badge variant="outline">VirusTotal</Badge>
                  <Badge variant="outline">GreyNoise</Badge>
                  <Badge variant="outline">AbuseIPDB</Badge>
                  <Badge variant="outline">Alienvault OTX</Badge>
                </div>
                
                {!searchQuery && (
                  <div className="text-center text-muted-foreground py-8">
                    Enter a search term to query all connected APIs
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      
      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
              <p className="text-muted-foreground">
                Monitor API connections and data quality
              </p>
            </div>
            
            <ApiStatusChart />
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Query Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Queries Today</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful Responses</span>
                      <span className="font-bold text-green-500">98.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <span className="font-bold">245ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Threat Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Threats Detected</span>
                      <span className="font-bold text-red-500">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Alerts</span>
                      <span className="font-bold text-orange-500">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>False Positives</span>
                      <span className="font-bold">2.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
              <p className="text-muted-foreground">
                This section is under development
              </p>
            </div>
            
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Coming Soon</p>
                  <p className="text-sm text-muted-foreground">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} features will be available in the next update
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <FloatingEyes />
      
      <DashboardSidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 relative z-10">
          {renderMainContent()}
        </div>
      </main>
    </div>
  )
}