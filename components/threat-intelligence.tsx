"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface ThreatData {
  name: string;
  severity: string;
  description: string;
  firstSeen: string;
  emoji: string;
  source?: string;
  tags?: string[];
  malwareFamilies?: string[];
  indicators?: number;
}

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback threats in case of API failure
  const fallbackThreats: ThreatData[] = [
    {
      name: "PhantomStrike Ransomware",
      severity: "high",
      description: "Active targeting of healthcare systems",
      firstSeen: "2 hours ago",
      emoji: "👻",
      source: "Local Database"
    },
    {
      name: "WitchCraft Botnet",
      severity: "medium", 
      description: "IoT device infections spreading",
      firstSeen: "6 hours ago",
      emoji: "🧙‍♀️",
      source: "Local Database"
    },
    {
      name: "Graveyard Phishing",
      severity: "high",
      description: "Halloween-themed email campaigns",
      firstSeen: "12 hours ago",
      emoji: "🪦",
      source: "Local Database"
    }
  ];

  useEffect(() => {
    async function fetchThreats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/otx/threats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch threat data');
        }
        
        const data = await response.json();
        setThreats(data.threats || fallbackThreats);
        setError(null);
      } catch (err) {
        console.error('Error fetching threats:', err);
        setError('Using cached threat data');
        setThreats(fallbackThreats);
      } finally {
        setIsLoading(false);
      }
    }

    fetchThreats();
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🕵️</span>
          Threat Intelligence
          {error && (
            <Badge variant="outline" className="ml-2 text-xs border-yellow-600 text-yellow-300">
              {error}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          {isLoading ? "Loading latest threats..." : "Latest threats from AlienVault OTX"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse">
                <div className="h-4 bg-orange-800/40 rounded mb-2"></div>
                <div className="h-3 bg-orange-800/30 rounded mb-1"></div>
                <div className="h-2 bg-orange-800/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{threat.emoji}</span>
                    <div>
                      <h4 className="font-medium text-orange-300">{threat.name}</h4>
                      {threat.source && (
                        <p className="text-xs text-orange-200/50">Source: {threat.source}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    {threat.indicators && threat.indicators > 0 && (
                      <Badge variant="outline" className="text-xs border-orange-600 text-orange-300">
                        {threat.indicators} IOCs
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-orange-200/60">First seen: {threat.firstSeen}</p>
                  {threat.malwareFamilies && threat.malwareFamilies.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {threat.malwareFamilies.slice(0, 2).map((family, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-red-600 text-red-300">
                          {family}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}