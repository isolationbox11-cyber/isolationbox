"use client"

import { Ghost, Skull, Flower } from "lucide-react"
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
          className="relative bg-transparent border-orange-500/50 hover:bg-orange-950/30 hover:text-orange-400"
        >
          <Skull className="h-4 w-4 text-orange-400" />
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-br from-orange-500 to-red-600 animate-pulse shadow-[0_0_8px_rgba(255,102,0,0.6)]"
          >
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black/95 border-orange-800/50" align="end">
        <DropdownMenuLabel className="text-orange-400">Spectral Warnings</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-orange-800/50" />
        <DropdownMenuItem className="focus:bg-orange-950/50 focus:text-orange-300">
          <div className="flex gap-3 w-full">
            <Skull className="h-5 w-5 text-red-500 animate-pulse" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-red-400">Haunting: Unauthorized Access Attempt</p>
              <p className="text-xs text-orange-300/70">2 minutes ago</p>
              <p className="text-xs text-orange-300/50 mt-1">Unknown entity attempting to breach your digital barriers</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-orange-950/50 focus:text-orange-300">
          <div className="flex gap-3 w-full">
            <Ghost className="h-5 w-5 text-orange-500" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-orange-400">Warning: Spectral Network Activity</p>
              <p className="text-xs text-orange-300/70">15 minutes ago</p>
              <p className="text-xs text-orange-300/50 mt-1">Unusual ethereal traffic detected in the shadows</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-orange-950/50 focus:text-orange-300">
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
              className="text-yellow-600"
            >
              <path d="M17.5 6.5c-.5-2.5-2.5-3-3.5-3h-4c-1 0-3 .5-3.5 3m11 0c.5 2.5-.5 5.5-1.5 8.5 0 0-2.5 0-3-1 0 0 1.5-1 1.5-5h-2a3 3 0 0 0-3 3c0 .5.5 1 .5 1H9a4 4 0 0 0-4 4c0 1 .5 1 .5 1H8c3.5 0 6-2 8.5-6 0 0 1.5 0 2.5-3.5z" />
              <path d="m9 17 .07-.07A3.98 3.98 0 0 0 10 15" />
            </svg>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-yellow-600">Arcane: Protection Spell Active</p>
              <p className="text-xs text-orange-300/70">1 hour ago</p>
              <p className="text-xs text-orange-300/50 mt-1">Digital wards successfully updated and strengthened</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-orange-800/50" />
        <DropdownMenuItem className="justify-center focus:bg-orange-950/50 focus:text-orange-300">
          <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 hover:bg-orange-950/30">
            View All Mystical Alerts
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}