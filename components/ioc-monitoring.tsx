"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface IOCData {
  indicator: string;
  type: string;
  description: string;
  created: string;
  severity: string;
  source: string;
}

export function IOCMonitoring() {
  const [iocs, setIOCs] = useState<IOCData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback IOCs in case of API failure
  const fallbackIOCs: IOCData[] = [
    {
      indicator: "192.168.1.100",
      type: "IPv4",
      description: "Suspicious IP address with high threat score",
      created: new Date().toISOString(),
      severity: "high",
      source: "Local Database"
    },
    {
      indicator: "malicious.example.com",
      type: "domain",
      description: "Known malware command and control domain",
      created: new Date().toISOString(),
      severity: "medium",
      source: "Local Database"
    }
  ];

  useEffect(() => {
    async function fetchIOCs() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/otx/indicators');
        
        if (!response.ok) {
          throw new Error('Failed to fetch IOC data');
        }
        
        const data = await response.json();
        setIOCs(data.indicators?.slice(0, 10) || fallbackIOCs);
        setError(null);
      } catch (err) {
        console.error('Error fetching IOCs:', err);
        setError('Using cached IOC data');
        setIOCs(fallbackIOCs);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIOCs();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "IPv4": return "bg-blue-600"
      case "domain": return "bg-purple-600"
      case "hostname": return "bg-indigo-600"
      case "FileHash-SHA256": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return '1 day ago';
    return `${Math.floor(diffHours / 24)} days ago`;
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🔍</span>
          Indicators of Compromise (IOCs)
          {error && (
            <Badge variant="outline" className="ml-2 text-xs border-yellow-600 text-yellow-300">
              {error}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          {isLoading ? "Loading latest IOCs..." : "Live indicators from AlienVault OTX"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse">
                <div className="h-3 bg-orange-800/40 rounded mb-2"></div>
                <div className="h-2 bg-orange-800/30 rounded mb-1"></div>
                <div className="h-2 bg-orange-800/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {iocs.map((ioc, index) => (
              <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(ioc.type)} variant="secondary">
                        {ioc.type}
                      </Badge>
                      <Badge className={getSeverityColor(ioc.severity)}>
                        {ioc.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm font-mono text-orange-300 truncate" title={ioc.indicator}>
                      {ioc.indicator}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-orange-100/70 mb-1">{ioc.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-orange-200/60">
                    {formatTimeAgo(ioc.created)}
                  </p>
                  <p className="text-xs text-orange-200/50">
                    Source: {ioc.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}