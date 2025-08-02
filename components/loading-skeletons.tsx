/**
 * Loading skeleton components for dashboard data
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ThreatIntelligenceSkeleton() {
  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🕵️</span>
          Threat Intelligence
          <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Loading latest threats...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-700/30 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-orange-700/30 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-orange-700/30 rounded animate-pulse"></div>
              </div>
              <div className="h-3 w-full bg-orange-700/30 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-orange-700/30 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function VulnerabilityAnalysisSkeleton() {
  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🛡️</span>
          Vulnerability Analysis
          <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Loading vulnerability data...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="h-8 w-8 bg-orange-700/30 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-3 w-12 bg-orange-700/30 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-700/30 rounded animate-pulse"></div>
                    <div>
                      <div className="h-4 w-40 bg-orange-700/30 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-24 bg-orange-700/30 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-orange-700/30 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-orange-700/30 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-3 w-full bg-orange-700/30 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-orange-700/30 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AssetMonitoringSkeleton() {
  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🏰</span>
          Asset Monitoring
          <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Scanning network assets...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="h-8 w-8 bg-orange-700/30 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-3 w-16 bg-orange-700/30 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-700/30 rounded animate-pulse"></div>
                    <div>
                      <div className="h-4 w-32 bg-orange-700/30 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-24 bg-orange-700/30 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="h-4 w-20 bg-orange-700/30 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-16 bg-orange-700/30 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-16 bg-orange-700/30 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ThreatMapSkeleton() {
  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🌍</span>
          Real-Time Attack Map
          <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Loading global threat data...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-orange-800/20">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-700/30 rounded-full animate-pulse mx-auto mb-2"></div>
              <div className="h-4 w-32 bg-orange-700/30 rounded animate-pulse mx-auto mb-1"></div>
              <div className="h-3 w-48 bg-orange-700/30 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 w-40 bg-orange-700/30 rounded animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-orange-950/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-700/30 rounded animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-orange-700/30 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-orange-700/30 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-orange-700/30 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentEventsSkeleton() {
  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">📊</span>
          Recent Events
          <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Loading system activity...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-950/20">
              <div className="w-12 h-3 bg-orange-700/30 rounded animate-pulse mt-1"></div>
              <div className="w-6 h-6 bg-orange-700/30 rounded animate-pulse mt-0.5"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-4 w-24 bg-orange-700/30 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-orange-700/30 rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-full bg-orange-700/30 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}