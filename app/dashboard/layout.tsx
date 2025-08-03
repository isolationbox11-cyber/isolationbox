import type React from "react"
import type { Metadata } from "next"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { Search } from "@/components/search"
import { AlertsButton } from "@/components/alerts-button"
import { ModeToggle } from "@/components/mode-toggle"
import { Suspense } from "react"
import { FloatingEyes } from "@/components/floating-eyes"

export const metadata: Metadata = {
  title: "Dashboard - Salem Cyber Vault",
  description: "Cybersecurity monitoring dashboard with Halloween theme",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">👻 Salem Cyber Vault</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Suspense fallback={null}>
              <Search />
            </Suspense>
            <Suspense fallback={null}>
              <AlertsButton />
            </Suspense>
            <Suspense fallback={null}>
              <ModeToggle />
            </Suspense>
            <Suspense fallback={null}>
              <UserNav />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-4rem)]">
          <DashboardNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
      <FloatingEyes />
    </div>
  )
}