import { CyberSearchInterface } from "@/components/cyber-search-interface"
import { HalloweenAlertsButton } from "@/components/halloween-alerts-button"
import { FloatingEyes } from "@/components/floating-eyes"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-orange-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-orange-400">Salem Cyber Vault</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-950/30">
                <User className="h-4 w-4 mr-2" />
                Enter Vault
              </Button>
            </Link>
            <HalloweenAlertsButton />
          </div>
        </header>
        
        <FloatingEyes />
        
        <CyberSearchInterface />
      </div>
    </main>
  )
}