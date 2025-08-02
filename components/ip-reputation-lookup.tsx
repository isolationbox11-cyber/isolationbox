"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface IPLookupResult {
  ip: string
  isNoisy: boolean
  isRiot: boolean
  classification: string
  threatLevel: string
  lastSeen: string
  spookyDescription: string
  emoji: string
  source: string
  error?: string
}

export function IPReputationLookup() {
  const [ip, setIp] = useState("")
  const [result, setResult] = useState<IPLookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!ip.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/greynoise/ip-lookup?ip=${encodeURIComponent(ip.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup IP')
      }

      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to commune with digital spirits'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-600'
      case 'medium': return 'bg-yellow-600'
      case 'low': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'malicious': return 'text-red-400 border-red-500/50'
      case 'benign': return 'text-green-400 border-green-500/50'
      default: return 'text-gray-400 border-gray-500/50'
    }
  }

  return (
    <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <span className="text-2xl">🔮</span>
          IP Spirit Seeker
        </CardTitle>
        <CardDescription className="text-orange-300/70">
          Consult the digital oracle to reveal the true nature of any IP address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500/70" />
            <Input
              placeholder="Enter IP address (e.g., 8.8.8.8)..."
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="pl-10 bg-black/50 border-orange-900/50 text-orange-100 placeholder:text-orange-300/50 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
              onKeyPress={(e) => e.key === "Enter" && handleLookup()}
            />
          </div>
          <Button 
            onClick={handleLookup} 
            disabled={loading || !ip.trim()}
            className="bg-orange-600 hover:bg-orange-700 animate-pulse shadow-[0_0_10px_rgba(255,102,0,0.5)]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Divine
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-600/50 bg-red-900/20">
            <AlertDescription className="text-red-400">
              💀 {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            <Alert className="border-orange-500/30 bg-black/30">
              <AlertDescription className="text-orange-300">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{result.emoji}</span>
                  <span className="font-bold">Digital Oracle has spoken for {result.ip}</span>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Classification */}
              <div className="p-4 bg-black/50 rounded-lg border border-orange-900/30">
                <h4 className="text-orange-400 font-medium mb-2">🎭 Spirit Classification</h4>
                <Badge 
                  variant="outline" 
                  className={`mb-2 bg-black/30 ${getClassificationColor(result.classification)}`}
                >
                  {result.classification.toUpperCase()}
                </Badge>
                <Badge className={getThreatLevelColor(result.threatLevel)}>
                  {result.threatLevel.toUpperCase()} THREAT
                </Badge>
              </div>

              {/* Activity Status */}
              <div className="p-4 bg-black/50 rounded-lg border border-orange-900/30">
                <h4 className="text-orange-400 font-medium mb-2">👻 Spectral Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={result.isNoisy ? "text-red-400" : "text-green-400"}>
                      {result.isNoisy ? "🔊 Noisy" : "🔇 Quiet"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={result.isRiot ? "text-blue-400" : "text-gray-400"}>
                      {result.isRiot ? "🛡️ RIOT Listed" : "📝 Not RIOT"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-black/50 rounded-lg border border-orange-900/30">
              <h4 className="text-orange-400 font-medium mb-2">🔮 Oracle's Wisdom</h4>
              <p className="text-orange-200/80 text-sm">{result.spookyDescription}</p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-orange-300/60">
              <span>Last seen: {result.lastSeen || 'Unknown'}</span>
              <Badge variant="outline" className="bg-black/30 border-orange-600/30 text-orange-400">
                Powered by GreyNoise
              </Badge>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-6 p-4 bg-orange-950/20 rounded-lg border border-orange-900/30">
          <h4 className="text-orange-400 text-sm font-medium mb-2">🎃 Halloween IP Examples</h4>
          <div className="grid gap-2 text-xs">
            <button 
              onClick={() => setIp('8.8.8.8')}
              className="text-left text-orange-300/70 hover:text-orange-300 transition-colors"
            >
              8.8.8.8 - Google's friendly DNS spirit
            </button>
            <button 
              onClick={() => setIp('1.1.1.1')}
              className="text-left text-orange-300/70 hover:text-orange-300 transition-colors"
            >
              1.1.1.1 - Cloudflare's protective ward
            </button>
            <p className="text-orange-300/50 italic">
              Click to populate the field with example IPs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}