import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Login - Salem Cyber Vault",
  description: "Enter the haunted cybersecurity vault with Yandex ID OAuth",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Yandex Passport SDK */}
      <Script
        src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
        strategy="beforeInteractive"
        id="yandex-passport-sdk"
      />
      {children}
    </>
  )
}