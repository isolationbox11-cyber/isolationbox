"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { AlertTriangle, Eye, Shield, Search } from "lucide-react"

// Custom Security icon
const SecurityEyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C6 4 1.5 8.5 1.5 12S6 20 12 20s10.5-4.5 10.5-8S18 4 12 4z" fill="currentColor" />
    <path d="M12 8C14 8 16 10 16 12S14 16 12 16S8 14 8 12S10 8 12 8z" fill="white" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

export default function SecurityScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [foundEntities, setFoundEntities] = useState<string[]>([])
  
  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanComplete(false)
    setFoundEntities([])
    
    const securityEntities = [
      "Unauthorized Network Access",
      "Suspicious Data Flow",
      "Unmonitored Endpoint",
      "Hidden Admin Account",
      "Background Service Anomaly",
      "Encrypted Communication Channel",
      "Unauthorized Registry Modification",
      "Suspicious Process Behavior",
      "Unverified Network Connection"
    ]
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 10;
        
        // Add a security entity at certain progress points
        if (newProgress === 30 || newProgress === 60 || newProgress === 90) {
          const randomEntity = securityEntities[Math.floor(Math.random() * securityEntities.length)]
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
        <h1 className="text-3xl font-bold tracking-tight">👁️ Security Eye Scan</h1>
      </div>
      
      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="animate-pulse text-2xl">👁️</div> Advanced Security Scanner
          </CardTitle>
          <CardDescription className="text-blue-300/70">
            Detect hidden threats, unauthorized access, and security anomalies across your systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/70">
            The all-seeing security eye monitors every corner of your digital infrastructure.
            Our specialized scanner can detect security vulnerabilities and threats that conventional security
            tools might miss. Use with vigilance - comprehensive surveillance reveals all hidden activities.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <Button 
              onClick={startScan} 
              disabled={isScanning} 
              className="bg-blue-600 hover:bg-blue-700 animate-glow"
            >
              {isScanning ? "👁️ Scanning perimeter..." : "👁️ Start Security Scan"}
            </Button>
            {isScanning && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-blue-300">Scanning for security anomalies...</span>
                  <span className="text-sm text-blue-300">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" 
                  style={{
                    background: "rgba(0, 102, 255, 0.2)",
                    "--tw-progress-bar-color": "rgba(0, 102, 255, 0.8)"
                  } as React.CSSProperties} />
              </div>
            )}
          </div>
          
          {foundEntities.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-blue-300">👁️ Security Anomalies Detected</h3>
              <div className="space-y-2">
                {foundEntities.map((entity, index) => (
                  <div key={index} className="p-3 bg-slate-900/50 rounded-lg border border-blue-900 flex items-start gap-3 animate-pulse">
                    <div className="text-xl">
                      {index % 3 === 0 ? "👁️" : index % 3 === 1 ? "🔍" : "🛡️"}
                    </div>
                    <div>
                      <div className="font-medium text-blue-300">{entity}</div>
                      <div className="text-xs text-blue-300/70">Under surveillance for {Math.floor(Math.random() * 30) + 1} days</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {scanComplete && (
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium text-blue-300">Scan Complete - Security Analysis</h3>
              </div>
              <p className="text-blue-300/70 mb-4">
                Our security scan has detected {foundEntities.length} anomalies that require attention 
                within your digital perimeter. These are potential security vulnerabilities that may 
                compromise system integrity if left unaddressed.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Initiate Security Response
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" /> Unauthorized Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Remnants of unauthorized access attempts and compromised user accounts that continue to threaten your system, 
              consuming resources and occasionally manifesting as suspicious system behavior.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" /> Dormant Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Terminated processes that continue to maintain system hooks, consuming system 
              resources while exhibiting suspicious behavior during off-peak monitoring hours.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-blue-500 text-xl">🔍</div> Security Breach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Malicious code that activates during system maintenance windows, causing subtle 
              security compromises that are difficult to diagnose through conventional monitoring.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}