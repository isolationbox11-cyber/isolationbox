"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading"
import { useDashboard } from "@/contexts/dashboard-context"
import { RefreshCw, Globe } from "lucide-react"

export function IoTScanner() {
  const { state, actions } = useDashboard()
  const { iotDevices, loading, errors } = state

  const getDeviceEmoji = (product?: string) => {
    if (!product) return "📟"
    const productLower = product.toLowerCase()
    
    if (productLower.includes('camera') || productLower.includes('webcam')) return "📹"
    if (productLower.includes('router')) return "📡"
    if (productLower.includes('thermostat')) return "🌡️"
    if (productLower.includes('doorbell')) return "🔔"
    if (productLower.includes('light')) return "💡"
    if (productLower.includes('printer')) return "🖨️"
    if (productLower.includes('server')) return "🖥️"
    if (productLower.includes('nvr') || productLower.includes('dvr')) return "📼"
    return "🏠"
  }

  const getSecurityStatus = (device: any) => {
    // Simple heuristic for device security assessment
    const product = device.product?.toLowerCase() || ""
    const hasAuth = device.data && (
      device.data.includes('login') || 
      device.data.includes('auth') ||
      device.data.includes('password')
    )
    
    if (product.includes('vulnerable') || product.includes('exploit')) {
      return { status: "critical", score: 0 }
    }
    
    if (!hasAuth && (product.includes('camera') || product.includes('webcam'))) {
      return { status: "critical", score: 1 }
    }
    
    if (!hasAuth) {
      return { status: "warning", score: 2 }
    }
    
    return { status: "secure", score: 0 }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure": return "bg-green-600"
      case "warning": return "bg-yellow-600"
      case "critical": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Active now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const secureCount = iotDevices.filter(d => getSecurityStatus(d).status === "secure").length
  const warningCount = iotDevices.filter(d => getSecurityStatus(d).status === "warning").length
  const criticalCount = iotDevices.filter(d => getSecurityStatus(d).status === "critical").length

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            IoT Device Scanner
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.refreshIoTDevices}
            disabled={loading.iotDevices}
            className="text-orange-300 hover:text-orange-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading.iotDevices ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Real-time IoT device discovery via Shodan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading.iotDevices && iotDevices.length === 0 ? (
          <LoadingSpinner text="Scanning for IoT devices..." className="py-8" />
        ) : errors.iotDevices ? (
          <ErrorDisplay 
            error={errors.iotDevices} 
            retry={actions.refreshIoTDevices}
            className="my-4"
          />
        ) : iotDevices.length > 0 ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="text-center p-2 bg-green-950/30 rounded border border-green-500/30">
                <div className="text-green-400 font-bold">{secureCount}</div>
                <div className="text-green-300/70">Secure</div>
              </div>
              <div className="text-center p-2 bg-yellow-950/30 rounded border border-yellow-500/30">
                <div className="text-yellow-400 font-bold">{warningCount}</div>
                <div className="text-yellow-300/70">Warning</div>
              </div>
              <div className="text-center p-2 bg-red-950/30 rounded border border-red-500/30">
                <div className="text-red-400 font-bold">{criticalCount}</div>
                <div className="text-red-300/70">Critical</div>
              </div>
            </div>

            {/* Device List */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {iotDevices.slice(0, 10).map((device, index) => {
                const security = getSecurityStatus(device)
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-950/20">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg">{getDeviceEmoji(device.product)}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-orange-300 truncate">
                          {device.product || "Unknown Device"}
                        </h4>
                        <div className="text-xs text-orange-200/60 space-x-2">
                          <span>📍 {device.location?.country_name || "Unknown"}</span>
                          <span>🌐 {device.ip_str}</span>
                          <span>🔌 {device.port}</span>
                        </div>
                        <div className="text-xs text-orange-200/40">
                          {device.org && (
                            <span>🏢 {device.org.slice(0, 30)}{device.org.length > 30 ? '...' : ''}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(security.status)}>
                        {security.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>

            {iotDevices.length > 10 && (
              <div className="text-xs text-orange-300/60 text-center mb-4">
                Showing 10 of {iotDevices.length} devices found
              </div>
            )}

            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={actions.refreshIoTDevices}
              disabled={loading.iotDevices}
            >
              <Globe className="h-4 w-4 mr-2" />
              {loading.iotDevices ? "Scanning..." : "Refresh Scan"}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-orange-300/70">No IoT devices found</p>
            <p className="text-xs text-orange-200/50 mt-1">Click scan to search for devices</p>
            <Button 
              className="mt-4 bg-orange-600 hover:bg-orange-700"
              onClick={actions.refreshIoTDevices}
            >
              Start Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}