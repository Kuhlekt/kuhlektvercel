import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientVisitorTracker } from "@/components/client-visitor-tracker"

export const metadata: Metadata = {
  title: "Kuhlekt - Credit Management Solutions",
  description: "Advanced credit management and debt collection software for businesses",
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
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ClientVisitorTracker />
      </body>
    </html>
  )
}
