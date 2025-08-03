"use client"

import { Ghost, Skull } from "lucide-react"
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

export function HalloweenAlertsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-transparent border-blue-500/50 hover:bg-blue-950/30 hover:text-blue-400"
        >
          <Skull className="h-4 w-4 text-blue-400" />
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-br from-blue-500 to-red-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"
          >
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-slate-950/95 border-blue-800/50" align="end">
        <DropdownMenuLabel className="text-blue-400">Security Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-800/50" />
        <DropdownMenuItem className="focus:bg-blue-950/50 focus:text-blue-300">
          <div className="flex gap-3 w-full">
            <Skull className="h-5 w-5 text-red-500 animate-pulse" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-red-400">Critical: Unauthorized Access Attempt</p>
              <p className="text-xs text-blue-300/70">2 minutes ago</p>
              <p className="text-xs text-blue-300/50 mt-1">Multiple failed login attempts detected from suspicious IP</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-blue-950/50 focus:text-blue-300">
          <div className="flex gap-3 w-full">
            <Ghost className="h-5 w-5 text-blue-500" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-blue-400">Warning: Anomalous Network Activity</p>
              <p className="text-xs text-blue-300/70">15 minutes ago</p>
              <p className="text-xs text-blue-300/50 mt-1">Unusual traffic patterns detected on network segment</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-blue-950/50 focus:text-blue-300">
          <div className="flex gap-3 w-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-green-600"
            >
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-green-600">Info: Security Update Applied</p>
              <p className="text-xs text-blue-300/70">1 hour ago</p>
              <p className="text-xs text-blue-300/50 mt-1">Security patches successfully installed and active</p>
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