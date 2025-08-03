"use client"

/**
 * Educational tooltip and help components for cybersecurity terms and features
 */

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Info, AlertCircle } from "lucide-react"

interface InfoTooltipProps {
  title: string
  description: string
  children: React.ReactNode
}

export function InfoTooltip({ title, description, children }: InfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-orange-300 hover:text-orange-200">
          {children}
          <HelpCircle className="ml-1 h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 border-orange-800/50 text-orange-100">
        <div className="space-y-2">
          <h4 className="font-medium text-orange-300">{title}</h4>
          <p className="text-sm text-orange-200/80">{description}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface EducationalDialogProps {
  title: string
  description: string
  content: React.ReactNode
  trigger: React.ReactNode
}

export function EducationalDialog({ title, description, content, trigger }: EducationalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black/95 border-orange-800/50 text-orange-100">
        <DialogHeader>
          <DialogTitle className="text-orange-300">{title}</DialogTitle>
          <DialogDescription className="text-orange-200/80">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ThreatIntelligenceHelp() {
  return (
    <EducationalDialog
      title="🕵️ Threat Intelligence Explained"
      description="Learn about threat intelligence and how it protects your digital realm"
      trigger={
        <Button variant="ghost" size="sm" className="text-orange-300 hover:text-orange-200">
          <Info className="h-4 w-4" />
        </Button>
      }
      content={
        <div className="space-y-4">
          <Card className="bg-orange-950/30 border-orange-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-300">What is Threat Intelligence?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-orange-100/80">
                Threat intelligence is information about current and potential security threats that could harm your systems. 
                Think of it as a early warning system for cyber attacks!
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">Key Components:</h4>
                <ul className="list-disc pl-5 space-y-1 text-orange-100/70">
                  <li><strong>Indicators:</strong> Digital fingerprints of malicious activity (like suspicious IP addresses)</li>
                  <li><strong>Attack Patterns:</strong> How cybercriminals typically operate</li>
                  <li><strong>Vulnerabilities:</strong> Weaknesses that attackers might exploit</li>
                  <li><strong>Attribution:</strong> Who might be behind the attacks</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">Sources:</h4>
                <ul className="list-disc pl-5 space-y-1 text-orange-100/70">
                  <li><strong>AlienVault OTX:</strong> Community-driven threat sharing platform</li>
                  <li><strong>Government Feeds:</strong> Official security advisories</li>
                  <li><strong>Security Researchers:</strong> Independent threat hunters</li>
                  <li><strong>Honeypots:</strong> Decoy systems that attract attackers</li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-300">Halloween Tip:</h5>
                    <p className="text-yellow-100/80 text-sm">
                      Just like checking for poisoned candy, threat intelligence helps you identify dangerous 
                      digital "treats" before they harm your systems!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}

export function VulnerabilityAnalysisHelp() {
  return (
    <EducationalDialog
      title="🛡️ Vulnerability Analysis Explained"
      description="Understanding CVEs and security vulnerabilities"
      trigger={
        <Button variant="ghost" size="sm" className="text-orange-300 hover:text-orange-200">
          <Info className="h-4 w-4" />
        </Button>
      }
      content={
        <div className="space-y-4">
          <Card className="bg-orange-950/30 border-orange-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-300">Understanding Vulnerabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-orange-100/80">
                A vulnerability is like a broken lock on your haunted mansion - it's a weakness that 
                ghosts (hackers) could use to get inside and cause mischief!
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">CVE System:</h4>
                <p className="text-orange-100/70 text-sm">
                  CVE (Common Vulnerabilities and Exposures) is like a catalog of all known digital "curses". 
                  Each CVE has a unique ID and describes exactly what's wrong.
                </p>
                <div className="bg-orange-900/20 p-2 rounded font-mono text-sm">
                  CVE-2023-44487 = A specific vulnerability discovered in 2023
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">CVSS Scoring (0-10):</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">0.0-3.9</Badge>
                    <span className="text-sm text-green-300">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-600">4.0-6.9</Badge>
                    <span className="text-sm text-yellow-300">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600">7.0-8.9</Badge>
                    <span className="text-sm text-orange-300">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">9.0-10.0</Badge>
                    <span className="text-sm text-red-300">Critical</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-800/30">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🧙‍♀️</span>
                  <div>
                    <h5 className="font-medium text-purple-300">Witch's Wisdom:</h5>
                    <p className="text-purple-100/80 text-sm">
                      Always patch your cauldrons (systems) quickly! Unpatched vulnerabilities 
                      are like leaving your spell books open for evil spirits to read.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}

export function AssetMonitoringHelp() {
  return (
    <EducationalDialog
      title="🏰 Asset Monitoring Explained"
      description="Protecting your digital castle and all its contents"
      trigger={
        <Button variant="ghost" size="sm" className="text-orange-300 hover:text-orange-200">
          <Info className="h-4 w-4" />
        </Button>
      }
      content={
        <div className="space-y-4">
          <Card className="bg-orange-950/30 border-orange-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-300">Digital Castle Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-orange-100/80">
                Asset monitoring is like having magical guardians watch over every room, tower, 
                and secret passage in your digital castle!
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">What We Monitor:</h4>
                <ul className="list-disc pl-5 space-y-1 text-orange-100/70">
                  <li><strong>Servers:</strong> The main towers of your castle (web, database, email)</li>
                  <li><strong>Network Devices:</strong> The drawbridges and gates (routers, firewalls)</li>
                  <li><strong>IoT Devices:</strong> Magical artifacts (cameras, smart devices)</li>
                  <li><strong>Applications:</strong> The spell scrolls running your systems</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">Risk Assessment:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Secure</Badge>
                    <span className="text-sm text-green-300">Protected by strong magic (good security)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-600">Warning</Badge>
                    <span className="text-sm text-yellow-300">Some weak spots detected (needs attention)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">Critical</Badge>
                    <span className="text-sm text-red-300">Under siege! (immediate action required)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-800/30">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🔮</span>
                  <div>
                    <h5 className="font-medium text-blue-300">Crystal Ball Insight:</h5>
                    <p className="text-blue-100/80 text-sm">
                      We use Shodan to scan the internet and see how your assets appear to potential 
                      attackers. It's like having a crystal ball that shows you what evil wizards can see!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}

export function ThreatMapHelp() {
  return (
    <EducationalDialog
      title="🌍 Threat Map Explained"
      description="Visualizing global cyber attacks in real-time"
      trigger={
        <Button variant="ghost" size="sm" className="text-orange-300 hover:text-orange-200">
          <Info className="h-4 w-4" />
        </Button>
      }
      content={
        <div className="space-y-4">
          <Card className="bg-orange-950/30 border-orange-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-300">Global Threat Visualization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-orange-100/80">
                The threat map is like a magical scrying mirror that shows you dark forces 
                gathering around the world and which ones might threaten your realm!
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">What You See:</h4>
                <ul className="list-disc pl-5 space-y-1 text-orange-100/70">
                  <li><strong>Attack Sources:</strong> Countries where malicious activity originates</li>
                  <li><strong>Attack Volume:</strong> How many evil spells are being cast</li>
                  <li><strong>Attack Types:</strong> Different kinds of digital curses (DDoS, malware, etc.)</li>
                  <li><strong>Geographic Patterns:</strong> Where the dark magic is strongest</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">Data Sources:</h4>
                <ul className="list-disc pl-5 space-y-1 text-orange-100/70">
                  <li><strong>Honeypots:</strong> Fake systems that attract attackers</li>
                  <li><strong>Firewall Logs:</strong> Records of blocked evil attempts</li>
                  <li><strong>Threat Intelligence:</strong> Reports from other defenders</li>
                  <li><strong>IP Geolocation:</strong> Magical mapping of internet addresses</li>
                </ul>
              </div>

              <div className="p-3 bg-green-950/30 rounded-lg border border-green-800/30">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🗺️</span>
                  <div>
                    <h5 className="font-medium text-green-300">Navigator's Note:</h5>
                    <p className="text-green-100/80 text-sm">
                      Remember: just because attacks come from a country doesn't mean that country's 
                      government is responsible. Hackers often use compromised computers as stepping stones!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    />
  )
}