import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SecurityScore } from "@/components/security-score"
import { ThreatIntelligence } from "@/components/threat-intelligence"
import { RecentEvents } from "@/components/recent-events"
import { AlertsOverview } from "@/components/alerts-overview"
import { SystemStatus } from "@/components/system-status"
import { IoTScanner } from "@/components/iot-scanner"
import { IOCMonitoring } from "@/components/ioc-monitoring"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🎃 Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">August 2, 2025</span>
          <span className="text-sm text-orange-500">🎃 90 days to Halloween</span>
        </div>
      </div>

      {/* Top row - Security Score and Threat Intelligence */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecurityScore />
        <ThreatIntelligence />
      </div>

      {/* Halloween Promotion Card */}
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-4xl animate-float">🎃</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Halloween Security Special</h3>
              <p className="text-muted-foreground mb-4">
                Protect your digital realm from spectral threats! Get our premium security package at 50% off until October 31st.
              </p>
            </div>
            <div>
              <Button variant="default" className="bg-orange-600 hover:bg-orange-700 animate-glow">
                Claim Offer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle row - Recent Events and IOC Monitoring */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentEvents />
        <IOCMonitoring />
      </div>

      {/* Bottom row - Alerts and System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <AlertsOverview />
        <SystemStatus />
      </div>
      
      {/* Full width - IoT Scanner */}
      <IoTScanner />
    </div>
  )
}