import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SecurityScore } from "@/components/security-score"
import { ThreatIntelligence } from "@/components/threat-intelligence"
import { RecentEvents } from "@/components/recent-events"
import { AlertsOverview } from "@/components/alerts-overview"
import { SystemStatus } from "@/components/system-status"
import { IoTScanner } from "@/components/iot-scanner"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🛡️ Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">August 2, 2025</span>
          <span className="text-sm text-blue-500">🔒 System Secured</span>
        </div>
      </div>

      {/* Top row - Security Score and Threat Intelligence */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecurityScore />
        <ThreatIntelligence />
      </div>

      {/* Professional Security Promotion Card */}
      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-950 to-blue-950">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-4xl animate-float">🛡️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Enterprise Security Package</h3>
              <p className="text-muted-foreground mb-4">
                Enhance your cybersecurity posture with our comprehensive enterprise protection suite. Advanced threat detection and real-time monitoring.
              </p>
            </div>
            <div>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 animate-glow">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle row - Recent Events and Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentEvents />
        <AlertsOverview />
      </div>

      {/* Bottom row - System Status and IoT Scanner */}
      <div className="grid gap-6 md:grid-cols-2">
        <SystemStatus />
        <IoTScanner />
      </div>
    </div>
  )
}