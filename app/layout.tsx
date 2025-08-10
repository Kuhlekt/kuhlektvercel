import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { VisitorTracker } from "@/components/visitor-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AR Automation Platform",
  description:
    "The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline debt recovery, and improve cash flow.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VisitorTracker />
        {children}
      </body>
    </html>
  )
}
