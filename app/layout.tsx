import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AR Automation & Digital Collections Platform",
  description:
    "Transform your accounts receivable process with Kuhlekt's AI-powered automation platform. Reduce DSO, improve cash flow, and streamline collections.",
  keywords: "accounts receivable, AR automation, digital collections, cash flow management, invoice processing",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.gif" type="image/gif" />
        <link rel="shortcut icon" href="/favicon.gif" type="image/gif" />
        <link rel="apple-touch-icon" href="/favicon.gif" />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
