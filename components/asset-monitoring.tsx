import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AssetMonitoring() {
  const assets = [
    {
      name: "Web Server (nginx)",
      ip: "192.168.1.10",
      status: "secure",
      lastScan: "2 hours ago",
      vulnerabilities: 0,
      riskScore: 15,
      type: "server",
      emoji: "🖥️"
    },
    {
      name: "Database Server (MySQL)",
      ip: "192.168.1.20",
      status: "warning",
      lastScan: "1 hour ago", 
      vulnerabilities: 2,
      riskScore: 45,
      type: "database",
      emoji: "🗄️"
    },
    {
      name: "Email Server (Exchange)",
      ip: "192.168.1.30",
      status: "critical",
      lastScan: "30 min ago",
      vulnerabilities: 5,
      riskScore: 85,
      type: "email",
      emoji: "📧"
    },
    {
      name: "File Server (Windows)",
      ip: "192.168.1.40",
      status: "secure",
      lastScan: "3 hours ago",
      vulnerabilities: 0,
      riskScore: 20,
      type: "file",
      emoji: "📁"
    },
    {
      name: "Backup Server",
      ip: "192.168.1.50",
      status: "warning",
      lastScan: "4 hours ago",
      vulnerabilities: 1,
      riskScore: 35,
      type: "backup",
      emoji: "💾"
    },
    {
      name: "Network Router",
      ip: "192.168.1.1",
      status: "secure",
      lastScan: "1 hour ago",
      vulnerabilities: 0,
      riskScore: 10,
      type: "network",
      emoji: "🔗"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure": return "bg-green-600"
      case "warning": return "bg-yellow-600"
      case "critical": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-400"
    if (score >= 40) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <Card className="border-blue-800/30 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-300">
          <span className="text-2xl">🏰</span>
          Asset Monitoring
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Security status of all network assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-green-950/30 rounded-lg border border-green-800/20">
              <div className="text-2xl font-bold text-green-400">3</div>
              <div className="text-xs text-green-300">Secure Assets</div>
            </div>
            <div className="text-center p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/20">
              <div className="text-2xl font-bold text-yellow-400">2</div>
              <div className="text-xs text-yellow-300">Need Attention</div>
            </div>
            <div className="text-center p-3 bg-red-950/30 rounded-lg border border-red-800/20">
              <div className="text-2xl font-bold text-red-400">1</div>
              <div className="text-xs text-red-300">Critical Issues</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Network Assets</h4>
            {assets.map((asset, index) => (
              <div key={index} className="p-4 bg-blue-950/30 rounded-lg border border-blue-800/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{asset.emoji}</span>
                    <div>
                      <h5 className="text-sm font-medium text-blue-300">{asset.name}</h5>
                      <p className="text-xs text-blue-200/60">{asset.ip} • Last scan: {asset.lastScan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getRiskColor(asset.riskScore)}`}>
                        Risk: {asset.riskScore}/100
                      </div>
                      <div className="text-xs text-orange-200/60">
                        {asset.vulnerabilities} vulnerabilities
                      </div>
                    </div>
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {asset.vulnerabilities > 0 && (
                  <div className="mt-2 p-2 bg-red-950/20 rounded border border-red-800/20">
                    <p className="text-xs text-red-300">
                      ⚠️ {asset.vulnerabilities} vulnerabilities found - immediate attention required
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Scan All Assets
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              Export Asset Report
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-300">
              Schedule Scans
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}