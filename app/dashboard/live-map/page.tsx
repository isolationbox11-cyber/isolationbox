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

      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-400">👻 Spectral Activity Alert</CardTitle>
          <CardDescription className="text-orange-300/70">
            Unusual cyber activity detected in the Salem region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Our sensors have detected an unusual spike in scanning activity targeting Salem-based IP addresses. 
            This may be related to seasonal "cyber hauntings" that typically occur as we approach Halloween. 
            We're enhancing monitoring of potentially affected systems.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}