"use client"

import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AlertsButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8">
          <BellIcon className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span>Critical vulnerability detected in Windows 11</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          <span>Suspicious login detected from Salem, MA</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          <span>Unusual port scanning activity detected</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-xs text-muted-foreground">
          View all alerts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}