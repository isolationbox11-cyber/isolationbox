"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useThreatMap } from "@/lib/hooks"
import { ThreatMapSkeleton } from "@/components/loading-skeletons"
import { ThreatMapHelp, InfoTooltip } from "@/components/educational-tooltips"
import { AlertCircle, RefreshCw, Globe, Activity } from "lucide-react"

export function RealTimeMap() {
  const { data: threatMapData, loading, error, refresh } = useThreatMap()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  if (loading) {
    return <ThreatMapSkeleton />
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🌍</span>
          <InfoTooltip 
            title="Real-Time Attack Map" 
            description="Global cyber threat visualization using IP geolocation data to show attack sources and patterns worldwide"
          >
            Real-Time Attack Map
          </InfoTooltip>
          <div className="ml-auto flex items-center gap-2">
            <ThreatMapHelp />
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
            "Live cyber threats detected worldwide"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Interactive Map Placeholder */}
          <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-orange-800/20 relative overflow-hidden">
            <div className="text-center mb-4">
              <div className="text-6xl animate-pulse">🗺️</div>
              <p className="text-orange-300 mt-2">Interactive World Map</p>
              <p className="text-xs text-orange-200/60">Real-time attack visualization</p>
            </div>
            
            {/* Live Stats Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-3 border border-orange-800/30">
              <div className="flex items-center gap-2 text-orange-300">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Live Stats</span>
              </div>
              <div className="text-xs text-orange-200/70 mt-1">
                <div>Total Attacks: {threatMapData?.totalAttacks.toLocaleString() || '0'}</div>
                <div>Active Threats: {threatMapData?.activeThreats || 0}</div>
                <div>Countries: {threatMapData?.topCountries.length || 0}</div>
              </div>
            </div>

            {/* Animated Attack Indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {threatMapData?.attackSources.slice(0, 3).map((source, index) => (
                <div
                  key={index}
                  className="absolute animate-ping"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`,
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    source.severity === 'high' ? 'bg-red-500' :
                    source.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Attack Sources List */}
          <div className="space-y-2">
            <h4 className="font-medium text-orange-300">Top Attack Sources (Last 24h)</h4>
            {threatMapData?.attackSources && threatMapData.attackSources.length > 0 ? (
              threatMapData.attackSources.slice(0, 5).map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-orange-950/30 border border-orange-800/20">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🚩</span>
                    <div>
                      <h5 className="text-sm font-medium text-orange-300 flex items-center gap-2">
                        {source.country}
                        <Badge variant="outline" className="text-xs">
                          {source.countryCode}
                        </Badge>
                      </h5>
                      <div className="text-xs text-orange-200/60">
                        <div>{source.attacks.toLocaleString()} attacks detected</div>
                        {source.attackTypes.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span>Types:</span>
                            <span className="text-orange-300">{source.attackTypes.slice(0, 2).join(', ')}</span>
                            {source.attackTypes.length > 2 && (
                              <span>+{source.attackTypes.length - 2} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getSeverityColor(source.severity)}>
                      {source.severity.toUpperCase()}
                    </Badge>
                    {source.topPorts.length > 0 && (
                      <div className="text-xs text-orange-200/60 mt-1">
                        Ports: {source.topPorts.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-orange-300/60">
                <span className="text-4xl block mb-2">🌍</span>
                <p>No active threats detected!</p>
                <p className="text-xs text-orange-200/50 mt-1">The digital realm is peaceful tonight...</p>
              </div>
            )}
          </div>

          {/* Global Stats Summary */}
          {threatMapData && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-800/20">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Global Coverage</span>
                </div>
                <div className="text-xs text-blue-200/70 mt-1">
                  Monitoring {threatMapData.topCountries.length} countries
                </div>
              </div>
              <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-800/20">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Threat Level</span>
                </div>
                <div className="text-xs text-purple-200/70 mt-1">
                  {threatMapData.activeThreats > 2 ? 'High' : 
                   threatMapData.activeThreats > 0 ? 'Medium' : 'Low'} activity detected
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-300 font-medium">IP Geolocation API Issue</p>
                  <p className="text-yellow-200/80">
                    Unable to fetch live geolocation data. Showing demo attack patterns for educational purposes.
                    Check your IP geolocation API configuration.
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