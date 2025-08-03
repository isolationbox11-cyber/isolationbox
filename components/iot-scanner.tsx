"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useIoTScanner } from "@/lib/hooks"
import { InfoTooltip } from "@/components/educational-tooltips"
import { AlertCircle, RefreshCw, Wifi, Shield, Globe, Database } from "lucide-react"

export function IoTScanner() {
  const { data, loading, error, refresh } = useIoTScanner()

  if (loading) {
    return (
      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-300">
            <span className="text-2xl">🔮</span>
            IoT Scanner
            <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
          </CardTitle>
          <CardDescription className="text-orange-200/70">
            Scanning IoT devices and network assets...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🔮</span>
          <InfoTooltip 
            title="IoT Scanner" 
            description="Real-time scanning of Internet of Things devices using Shodan to discover vulnerable devices and assess security risks"
          >
            IoT Scanner
          </InfoTooltip>
          <div className="ml-auto flex items-center gap-2">
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
            data?.scanning ? "Scanning global IoT devices..." : "IoT security monitoring active"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Scanning Status */}
          {data?.scanning && (
            <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-800/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-300">Active Scan in Progress</span>
              </div>
              <p className="text-xs text-purple-200/70 mt-1">
                Discovering new IoT devices and analyzing security posture...
              </p>
            </div>
          )}

          {/* Global IoT Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-300">Total Devices</span>
              </div>
              <div className="text-xl font-bold text-blue-300">
                {data?.stats.totalDevices.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-blue-200/70">IoT devices discovered</p>
            </div>

            <div className="p-3 bg-red-950/30 rounded-lg border border-red-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-400" />
                <span className="text-xs font-medium text-red-300">Vulnerable</span>
              </div>
              <div className="text-xl font-bold text-red-300">
                {data?.stats.vulnerableDevices.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-red-200/70">Devices with issues</p>
            </div>

            <div className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-medium text-orange-300">Critical</span>
              </div>
              <div className="text-xl font-bold text-orange-300">
                {data?.stats.criticalIssues.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-orange-200/70">Critical vulnerabilities</p>
            </div>

            <div className="p-3 bg-green-950/30 rounded-lg border border-green-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-green-400" />
                <span className="text-xs font-medium text-green-300">Countries</span>
              </div>
              <div className="text-xl font-bold text-green-300">
                {data?.stats.countries || '0'}
              </div>
              <p className="text-xs text-green-200/70">Global coverage</p>
            </div>
          </div>

          {/* Device Categories */}
          <div className="space-y-2">
            <h4 className="font-medium text-orange-300">Common Device Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "📷", name: "IP Cameras", risk: "High" },
                { icon: "🌐", name: "Routers", risk: "Medium" },
                { icon: "📺", name: "Smart TVs", risk: "Low" },
                { icon: "🔌", name: "Smart Plugs", risk: "Medium" }
              ].map((device, index) => (
                <div key={index} className="p-2 bg-orange-950/30 rounded border border-orange-800/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{device.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-orange-300">{device.name}</p>
                      <Badge 
                        className={`text-xs ${
                          device.risk === 'High' ? 'bg-red-600' :
                          device.risk === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                      >
                        {device.risk} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="p-3 bg-gray-950/30 rounded-lg border border-gray-800/20">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Security Recommendations</span>
            </div>
            <ul className="text-xs text-gray-200/70 space-y-1">
              <li>• Change default passwords on all IoT devices</li>
              <li>• Enable automatic security updates where available</li>
              <li>• Isolate IoT devices on separate network segments</li>
              <li>• Monitor device communication for anomalies</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={refresh}>
              Start New Scan
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              View Details
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-300 font-medium">IoT Scanner Connection Issue</p>
                  <p className="text-yellow-200/80">
                    Unable to fetch live IoT data from Shodan. Showing demo statistics for educational purposes.
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