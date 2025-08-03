"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Info, Filter, Play, Pause } from "lucide-react"
import { fetchThreatData, getThreatTypeColor, getThreatExplanation, type ThreatData, type ApiResponse } from "@/lib/threat-data-service"

// Dynamically import map component to avoid SSR issues
const ThreatMapComponent = dynamic(() => import('./threat-map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-r from-black to-gray-900 rounded-lg border-2 border-orange-800/20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl animate-pulse mb-4">🗺️</div>
        <p className="text-orange-300">Loading Interactive Threat Map...</p>
      </div>
    </div>
  )
})

export function RealTimeMap() {
  const [threatData, setThreatData] = useState<ThreatData[]>([])
  const [filteredThreats, setFilteredThreats] = useState<ThreatData[]>([])
  const [selectedThreatType, setSelectedThreatType] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch threat data
  const loadThreatData = async () => {
    try {
      setLoading(true)
      const response: ApiResponse = await fetchThreatData()
      setThreatData(response.threats)
      setLastUpdated(response.lastUpdated)
    } catch (error) {
      console.error('Failed to load threat data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh functionality
  useEffect(() => {
    loadThreatData()
    
    if (autoRefresh) {
      intervalRef.current = setInterval(loadThreatData, 30000) // Refresh every 30 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh])

  // Filter threats based on selected criteria
  useEffect(() => {
    let filtered = threatData

    if (selectedThreatType !== "all") {
      filtered = filtered.filter(threat => threat.threatType === selectedThreatType)
    }

    if (selectedSeverity !== "all") {
      filtered = filtered.filter(threat => threat.severity === selectedSeverity)
    }

    setFilteredThreats(filtered)
  }, [threatData, selectedThreatType, selectedSeverity])

  // Get unique threat types for filter
  const threatTypes = Array.from(new Set(threatData.map(threat => threat.threatType)))
  const severityLevels = ['critical', 'high', 'medium', 'low']

  // Get threat statistics
  const threatStats = threatData.reduce((acc, threat) => {
    acc[threat.severity] = (acc[threat.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600"
      case "high": return "bg-orange-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-300">
            <span className="text-2xl">🌍</span>
            Live Cyber Threat Map
          </CardTitle>
          <CardDescription className="text-orange-200/70">
            Real-time cyber threats detected worldwide with interactive visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-orange-950/20 rounded-lg border border-orange-800/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-orange-400" />
              <Label className="text-orange-300">Threat Type:</Label>
              <Select value={selectedThreatType} onValueChange={setSelectedThreatType}>
                <SelectTrigger className="w-48 bg-black/50 border-orange-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-orange-700">
                  <SelectItem value="all">All Types</SelectItem>
                  {threatTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-orange-300">Severity:</Label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32 bg-black/50 border-orange-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-orange-700">
                  <SelectItem value="all">All</SelectItem>
                  {severityLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {autoRefresh ? <Play className="h-4 w-4 text-green-400" /> : <Pause className="h-4 w-4 text-gray-400" />}
              <Label className="text-orange-300">Auto-refresh:</Label>
              <Switch 
                checked={autoRefresh} 
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-orange-600"
              />
            </div>

            <Button 
              onClick={loadThreatData} 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Threat Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {severityLevels.map(level => (
              <div key={level} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(level)}`}></div>
                  <span className="text-sm font-medium text-orange-300 capitalize">{level}</span>
                </div>
                <p className="text-2xl font-bold text-orange-100">{threatStats[level] || 0}</p>
              </div>
            ))}
          </div>

          {/* Interactive Map */}
          <div className="mb-6">
            <ThreatMapComponent 
              threats={filteredThreats} 
              onThreatSelect={setSelectedThreat}
            />
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-orange-200/60 text-center">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threat Detail Panel */}
      {selectedThreat && (
        <Card className="border-orange-800/30 bg-black/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <span className="text-xl">{selectedThreat.emoji}</span>
              Threat Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-orange-300 font-medium mb-2">Threat Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-200/70">Type:</span>
                      <span className="text-orange-100">{selectedThreat.threatType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200/70">Severity:</span>
                      <Badge className={getSeverityColor(selectedThreat.severity)}>
                        {selectedThreat.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200/70">Location:</span>
                      <span className="text-orange-100">{selectedThreat.city}, {selectedThreat.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200/70">Time:</span>
                      <span className="text-orange-100">{selectedThreat.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {selectedThreat.ip && (
                      <div className="flex justify-between">
                        <span className="text-orange-200/70">IP Address:</span>
                        <span className="text-orange-100 font-mono">{selectedThreat.ip}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-orange-300 font-medium mb-2">Description</h4>
                  <p className="text-sm text-orange-100/70 mb-3">{selectedThreat.description}</p>
                  
                  <div className="bg-orange-950/30 p-3 rounded-lg border border-orange-800/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-medium text-orange-300">Plain English Explanation</span>
                    </div>
                    <p className="text-xs text-orange-100/70">
                      {getThreatExplanation(selectedThreat.threatType)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-orange-300">🎭 Threat Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-orange-300 font-medium mb-3">Severity Levels</h4>
              <div className="space-y-2">
                {[
                  { level: 'critical', desc: 'Immediate action required - active attacks' },
                  { level: 'high', desc: 'Serious threats requiring prompt attention' },
                  { level: 'medium', desc: 'Moderate risk - monitor closely' },
                  { level: 'low', desc: 'Low impact - routine monitoring' }
                ].map(item => (
                  <div key={item.level} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getSeverityColor(item.level)}`}></div>
                    <div>
                      <span className="text-orange-300 capitalize font-medium">{item.level}</span>
                      <span className="text-orange-200/70 text-sm ml-2">- {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-orange-300 font-medium mb-3">How to Use</h4>
              <ul className="space-y-1 text-sm text-orange-200/70">
                <li>• Click on map markers to see threat details</li>
                <li>• Use filters to focus on specific threat types</li>
                <li>• Auto-refresh keeps data current every 30 seconds</li>
                <li>• Hover over markers for quick threat previews</li>
                <li>• Zoom and pan to explore different regions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}