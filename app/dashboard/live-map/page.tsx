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

      <Card className="border-sky-500/30 bg-gradient-to-r from-slate-950 to-blue-950 glass-morphism">
        <CardHeader>
          <CardTitle className="text-sky-400">💎 Advanced Monitoring Alert</CardTitle>
          <CardDescription className="text-sky-300/70">
            Enhanced threat detection active in your region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sky-50/70">
            Our advanced AI sensors have detected increased scanning activity targeting systems in your region. 
            The SalemCyberVault platform has automatically enhanced monitoring protocols and deployed additional 
            defensive measures to protect against potential threats.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}