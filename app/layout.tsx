import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewVisitorBanner } from "@/components/new-visitor-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AR Automation & Collections Platform",
  description: "The #1 platform for B2B credit collections and AR automation",
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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B25J90XFDN"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B25J90XFDN');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <NewVisitorBanner />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
