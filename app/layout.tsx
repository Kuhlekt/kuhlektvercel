import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import NewVisitorBanner from "@/components/new-visitor-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AR Automation & Digital Collections",
  description:
    "Transform your accounts receivable process with Kuhlekt's automated collections platform. Reduce DSO by 30% and eliminate 80% of manual tasks.",
  generator: "v0.app",
  verification: {
    other: {
      "google-site-verification": "SMT2000342327Q08",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="SMT2000342327Q08" />
      </head>
      <body className={inter.className}>
        <GlobalErrorHandler />

        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-942617128" strategy="afterInteractive" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-942617128');
            `,
          }}
        />

        <NewVisitorBanner />
        <Header />
        <main>{children}</main>
        <Footer />

        {/* AI Chatbot Widget - Floating Button */}
        <Script
          id="chatbot-config"
          dangerouslySetInnerHTML={{
            __html: `
              window.chatbotConfig = {
                tenantSlug: 'kuhlekt',
                apiUrl: 'https://chatbot.hindleconsultants.com'
              };
            `,
          }}
        />
        <Script src="https://chatbot.hindleconsultants.com/embed-floating.js" async />
      </body>
    </html>
  )
}
