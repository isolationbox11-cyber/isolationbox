import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SystemStatus() {
  const systems = [
    { name: "Firewall", status: "active", uptime: "99.9%", emoji: "🔥" },
    { name: "Antivirus", status: "active", uptime: "100%", emoji: "🛡️" },
    { name: "Backup System", status: "active", uptime: "98.7%", emoji: "💾" },
    { name: "Network Monitor", status: "warning", uptime: "95.2%", emoji: "📡" },
    { name: "Email Security", status: "active", uptime: "99.5%", emoji: "📧" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-600"
      case "warning": return "bg-yellow-600"
      case "error": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-blue-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-300">
          <span className="text-2xl">⚙️</span>
          System Status
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Current status of security systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-950/20">
              <div className="flex items-center gap-3">
                <span className="text-lg">{system.emoji}</span>
                <div>
                  <h4 className="text-sm font-medium text-blue-300">{system.name}</h4>
                  <p className="text-xs text-blue-200/60">Uptime: {system.uptime}</p>
                </div>
              </div>
              <Badge className={getStatusColor(system.status)}>
                {system.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}