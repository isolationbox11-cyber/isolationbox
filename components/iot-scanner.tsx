"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"

interface IoTDevice {
  name: string
  emoji: string
  ip?: string
  port?: number
  org?: string
  location?: string
  product?: string
  lastScan: string
  status: string
  vulnerabilities: number
  risk?: string
}

interface ScanResult {
  devices: IoTDevice[]
  timestamp: string
  source: 'shodan' | 'fallback'
  error?: string
}

export function IoTScanner() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastScan, setLastScan] = useState<string>('')
  const [source, setSource] = useState<'shodan' | 'fallback'>('fallback')
  const [error, setError] = useState<string>('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure": return "bg-green-600"
      case "warning": return "bg-yellow-600"
      case "critical": return "bg-red-600"
      case "unknown": return "bg-gray-600"
      default: return "bg-gray-600"
    }
  }

  const scanDevices = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/shodan/iot-scan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ScanResult = await response.json()
      setDevices(data.devices)
      setLastScan(new Date(data.timestamp).toLocaleTimeString())
      setSource(data.source)
      
      if (data.error) {
        setError(data.error)
      }
    } catch (err) {
      console.error('Failed to scan IoT devices:', err)
      setError(err instanceof Error ? err.message : 'Failed to scan devices')
      
      // Fallback to demo data if API fails
      const fallbackDevices: IoTDevice[] = [
        { name: "Smart Thermostat", status: "secure", lastScan: "N/A", vulnerabilities: 0, emoji: "🌡️" },
        { name: "Security Camera", status: "warning", lastScan: "N/A", vulnerabilities: 1, emoji: "📹" },
        { name: "Smart Doorbell", status: "secure", lastScan: "N/A", vulnerabilities: 0, emoji: "🔔" },
        { name: "WiFi Router", status: "critical", lastScan: "N/A", vulnerabilities: 3, emoji: "📡" },
        { name: "Smart Light Bulbs", status: "secure", lastScan: "N/A", vulnerabilities: 0, emoji: "💡" }
      ]
      setDevices(fallbackDevices)
      setSource('fallback')
    }
    
    setIsLoading(false)
  }

  // Initial load
  useEffect(() => {
    scanDevices()
  }, [])

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🏠</span>
          IoT Device Scanner
          {source === 'shodan' && (
            <Badge variant="outline" className="ml-2 text-xs border-green-500/50 text-green-400">
              Live Data
            </Badge>
          )}
          {source === 'fallback' && (
            <Badge variant="outline" className="ml-2 text-xs border-yellow-500/50 text-yellow-400">
              Demo Mode
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          {source === 'shodan' 
            ? 'Real-time security status of IoT devices found via Shodan'
            : 'Demo data - Configure SHODAN_API_KEY for live results'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <div className="space-y-3 mb-4">
          {devices.map((device, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-950/20">
              <div className="flex items-center gap-3">
                <span className="text-lg">{device.emoji}</span>
                <div>
                  <h4 className="text-sm font-medium text-orange-300">{device.name}</h4>
                  <p className="text-xs text-orange-200/60">
                    {source === 'shodan' && device.ip && (
                      <>IP: {device.ip} | Port: {device.port} | </>
                    )}
                    Last scan: {device.lastScan} | {device.vulnerabilities} vulnerabilities
                  </p>
                  {source === 'shodan' && device.org && (
                    <p className="text-xs text-orange-200/40">
                      {device.org} • {device.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(device.status)}>
                  {device.status.toUpperCase()}
                </Badge>
                {device.risk && device.risk !== 'Unknown' && (
                  <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400">
                    {device.risk}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            onClick={scanDevices}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Scan Devices
              </>
            )}
          </Button>
        </div>
        
        {lastScan && (
          <p className="text-xs text-orange-200/50 mt-2 text-center">
            Last scan completed: {lastScan}
          </p>
        )}
      </CardContent>
    </Card>
  )
}