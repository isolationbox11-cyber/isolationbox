import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingEyes } from "@/components/floating-eyes"

export const metadata: Metadata = {
  title: "Cyber Intelligence Vault - Cybersecurity Dashboard",
  description: "Professional cybersecurity monitoring dashboard with advanced threat intelligence",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="cyber-bg-texture">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "halloween"]}
        >
          {children}
          <FloatingEyes />
        </ThemeProvider>
      </body>
    </html>
  )
}