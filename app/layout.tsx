import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - Automate AR. Get Paid Faster.",
  description:
    "The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline debt recovery, and improve cash flow.",
  keywords: "accounts receivable, AR automation, credit collections, debt recovery, cash flow, B2B payments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
