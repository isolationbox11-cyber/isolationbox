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

      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">👁️ Surveillance Activity Alert</CardTitle>
          <CardDescription className="text-blue-300/70">
            Unusual cyber activity detected under continuous monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Our surveillance network has detected an unusual spike in scanning activity targeting monitored IP addresses. 
            This may be related to coordinated "cyber reconnaissance" operations that require enhanced security protocols. 
            We&apos;re intensifying monitoring of potentially affected systems with advanced eye-tracking technology.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}