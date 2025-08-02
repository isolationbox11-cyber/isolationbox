"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading"
import { useDashboard } from "@/contexts/dashboard-context"
import { RefreshCw, MapPin } from "lucide-react"

export function RealTimeMap() {
  const { state, actions } = useDashboard()
  const { threatMap, loading, errors } = state

  const getSeverityColor = (attacks: number) => {
    if (attacks >= 50) return "bg-red-600"
    if (attacks >= 20) return "bg-orange-600"
    if (attacks >= 10) return "bg-yellow-600"
    return "bg-green-600"
  }

  const getSeverityLevel = (attacks: number) => {
    if (attacks >= 50) return "critical"
    if (attacks >= 20) return "high"
    if (attacks >= 10) return "medium"
    return "low"
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'United States': '🇺🇸',
      'China': '🇨🇳',
      'Russia': '🇷🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Brazil': '🇧🇷',
      'India': '🇮🇳',
      'Japan': '🇯🇵',
      'Canada': '🇨🇦',
      'Ukraine': '🇺🇦',
      'Netherlands': '🇳🇱',
      'United Kingdom': '🇬🇧',
      'South Korea': '🇰🇷',
      'Iran': '🇮🇷',
      'Turkey': '🇹🇷'
    }
    return flags[country] || '🏴'
  }

  const totalAttacks = threatMap.reduce((sum, item) => sum + item.attacks, 0)
  const activeCountries = threatMap.length

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            Real-Time Threat Map
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.refreshThreatMap}
            disabled={loading.threatMap}
            className="text-orange-300 hover:text-orange-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading.threatMap ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Live cyber threats detected via Shodan intelligence
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading.threatMap && threatMap.length === 0 ? (
          <LoadingSpinner text="Loading threat map data..." className="py-8" />
        ) : errors.threatMap ? (
          <ErrorDisplay 
            error={errors.threatMap} 
            retry={actions.refreshThreatMap}
            className="my-4"
          />
        ) : threatMap.length > 0 ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-orange-950/30 rounded border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-400">{totalAttacks}</div>
                <div className="text-xs text-orange-300/70">Total Threats</div>
              </div>
              <div className="text-center p-3 bg-orange-950/30 rounded border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-400">{activeCountries}</div>
                <div className="text-xs text-orange-300/70">Active Countries</div>
              </div>
            </div>

            {/* Interactive World Map Placeholder */}
            <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-orange-800/20 mb-4">
              <div className="text-center">
                <div className="text-6xl animate-pulse mb-2">🗺️</div>
                <p className="text-orange-300 mb-1">Interactive Threat Visualization</p>
                <p className="text-xs text-orange-200/60">
                  Real-time threat data from {activeCountries} countries
                </p>
                {threatMap.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {threatMap.slice(0, 8).map((country, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-center p-2 rounded bg-orange-950/20 border border-orange-800/20"
                      >
                        <span className="text-lg mr-1">{getCountryFlag(country.country)}</span>
                        <span className="text-xs text-orange-300">
                          {country.attacks}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Top Attack Sources */}
            <div className="space-y-2">
              <h4 className="font-medium text-orange-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Top Threat Sources (Last 24h)
              </h4>
              {threatMap.slice(0, 8).map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-orange-950/30">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCountryFlag(source.country)}</span>
                    <div>
                      <h5 className="text-sm font-medium text-orange-300">{source.country}</h5>
                      <p className="text-xs text-orange-200/60">
                        {source.attacks} threats detected
                        {source.latitude && source.longitude && (
                          <span className="ml-2">
                            📍 {source.latitude.toFixed(2)}, {source.longitude.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(source.attacks)}>
                    {getSeverityLevel(source.attacks).toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>

            {threatMap.length > 8 && (
              <div className="text-center">
                <Button variant="outline" className="border-orange-500/50 text-orange-400">
                  View All {threatMap.length} Countries
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🌍</div>
            <p className="text-orange-300/70">No threat data available</p>
            <p className="text-xs text-orange-200/50 mt-1">Click refresh to scan for threats</p>
            <Button 
              className="mt-4 bg-orange-600 hover:bg-orange-700"
              onClick={actions.refreshThreatMap}
            >
              Scan Global Threats
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}