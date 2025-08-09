import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kuhlekt Knowledge Base",
  description: "Comprehensive knowledge base for Kuhlekt platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
