"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Shield, Globe, AlertTriangle, Bot, Eye } from "lucide-react"
import { getDashboardStats } from "@/lib/unified-api"
import type { DashboardStats } from "@/lib/unified-api"

const defaultStats: DashboardStats = {
  totalQueries: 0,
  activeBots: 0,
  threatLevel: 'low',
  countries: 0,
  malwareDetected: 0,
  recentAlerts: 0
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  const statsData = [
    {
      title: "Total Queries",
      value: loading ? "..." : stats.totalQueries.toLocaleString(),
      icon: Activity,
      description: "API queries today",
      trend: "+12% from yesterday"
    },
    {
      title: "Active Threats",
      value: loading ? "..." : stats.activeBots.toLocaleString(),
      icon: Bot,
      description: "Detected bot networks",
      trend: "+5 new detections"
    },
    {
      title: "Threat Level",
      value: loading ? "..." : stats.threatLevel.toUpperCase(),
      icon: Shield,
      description: "Current global status",
      badge: true,
      badgeVariant: getThreatLevelColor(stats.threatLevel)
    },
    {
      title: "Countries",
      value: loading ? "..." : stats.countries.toString(),
      icon: Globe,
      description: "Active threat origins",
      trend: "Across all regions"
    },
    {
      title: "Malware Detected",
      value: loading ? "..." : stats.malwareDetected.toString(),
      icon: AlertTriangle,
      description: "New samples today",
      trend: "+3 critical variants"
    },
    {
      title: "Recent Alerts",
      value: loading ? "..." : stats.recentAlerts.toString(),
      icon: Eye,
      description: "Last 24 hours",
      trend: "15 resolved"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.badge && !loading && (
                  <Badge variant={stat.badgeVariant as any}>
                    {stats.threatLevel.toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.trend && (
                <p className="text-xs text-primary mt-1">
                  {stat.trend}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}