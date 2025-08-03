import { CyberSearchInterface } from "@/components/cyber-search-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CyberSearchPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🔍 Cyber Search</h1>
      </div>

      <CyberSearchInterface />

      <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">🎃 Halloween Security Tip</CardTitle>
          <CardDescription className="text-blue-300/70">
            Beware of phishing emails disguised as Halloween promotions or costume contests!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Cyber criminals often take advantage of seasonal events to craft convincing phishing schemes. 
            During Halloween, watch out for unsolicited emails offering special discounts, digital costume contests, 
            or spooky screensavers - they might contain malware disguised as Halloween treats!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}