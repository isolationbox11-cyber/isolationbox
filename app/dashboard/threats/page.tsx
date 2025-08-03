import { VulnerabilityAnalysis } from "@/components/vulnerability-analysis"
import { AssetMonitoring } from "@/components/asset-monitoring"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ThreatsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">⚠️ Threats & Vulnerabilities</h1>
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">🧟‍♂️ Digital Zombies Alert</CardTitle>
          <CardDescription className="text-blue-300/70">
            Beware of dormant threats awakening during the Halloween season
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Just as zombies rise at Halloween, dormant malware can reactivate during seasonal spikes in online activity.
            Our threat intelligence shows a 24% increase in previously dormant botnets becoming active as we approach
            the Halloween season. Review your security measures now to avoid an unexpected cyber resurrection.
          </p>
        </CardContent>
      </Card>

      <VulnerabilityAnalysis />
      <AssetMonitoring />
    </div>
  )
}