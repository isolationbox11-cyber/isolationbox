import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { useThreatIntelligence } from "@/lib/hooks"

export function ThreatIntelligence() {
  const { data, loading, error, refetch } = useThreatIntelligence()
  
  const threats = data?.threats || []

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <span className="text-2xl">🕵️</span>
              Threat Intelligence
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              {data?.lastUpdated 
                ? `Live threats • Updated ${new Date(data.lastUpdated).toLocaleTimeString()}`
                : "Latest threats in the digital realm"
              }
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refetch}
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
          {threats.length === 0 && !loading ? (
            <div className="text-center p-6 text-orange-200/60">
              <span className="text-2xl">🛡️</span>
              <p className="mt-2">No active threats detected</p>
              <p className="text-xs mt-1">Your cyber realm appears secure</p>
            </div>
          ) : (
            threats.map((threat: any, index: number) => (
              <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 hover:bg-orange-950/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{threat.emoji}</span>
                    <h4 className="font-medium text-orange-300">{threat.name}</h4>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
                <div className="flex justify-between items-center text-xs text-orange-200/60">
                  <span>First seen: {threat.firstSeen}</span>
                  {threat.source && (
                    <span className="bg-orange-800/30 px-2 py-1 rounded">
                      {threat.source}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          
          {data?.totalThreats && data.totalThreats > threats.length && (
            <div className="text-center p-2">
              <span className="text-sm text-orange-200/60">
                Showing {threats.length} of {data.totalThreats} threats
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}