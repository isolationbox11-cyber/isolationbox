"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Activity, 
  AlertTriangle, 
  BookOpen, 
  HelpCircle, 
  Cog, 
  GalleryVertical, 
  Globe, 
  Home, 
  Lock, 
  Search, 
  Shield, 
  Skull 
} from "lucide-react"

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    name: "Cyber Search",
    href: "/dashboard/cyber-search",
    icon: Search
  },
  {
    name: "Live Map",
    href: "/dashboard/live-map",
    icon: Globe
  },
  {
    name: "Threats",
    href: "/dashboard/threats",
    icon: Skull
  },
  {
    name: "Vulnerabilities",
    href: "/dashboard/vulnerabilities",
    icon: AlertTriangle
  },
  {
    name: "Learn Mode",
    href: "/dashboard/learn-mode",
    icon: BookOpen
  },
  {
    name: "Activity",
    href: "/dashboard/activity",
    icon: Activity
  },
  {
    name: "Security Tools",
    href: "/dashboard/tools",
    icon: Shield
  },
  { 
    name: "Settings",
    href: "/dashboard/settings",
    icon: Cog
  },
  {
    name: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle
  }
]

export function DashboardNav() {
  const pathname = usePathname()
  
  return (
    <nav className="p-4 space-y-2">
      <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
        MAIN NAVIGATION
      </div>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive 
                ? "bg-accent text-accent-foreground" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <link.icon className={cn(
              "mr-3 h-4 w-4",
              isActive 
                ? "text-orange-500" 
                : "text-muted-foreground group-hover:text-foreground"
            )} />
            {link.name}
            {link.name === "Threats" && (
              <div className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md animate-pulse">
                3
              </div>
            )}
          </Link>
        )
      })}
      
      <div className="mt-8 p-4 border-t">
        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex items-center">
            <Lock className="h-4 w-4 text-orange-500 mr-2" />
            <h4 className="text-sm font-medium">Halloween Special</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unlock all premium features until October 31st! 🎃
          </p>
        </div>
      </div>
    </nav>
  )
}