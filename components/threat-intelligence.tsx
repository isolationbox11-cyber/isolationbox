import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ThreatIntelligence() {
  const threats = [
    {
      name: "AdvancedPersistent Threat",
      severity: "high",
      description: "Active targeting of critical infrastructure",
      firstSeen: "2 hours ago",
      emoji: "🔥"
    },
    {
      name: "Distributed Botnet",
      severity: "medium", 
      description: "IoT device compromises spreading globally",
      firstSeen: "6 hours ago",
      emoji: "🕸️"
    },
    {
      name: "Credential Harvesting",
      severity: "high",
      description: "Sophisticated phishing campaigns detected",
      firstSeen: "12 hours ago",
      emoji: "🎣"
    }
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
          <span className="text-2xl">👁️</span>
          Threat Intelligence
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Latest threats in the cyber landscape
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat, index) => (
            <div key={index} className="p-3 bg-blue-950/30 rounded-lg border border-blue-800/20">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{threat.emoji}</span>
                  <h4 className="font-medium text-blue-300">{threat.name}</h4>
                </div>
                <Badge className={getSeverityColor(threat.severity)}>
                  {threat.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-blue-100/70 mb-2">{threat.description}</p>
              <p className="text-xs text-blue-200/60">First seen: {threat.firstSeen}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}