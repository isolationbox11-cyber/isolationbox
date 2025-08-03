"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Map, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { geolocationAPI, type GeolocationData, type AttackEvent } from "@/lib/geolocation-api"

export function RealTimeMap() {
  const [attackSources, setAttackSources] = useState<GeolocationData[]>([])
  const [recentAttacks, setRecentAttacks] = useState<AttackEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadAttackData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [sources, attacks] = await Promise.all([
        geolocationAPI.getAttackSources(),
        geolocationAPI.generateLiveAttackData()
      ])
      
      setAttackSources(sources.slice(0, 5)) // Top 5 sources
      setRecentAttacks(attacks.slice(0, 10)) // Recent 10 attacks
      setLastUpdate(new Date())
    } catch (err) {
      setError('Failed to load attack data')
      console.error('Error loading attack data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttackData()
    
    // Auto-refresh every 30 seconds for real-time feel
    const interval = setInterval(loadAttackData, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (threatLevel: string) => {
    switch (threatLevel) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  const formatTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🌍</span>
          Real-Time Attack Map
          <Button
            variant="ghost"
            size="sm"
            onClick={loadAttackData}
            disabled={loading}
            className="ml-auto text-orange-400 hover:text-orange-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Live cyber threats detected worldwide
          {lastUpdate && (
            <span className="block text-xs text-orange-300/60 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && attackSources.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-orange-800/20 animate-pulse">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-600/30 rounded-full mx-auto mb-2"></div>
                <div className="w-32 h-4 bg-orange-600/20 rounded mx-auto mb-2"></div>
                <div className="w-48 h-3 bg-orange-600/20 rounded mx-auto"></div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-orange-950/30 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-600/30 rounded"></div>
                  <div className="w-24 h-4 bg-orange-600/30 rounded"></div>
                </div>
                <div className="w-16 h-6 bg-orange-600/30 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 rounded-lg border border-red-800/20">
            <p className="text-red-300 mb-2">⚠️ {error}</p>
            <Button 
              onClick={loadAttackData} 
              variant="outline" 
              size="sm"
              className="border-red-600 text-red-300 hover:bg-red-950/50"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-orange-800/20 relative overflow-hidden">
              <div className="text-center mb-4">
                <div className="text-6xl animate-pulse mb-2">🗺️</div>
                <p className="text-orange-300 mb-1">Interactive World Map</p>
                <p className="text-xs text-orange-200/60">Real-time attack visualization</p>
                
                {/* Simulated live activity indicators */}
                <div className="flex justify-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-red-400 animate-pulse" />
                    <span className="text-xs text-red-400">{recentAttacks.length} active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Map className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-orange-400">{attackSources.length} sources</span>
                  </div>
                </div>
              </div>
              
              {/* Animated threat indicators */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 20}%`,
                      animationDelay: `${i * 500}ms`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-300">Top Attack Sources (Last 24h)</h4>
              {attackSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-orange-950/30 hover:bg-orange-950/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg animate-bounce" style={{ animationDelay: `${index * 100}ms` }}>
                      🚩
                    </span>
                    <div>
                      <h5 className="text-sm font-medium text-orange-300">{source.country}</h5>
                      <p className="text-xs text-orange-200/60">
                        {source.attackCount} attacks detected
                        {source.countryCode && (
                          <span className="ml-2 px-1 py-0.5 bg-orange-800/30 rounded text-xs">
                            {source.countryCode}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(source.threatLevel)}>
                    {source.threatLevel.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>

            {recentAttacks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">Recent Attack Events</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {recentAttacks.slice(0, 5).map((attack, index) => (
                    <div key={index} className="text-xs p-2 bg-red-950/20 rounded border border-red-800/20">
                      <div className="flex items-center justify-between">
                        <span className="text-red-300">{attack.attackType}</span>
                        <span className="text-red-400">{formatTime(attack.timestamp)}</span>
                      </div>
                      <div className="text-red-200/60 mt-1">
                        {attack.sourceIp} → {attack.targetIp}
                        {attack.geolocation && (
                          <span className="ml-2">from {attack.geolocation.country}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}