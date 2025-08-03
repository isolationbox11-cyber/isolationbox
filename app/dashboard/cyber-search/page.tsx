import { EnhancedDorkInterface } from "@/components/enhanced-dork-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CyberSearchPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🔍 Enhanced Cyber Search</h1>
        <div className="text-sm text-orange-400">
          Google & Yandex Dorking Capabilities
        </div>
      </div>

      <EnhancedDorkInterface />

      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-400">🎃 New Halloween Features</CardTitle>
          <CardDescription className="text-orange-300/70">
            Enhanced search capabilities with Google and Yandex dorking for comprehensive threat exploration!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Salem Cyber Vault now includes powerful Google and Yandex dorking capabilities alongside our original Shodan integration. 
            Explore the digital realm with pre-built search queries, custom dorks, and educational safety guides. 
            Remember: with great power comes great responsibility - always practice ethical reconnaissance!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}