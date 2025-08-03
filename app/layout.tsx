import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingEyes } from "@/components/floating-eyes"

export const metadata: Metadata = {
  title: "Cyber Vault - Professional Cybersecurity Dashboard",
  description: "Professional cybersecurity monitoring and threat intelligence dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="professional-bg-texture">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "professional"]}
        >
          {children}
          <FloatingEyes />
        </ThemeProvider>
      </body>
    </html>
  )
}