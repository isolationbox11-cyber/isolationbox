"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, Shield, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { networkScanner } from "@/lib/geolocation-api"

interface Asset {
  name: string
  ip: string
  status: 'secure' | 'warning' | 'critical'
  lastScan: string
  vulnerabilities: number
  riskScore: number
  type: string
  emoji: string
  ports?: number[]
  services?: string[]
}

export function AssetMonitoring() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastScan, setLastScan] = useState<Date | null>(null)
  const [stats, setStats] = useState({ secure: 0, warning: 0, critical: 0 })

  const scanAssets = async () => {
    setLoading(true)
    setError(null)
    try {
      const assetData = await networkScanner.scanNetwork()
      setAssets(assetData)
      setLastScan(new Date())
      
      // Calculate stats
      const newStats = { secure: 0, warning: 0, critical: 0 }
      assetData.forEach(asset => {
        if (asset.status in newStats) {
          newStats[asset.status as keyof typeof newStats]++
        }
      })
      setStats(newStats)
    } catch (err) {
      setError('Failed to scan network assets')
      console.error('Error scanning assets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    scanAssets()
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(scanAssets, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure": return "bg-green-600"
      case "warning": return "bg-yellow-600"
      case "critical": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-400"
    if (score >= 40) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🏰</span>
          Asset Monitoring
          <Button
            variant="ghost"
            size="sm"
            onClick={scanAssets}
            disabled={loading}
            className="ml-auto text-orange-400 hover:text-orange-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Security status of all network assets
          {lastScan && (
            <span className="block text-xs text-orange-300/60 mt-1">
              Last scan: {lastScan.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && assets.length === 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse">
                  <div className="w-8 h-8 bg-orange-600/30 rounded mx-auto mb-2"></div>
                  <div className="w-16 h-3 bg-orange-600/20 rounded mx-auto"></div>
                </div>
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-600/30 rounded"></div>
                    <div className="w-48 h-4 bg-orange-600/30 rounded"></div>
                  </div>
                  <div className="w-16 h-6 bg-orange-600/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 rounded-lg border border-red-800/20">
            <p className="text-red-300 mb-2">⚠️ {error}</p>
            <Button 
              onClick={scanAssets} 
              variant="outline" 
              size="sm"
              className="border-red-600 text-red-300 hover:bg-red-950/50"
            >
              Retry Scan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-green-950/30 rounded-lg border border-green-800/20">
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                  <Shield className="h-6 w-6" />
                  {stats.secure}
                </div>
                <div className="text-xs text-green-300">Secure Assets</div>
              </div>
              <div className="text-center p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/20">
                <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-6 w-6" />
                  {stats.warning}
                </div>
                <div className="text-xs text-yellow-300">Need Attention</div>
              </div>
              <div className="text-center p-3 bg-red-950/30 rounded-lg border border-red-800/20">
                <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-6 w-6 fill-current" />
                  {stats.critical}
                </div>
                <div className="text-xs text-red-300">Critical Issues</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-orange-300">Network Assets</h4>
              {assets.map((asset, index) => (
                <div key={index} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20 hover:bg-orange-950/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                        {asset.emoji}
                      </span>
                      <div>
                        <h5 className="text-sm font-medium text-orange-300">{asset.name}</h5>
                        <p className="text-xs text-orange-200/60">{asset.ip} • Last scan: {asset.lastScan}</p>
                        {asset.ports && asset.ports.length > 0 && (
                          <p className="text-xs text-orange-300/60 flex items-center gap-1 mt-1">
                            <Wifi className="h-3 w-3" />
                            Ports: {asset.ports.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getRiskColor(asset.riskScore)}`}>
                          Risk: {asset.riskScore}/100
                        </div>
                        <div className="text-xs text-orange-200/60">
                          {asset.vulnerabilities} vulnerabilities
                        </div>
                        {asset.services && asset.services.length > 0 && (
                          <div className="text-xs text-orange-300/60">
                            {asset.services.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  {asset.vulnerabilities > 0 && (
                    <div className="mt-2 p-2 bg-red-950/20 rounded border border-red-800/20">
                      <p className="text-xs text-red-300">
                        ⚠️ {asset.vulnerabilities} vulnerabilities found - immediate attention required
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={scanAssets} className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? 'Scanning...' : 'Scan All Assets'}
              </Button>
              <Button variant="outline" className="border-orange-600 text-orange-300">
                Export Asset Report
              </Button>
              <Button variant="outline" className="border-orange-600 text-orange-300">
                Schedule Scans
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}