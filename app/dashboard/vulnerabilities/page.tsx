import { VulnerabilityAnalysis } from "@/components/vulnerability-analysis"
import { AssetMonitoring } from "@/components/asset-monitoring"

export default function VulnerabilitiesPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🛡️ Vulnerability Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <VulnerabilityAnalysis />
        <AssetMonitoring />
      </div>
    </div>
  )
}