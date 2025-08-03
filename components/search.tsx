"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Search() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Close dialog when escape key is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="relative h-8 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-3.5 w-3.5 mr-2" />
        <span className="hidden md:inline-flex">Search...</span>
        <span className="inline-flex md:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search through Security Eye's surveillance..."
              className="pl-10 pr-10 border-none focus-visible:ring-0 focus-visible:ring-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute right-2 top-2.5 h-6 w-6 rounded-full p-0 opacity-70",
                search.length === 0 && "hidden"
              )}
              onClick={() => setSearch("")}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {search.length > 0 && (
            <div className="p-4">
              <DialogHeader>
                <DialogTitle>Search Results</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                {search.toLowerCase() === "security" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">👁️</span>
                        <span>Security Surveillance Tips</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Learn Mode</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">🔍</span>
                        <span>Advanced Threat Detection: Security Eye Malware</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Threats</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">🛡️</span>
                        <span>Security Eye Project - Advanced Monitoring Setup</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Security Tools</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center py-8 text-sm text-muted-foreground">
                    No results found for &quot;{search}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}