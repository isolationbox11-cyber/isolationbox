"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAssetMonitoring } from "@/lib/hooks"
import { AssetMonitoringSkeleton } from "@/components/loading-skeletons"
import { AssetMonitoringHelp, InfoTooltip } from "@/components/educational-tooltips"
import { AlertCircle, RefreshCw, Globe, MapPin } from "lucide-react"

export function AssetMonitoring() {
  const { data, loading, error, refresh } = useAssetMonitoring()

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

  if (loading) {
    return <AssetMonitoringSkeleton />
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🏰</span>
          <InfoTooltip 
            title="Asset Monitoring" 
            description="Real-time security scanning of network assets using Shodan to discover IoT devices, servers, and potential vulnerabilities"
          >
            Asset Monitoring
          </InfoTooltip>
          <div className="ml-auto flex items-center gap-2">
            <AssetMonitoringHelp />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              className="text-orange-300 hover:text-orange-200"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          {error ? (
            <span className="flex items-center gap-1 text-yellow-400">
              <AlertCircle className="h-3 w-3" />
              Using demo data (API unavailable)
            </span>
          ) : (
            "Security status of all network assets"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-green-950/30 rounded-lg border border-green-800/20">
              <div className="text-2xl font-bold text-green-400">
                {data?.stats.secure || 0}
              </div>
              <div className="text-xs text-green-300">Secure Assets</div>
            </div>
            <div className="text-center p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/20">
              <div className="text-2xl font-bold text-yellow-400">
                {data?.stats.warning || 0}
              </div>
              <div className="text-xs text-yellow-300">Need Attention</div>
            </div>
            <div className="text-center p-3 bg-red-950/30 rounded-lg border border-red-800/20">
              <div className="text-2xl font-bold text-red-400">
                {data?.stats.critical || 0}
              </div>
              <div className="text-xs text-red-300">Critical Issues</div>
            </div>
          </div>

          {/* Assets List */}
          <div className="space-y-3">
            <h4 className="font-medium text-orange-300">Network Assets</h4>
            {data?.assets && data.assets.length > 0 ? (
              data.assets.map((asset, index) => (
                <div key={index} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{asset.emoji}</span>
                      <div>
                        <h5 className="text-sm font-medium text-orange-300">{asset.name}</h5>
                        <div className="flex items-center gap-2 text-xs text-orange-200/60">
                          <Globe className="h-3 w-3" />
                          <span>{asset.ip}</span>
                          {asset.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{asset.location}</span>
                            </>
                          )}
                          <span>• Last scan: {asset.lastScan}</span>
                        </div>
                        {asset.product && (
                          <p className="text-xs text-orange-200/50">Service: {asset.product}</p>
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
              ))
            ) : (
              <div className="text-center py-8 text-orange-300/60">
                <span className="text-4xl block mb-2">🏰</span>
                <p>No assets detected in your realm!</p>
                <p className="text-xs text-orange-200/50 mt-1">Your digital castle is well hidden...</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={refresh}>
              Scan All Assets
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              Export Asset Report
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              Schedule Scans
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-300 font-medium">Shodan API Connection Issue</p>
                  <p className="text-yellow-200/80">
                    Unable to fetch live asset data from Shodan. Showing demo data for educational purposes.
                    Check your Shodan API key configuration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}