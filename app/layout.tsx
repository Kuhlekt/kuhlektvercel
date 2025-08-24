import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt Knowledge Base",
  description: "A comprehensive knowledge management system for documentation and guides",
  keywords: ["knowledge base", "documentation", "articles", "help", "guides"],
  authors: [{ name: "Kuhlekt" }],
  openGraph: {
    title: "Kuhlekt Knowledge Base",
    description: "Your comprehensive knowledge management system",
    type: "website",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
