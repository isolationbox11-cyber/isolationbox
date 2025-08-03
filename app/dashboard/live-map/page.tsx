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

      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-950 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">🔍 Network Activity Alert</CardTitle>
          <CardDescription className="text-blue-300/70">
            Elevated scanning activity detected in monitored regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Our monitoring systems have identified an unusual increase in network scanning activity targeting regional IP addresses. 
            This activity pattern suggests coordinated reconnaissance efforts that require enhanced security monitoring. 
            All affected systems have been automatically notified and protective measures have been activated.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}