"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { cyberAPI } from "@/lib/cyber-api"

export function RealTimeMap() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Get malicious IPs and their locations
      const ipData = await cyberAPI.getKnownMaliciousIPs(20)
      
      // Get location data for each IP
      const locationPromises = ipData.threats?.map(async (threat: any) => {
        const ip = threat.name.match(/\d+\.\d+\.\d+\.\d+/)?.[0]
        if (ip) {
          const location = await cyberAPI.getIPLocation(ip)
          return {
            ...threat,
            ip,
            location: {
              lat: location.latitude || 42.5195,
              lng: location.longitude || -70.8967,
              city: location.city || 'Unknown',
              country: location.country || 'Unknown'
            }
          }
        }
        return threat
      }) || []

      const locatedThreats = await Promise.all(locationPromises)
      
      setData({
        threats: locatedThreats,
        totalThreats: locatedThreats.length,
        lastUpdated: new Date().toISOString()
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch map data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 45000) // Refresh every 45 seconds
    return () => clearInterval(interval)
  }, [])

  // Aggregate threat data by country for display
  const countryStats = data?.threats?.reduce((acc: any, threat: any) => {
    const country = threat.location?.country || 'Unknown'
    if (!acc[country]) {
      acc[country] = { count: 0, severity: threat.severity }
    }
    acc[country].count += 1
    // Keep highest severity
    if (threat.severity === 'critical' || (threat.severity === 'high' && acc[country].severity !== 'critical')) {
      acc[country].severity = threat.severity
    }
    return acc
  }, {}) || {}

  const attackData = Object.entries(countryStats).map(([country, stats]: [string, any]) => ({
    country,
    attacks: stats.count,
    severity: stats.severity
  })).sort((a, b) => b.attacks - a.attacks).slice(0, 5)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <span className="text-2xl">🌍</span>
              Real-Time Attack Map
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              {data?.lastUpdated 
                ? `Live cyber threats detected worldwide • Updated ${new Date(data.lastUpdated).toLocaleTimeString()}`
                : "Live cyber threats detected worldwide"
              }
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchData}
            disabled={loading}
            className="text-orange-400 hover:text-orange-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/30 rounded-lg border border-red-800/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-orange-800/20">
            <div className="text-center mb-4">
              <div className="text-6xl animate-pulse">🗺️</div>
              <p className="text-orange-300 mt-2">Interactive World Map</p>
              <p className="text-xs text-orange-200/60">
                {data?.totalThreats 
                  ? `Tracking ${data.totalThreats} active threat sources`
                  : "Real-time attack visualization loading..."
                }
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-orange-300">Top Attack Sources (Live Data)</h4>
            {attackData.length === 0 && !loading ? (
              <div className="text-center p-4 text-orange-200/60">
                <span className="text-2xl">🛡️</span>
                <p className="mt-2">No active threats detected</p>
                <p className="text-xs mt-1">Your network appears secure</p>
              </div>
            ) : (
              attackData.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-orange-950/30 hover:bg-orange-950/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🚩</span>
                    <div>
                      <h5 className="text-sm font-medium text-orange-300">{source.country}</h5>
                      <p className="text-xs text-orange-200/60">{source.attacks} threats detected</p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(source.severity)}>
                    {source.severity.toUpperCase()}
                  </Badge>
                </div>
              ))
            )}
          </div>
          
          {data?.threats && data.threats.length > 0 && (
            <div className="mt-4 p-3 bg-orange-950/20 rounded-lg border border-orange-800/20">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-400">🔍</span>
                <span className="text-orange-300">Live Intelligence:</span>
              </div>
              <p className="text-xs text-orange-200/60 mt-1">
                Data sourced from real-time threat feeds including AbuseIPDB and malware analysis platforms.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}