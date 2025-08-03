import { RealTimeMap } from "@/components/real-time-map"
import { ThreatMap } from "@/components/threat-map"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LiveMapPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🗺️ Live Threat Map</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <RealTimeMap />
        <ThreatMap />
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">👁️ Enhanced Monitoring Alert</CardTitle>
          <CardDescription className="text-blue-300/70">
            Advanced threat detection and surveillance systems active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Our advanced monitoring systems have detected increased scanning activity targeting critical infrastructure. 
            Enhanced surveillance protocols are now active, monitoring network traffic patterns and potential threat vectors. 
            All security systems are operating at heightened awareness levels.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}