import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingEyes } from "@/components/floating-eyes"

export const metadata: Metadata = {
  title: "Salem Cyber Vault - Cybersecurity Dashboard",
  description: "Halloween-themed cybersecurity monitoring dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans halloween-bg-texture">
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