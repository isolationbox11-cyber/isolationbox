import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SecurityScore } from "@/components/security-score"
import { ThreatIntelligence } from "@/components/threat-intelligence"
import { RecentEvents } from "@/components/recent-events"
import { AlertsOverview } from "@/components/alerts-overview"
import { SystemStatus } from "@/components/system-status"
import { IoTScanner } from "@/components/iot-scanner"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <OnboardingFlow />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight" data-onboarding-target="dashboard-title">💎 Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">August 2, 2025</span>
          <span className="text-sm text-sky-500">💎 Advanced Security Active</span>
        </div>
      </div>

      {/* Top row - Security Score and Threat Intelligence */}
      <div className="grid gap-6 md:grid-cols-2">
        <div data-onboarding-target="security-score">
          <SecurityScore />
        </div>
        <div data-onboarding-target="threat-intelligence">
          <ThreatIntelligence />
        </div>
      </div>

      {/* Blue Glass Promotion Card */}
      <Card className="border-sky-500/30 bg-gradient-to-r from-slate-950 to-blue-950 glass-morphism">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-4xl animate-float">💎</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-sky-400 mb-2">Advanced Security Suite</h3>
              <p className="text-muted-foreground mb-4">
                Protect your digital assets with our cutting-edge security platform! Experience real-time threat detection and advanced analytics.
              </p>
            </div>
            <div>
              <Button variant="default" className="bg-sky-600 hover:bg-sky-700 animate-glow">
                Explore Features
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