import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingEyes } from "@/components/floating-eyes"

export const metadata: Metadata = {
  title: "SalemCyberVault - Advanced Cybersecurity Platform",
  description: "Blue glass themed cybersecurity monitoring dashboard with advanced threat detection",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="blue-glass-bg-texture">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "blue-glass"]}
        >
          {children}
          <FloatingEyes />
        </ThemeProvider>
      </body>
    </html>
  )
}