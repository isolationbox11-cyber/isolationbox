"use client"

import { Eye, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SecurityAlertsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-transparent border-blue-500/50 hover:bg-blue-950/30 hover:text-blue-400"
        >
          <Eye className="h-4 w-4 text-blue-400" />
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-br from-blue-500 to-blue-600 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          >
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black/95 border-blue-800/50" align="end">
        <DropdownMenuLabel className="text-blue-400">Security Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-800/50" />
        <DropdownMenuItem className="focus:bg-blue-950/50 focus:text-blue-300">
          <div className="flex gap-3 w-full">
            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-red-400">Critical: Unauthorized Access Attempt</p>
              <p className="text-xs text-blue-300/70">2 minutes ago</p>
              <p className="text-xs text-blue-300/50 mt-1">Suspicious activity detected on network perimeter</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-blue-950/50 focus:text-blue-300">
          <div className="flex gap-3 w-full">
            <Eye className="h-5 w-5 text-blue-500" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-blue-400">Warning: Unusual Network Activity</p>
              <p className="text-xs text-blue-300/70">15 minutes ago</p>
              <p className="text-xs text-blue-300/50 mt-1">Anomalous traffic patterns detected and monitored</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-blue-950/50 focus:text-blue-300">
          <div className="flex gap-3 w-full">
            <Shield className="h-5 w-5 text-green-500" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-green-500">Success: Security Defenses Updated</p>
              <p className="text-xs text-blue-300/70">1 hour ago</p>
              <p className="text-xs text-blue-300/50 mt-1">Firewall rules and intrusion detection systems upgraded</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-blue-800/50" />
        <DropdownMenuItem className="justify-center focus:bg-blue-950/50 focus:text-blue-300">
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30">
            View All Security Alerts
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}