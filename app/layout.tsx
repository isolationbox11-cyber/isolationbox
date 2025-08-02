import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingEyes } from "@/components/floating-eyes"

// Using system fonts instead of Google Fonts for deployment reliability

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
      <body className="halloween-bg-texture font-sans">
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