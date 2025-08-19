import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kuhlekt Knowledge Base",
  description: "Comprehensive knowledge base for Kuhlekt platform",
  icons: {
    icon: [
      {
        url: "/favicon.gif",
        type: "image/gif",
      },
    ],
    shortcut: "/favicon.gif",
    apple: "/favicon.gif",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.gif" type="image/gif" />
        <link rel="shortcut icon" href="/favicon.gif" type="image/gif" />
        <link rel="apple-touch-icon" href="/favicon.gif" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
