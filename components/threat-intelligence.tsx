"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"

interface Threat {
  name: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  firstSeen: string;
  emoji: string;
  detectionRatio?: string;
}

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchThreats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/threats');
      const result = await response.json();
      
      if (result.success) {
        setThreats(result.data);
        setLastUpdated(new Date(result.timestamp).toLocaleTimeString());
      } else {
        throw new Error(result.error || 'Failed to fetch threats');
      }
    } catch (err) {
      console.error('Error fetching threats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch threat data');
      
      // Fallback to demo data when API fails
      setThreats([
        {
          name: "PhantomStrike Ransomware",
          severity: "high",
          description: "Active targeting of healthcare systems",
          firstSeen: "2 hours ago",
          emoji: "👻"
        },
        {
          name: "WitchCraft Botnet",
          severity: "medium", 
          description: "IoT device infections spreading",
          firstSeen: "6 hours ago",
          emoji: "🧙‍♀️"
        },
        {
          name: "Graveyard Phishing",
          severity: "high",
          description: "Halloween-themed email campaigns",
          firstSeen: "12 hours ago",
          emoji: "🪦"
        }
      ]);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕵️</span>
            <div>
              <CardTitle className="text-orange-300">
                Threat Intelligence
              </CardTitle>
              <CardDescription className="text-orange-200/70">
                {error ? 'Demo data (API unavailable)' : 'Live VirusTotal threat data'}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={fetchThreats}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-orange-600 text-orange-300 hover:bg-orange-600/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {lastUpdated && (
          <div className="text-xs text-orange-200/60">
            Last updated: {lastUpdated}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat, index) => (
            <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{threat.emoji}</span>
                  <h4 className="font-medium text-orange-300">{threat.name}</h4>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                  {threat.detectionRatio && (
                    <span className="text-xs text-orange-200/60">
                      {threat.detectionRatio}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
              <p className="text-xs text-orange-200/60">First seen: {threat.firstSeen}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}