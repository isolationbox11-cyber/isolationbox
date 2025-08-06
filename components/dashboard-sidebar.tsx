"use client"

import { useState } from "react"
import { Shield, Eye, Globe, AlertTriangle, Activity, Database, Search, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  className?: string
  onNavigate?: (section: string) => void
  activeSection?: string
}

const sidebarItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Activity,
    description: "Overview & Stats"
  },
  {
    id: "threats",
    title: "Threat Intelligence",
    icon: Shield,
    description: "Live Threat Data"
  },
  {
    id: "monitoring",
    title: "Monitoring",
    icon: Eye,
    description: "Real-time Monitoring"
  },
  {
    id: "map",
    title: "Threat Map",
    icon: Globe,
    description: "Global Threat View"
  },
  {
    id: "alerts",
    title: "Alerts",
    icon: AlertTriangle,
    description: "Security Alerts"
  },
  {
    id: "search",
    title: "Search",
    icon: Search,
    description: "Query APIs"
  },
  {
    id: "data",
    title: "Data Sources",
    icon: Database,
    description: "API Status"
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    description: "Configuration"
  }
]

export function DashboardSidebar({ className, onNavigate, activeSection = "dashboard" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-sidebar", className)}>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Cyber Vault</h1>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  !isActive && "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => onNavigate?.(item.id)}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                )}
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent p-3">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground">
              <div className="font-medium">All APIs Online</div>
              <div className="text-muted-foreground">5/5 Connected</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}