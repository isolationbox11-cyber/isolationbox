import { SmartCyberSearch } from "@/components/smart-cyber-search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CyberSearchPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🔍 Smart Cyber Search</h1>
      </div>

      <SmartCyberSearch />

      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-400">🔮 Cyber Intelligence Tips</CardTitle>
          <CardDescription className="text-orange-300/70">
            Best practices for cyber reconnaissance and threat hunting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-white/70">
            <p className="flex items-center gap-2">
              <span className="text-orange-400">•</span>
              Use specific service queries like "apache", "nginx", or "ssh" to find particular software
            </p>
            <p className="flex items-center gap-2">
              <span className="text-orange-400">•</span>
              Combine filters like "port:22 country:US" for targeted reconnaissance
            </p>
            <p className="flex items-center gap-2">
              <span className="text-orange-400">•</span>
              Search for "default password" to find vulnerable devices with factory credentials
            </p>
            <p className="flex items-center gap-2">
              <span className="text-orange-400">•</span>
              Always use this intelligence responsibly and ethically
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}