"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { AlertTriangle, Ghost, Skull } from "lucide-react"

// Custom Halloween icon
const PumpkinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C16.4183 8 20 11.5817 20 16C20 20.4183 16.4183 24 12 24C7.58172 24 4 20.4183 4 16C4 11.5817 7.58172 8 12 8Z" fill="currentColor" />
    <path d="M9 16C9 14.8954 9.89543 14 11 14C11 15.1046 10.1046 16 9 16Z" fill="white" />
    <path d="M15 16C15 14.8954 14.1046 14 13 14C13 15.1046 13.8954 16 15 16Z" fill="white" />
    <path d="M14.5 18H9.5C9.5 19.1046 10.6193 20 12 20C13.3807 20 14.5 19.1046 14.5 18Z" fill="white" />
    <path d="M12 8C12 6.34315 10.6569 5 9 5C7.34315 5 7 6 7 7C7 7 8 8 12 8Z" fill="#44A64D" />
    <path d="M12 8C12 6.34315 13.3431 5 15 5C16.6569 5 17 6 17 7C17 7 16 8 12 8Z" fill="#44A64D" />
    <path d="M12 8L12 6L12 2L14 1L12 0L10 1L12 2L12 6Z" fill="#44A64D" />
  </svg>
)

export default function SpookyScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [foundEntities, setFoundEntities] = useState<string[]>([])
  
  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanComplete(false)
    setFoundEntities([])
    
    const systemEntities = [
      "Orphaned Process Thread",
      "Persistent Memory Leak",
      "Unregistered Service Handler",
      "Elevated Privilege Account",
      "Background System Service", 
      "Dormant Network Connection",
      "Suspicious Registry Entry",
      "Cached Authentication Token",
      "Temporary System Cache"
    ]
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 10;
        
        // Add a system entity at certain progress points
        if (newProgress === 30 || newProgress === 60 || newProgress === 90) {
          const randomEntity = systemEntities[Math.floor(Math.random() * systemEntities.length)]
          setFoundEntities(prev => [...prev, randomEntity])
        }
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setScanComplete(true)
          return 100
        }
        return newProgress
      })
    }, 600)
  }
  
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🔍 System Scanner</h1>
      </div>
      
      <Card className="border-sky-500/30 bg-gradient-to-r from-slate-950 to-blue-950 glass-morphism">
        <CardHeader>
          <CardTitle className="text-sky-400 flex items-center gap-2">
            <div className="animate-pulse text-2xl">💎</div> Advanced System Scanner
          </CardTitle>
          <CardDescription className="text-sky-300/70">
            AI-powered deep system analysis to detect hidden processes and anomalies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sky-50/70">
            Our advanced scanning technology uses machine learning algorithms to detect unusual patterns
            and hidden processes that conventional security tools might miss. This comprehensive scan
            analyzes system behavior, network connections, and process integrity in real-time.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <Button 
              onClick={startScan} 
              disabled={isScanning} 
              className="bg-sky-600 hover:bg-sky-700 animate-glow"
            >
              {isScanning ? "💎 Analyzing system..." : "💎 Start Deep Scan"}
            </Button>
            {isScanning && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-sky-300">Scanning for system anomalies...</span>
                  <span className="text-sm text-sky-300">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" 
                  style={{
                    background: "rgba(14, 165, 233, 0.2)",
                    "--tw-progress-bar-color": "rgba(14, 165, 233, 0.8)"
                  } as React.CSSProperties} />
              </div>
            )}
          </div>
          
          {foundEntities.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-sky-300">🔍 System Anomalies Detected</h3>
              <div className="space-y-2">
                {foundEntities.map((entity, index) => (
                  <div key={index} className="p-3 bg-slate-950/50 rounded-lg border border-sky-900 flex items-start gap-3 animate-pulse">
                    <div className="text-xl">
                      {index % 3 === 0 ? "🔍" : index % 3 === 1 ? "⚠️" : "🔧"}
                    </div>
                    <div>
                      <div className="font-medium text-sky-300">{entity}</div>
                      <div className="text-xs text-sky-300/70">Active since {Math.floor(Math.random() * 30) + 1} days ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {scanComplete && (
            <div className="mt-6 p-4 bg-slate-950/50 rounded-lg border border-sky-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-sky-500" />
                <h3 className="text-lg font-medium text-sky-300">Scan Complete - System Analysis</h3>
              </div>
              <p className="text-sky-300/70 mb-4">
                Our advanced scan has detected {foundEntities.length} system anomalies that require attention. 
                These processes or configurations may impact system performance or security. 
                Review and remediate these issues to maintain optimal system health.
              </p>
              <Button className="bg-sky-600 hover:bg-sky-700">
                Start Remediation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ghost className="h-5 w-5 text-sky-500" /> Orphaned Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Remnants of terminated applications and old user sessions that continue to consume 
              system resources, requiring cleanup to maintain optimal performance.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skull className="h-5 w-5 text-sky-500" /> Memory Leaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Applications that fail to properly release memory resources, gradually consuming 
              available RAM and impacting system stability over time.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-sky-500 text-xl">🔧</div> Configuration Drift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              System configurations that have deviated from security baselines, potentially 
              creating vulnerabilities that require immediate attention and remediation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}