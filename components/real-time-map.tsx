import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RealTimeMap() {
  const attackData = [
    { country: "China", attacks: 847, severity: "high" },
    { country: "Russia", attacks: 623, severity: "high" },
    { country: "North Korea", attacks: 234, severity: "medium" },
    { country: "Iran", attacks: 189, severity: "medium" },
    { country: "Unknown", attacks: 156, severity: "low" }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-blue-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-300">
          <span className="text-2xl">🌍</span>
          Real-Time Attack Map
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Live cyber threats detected worldwide
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg border-2 border-blue-800/20">
            <div className="text-center mb-4">
              <div className="text-6xl animate-pulse">🗺️</div>
              <p className="text-blue-300 mt-2">Interactive World Map</p>
              <p className="text-xs text-blue-200/60">Real-time attack visualization would appear here</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-blue-300">Top Attack Sources (Last 24h)</h4>
            {attackData.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-blue-950/30">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚩</span>
                  <div>
                    <h5 className="text-sm font-medium text-blue-300">{source.country}</h5>
                    <p className="text-xs text-blue-200/60">{source.attacks} attacks detected</p>
                  </div>
                </div>
                <Badge className={getSeverityColor(source.severity)}>
                  {source.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}