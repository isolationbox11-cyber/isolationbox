"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, Wifi, Server, HardDrive } from "lucide-react"
import { useState, useEffect } from "react"
import { cyberAPI } from "@/lib/cyber-api"

export function AssetMonitoring() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await cyberAPI.getAssetStatus()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asset data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])
  
  const assets = data?.assets || []
  const totalAssets = data?.totalAssets || 0
  const vulnerableAssets = data?.vulnerableAssets || 0
  const criticalAssets = data?.criticalAssets || 0
  const secureAssets = totalAssets - vulnerableAssets

  const getStatusColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-600"
      case "medium": return "bg-yellow-600"
      case "high": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-400"
      case "medium": return "text-yellow-400"
      case "low": return "text-green-400"
      default: return "text-gray-400"
    }
  }

  const getAssetIcon = (service: string) => {
    if (service.toLowerCase().includes('ssh') || service.toLowerCase().includes('server')) {
      return <Server className="h-5 w-5" />
    }
    if (service.toLowerCase().includes('http') || service.toLowerCase().includes('web')) {
      return <Wifi className="h-5 w-5" />
    }
    return <HardDrive className="h-5 w-5" />
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <span className="text-2xl">🏰</span>
              Asset Monitoring
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              {data?.lastScan 
                ? `Real-time asset security status • Last scan: ${new Date(data.lastScan).toLocaleTimeString()}`
                : "Security status of all network assets"
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
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-green-950/30 rounded-lg border border-green-800/20">
              <div className="text-2xl font-bold text-green-400">{secureAssets}</div>
              <div className="text-xs text-green-300">Secure Assets</div>
            </div>
            <div className="text-center p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/20">
              <div className="text-2xl font-bold text-yellow-400">{vulnerableAssets}</div>
              <div className="text-xs text-yellow-300">Need Attention</div>
            </div>
            <div className="text-center p-3 bg-red-950/30 rounded-lg border border-red-800/20">
              <div className="text-2xl font-bold text-red-400">{criticalAssets}</div>
              <div className="text-xs text-red-300">Critical Issues</div>
            </div>
          </div>

          {assets.length === 0 && !loading ? (
            <div className="text-center p-6 text-orange-200/60">
              <span className="text-2xl">🔍</span>
              <p className="mt-2">No assets discovered yet</p>
              <p className="text-xs mt-1">Run a network scan to identify assets</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-orange-300">Discovered Network Assets</h4>
              {assets.map((asset: any, index: number) => (
                <div key={index} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20 hover:bg-orange-950/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-orange-400">
                        {getAssetIcon(asset.service)}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-orange-300">
                          {asset.service} - Port {asset.port}
                        </h5>
                        <p className="text-xs text-orange-200/60">
                          {asset.ip} • {asset.location}
                        </p>
                        <p className="text-xs text-orange-200/50">
                          Last seen: {new Date(asset.lastSeen).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getRiskColor(asset.risk)}`}>
                          Risk: {asset.risk.toUpperCase()}
                        </div>
                      </div>
                      <Badge className={getStatusColor(asset.risk)}>
                        {asset.risk.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  {asset.risk === 'high' && (
                    <div className="mt-2 p-2 bg-red-950/20 rounded border border-red-800/20">
                      <p className="text-xs text-red-300">
                        ⚠️ High-risk service detected - immediate security review recommended
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? 'Scanning...' : 'Scan Network'}
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              Export Asset Report
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              Configure Monitoring
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}