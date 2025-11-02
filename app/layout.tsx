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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalErrorHandler />

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-B25J90XFDN" strategy="afterInteractive" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B25J90XFDN');
            `,
          }}
        />

        {/* External Kali Widget Configuration */}
        <Script
          id="kali-widget-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.KALI_API_URL = '';
              window.KALI_CONFIG = {
                apiUrl: 'https://kali.kuhlekt-info.com',
                messageUrl: '/api/chat/message',
                knowledgeBaseUrl: '/api/chat/knowledge',
                handoffUrl: '/api/chat/handoff'
              };
              console.log('[Kuhlekt] Kali Widget API URL set to use relative URLs');
              console.log('[Kuhlekt] Message endpoint:', '/api/chat/message');
              console.log('[Kuhlekt] Knowledge Base endpoint:', '/api/chat/knowledge');
              console.log('[Kuhlekt] Handoff endpoint:', '/api/chat/handoff');
              console.log('[Kuhlekt] Requesting Kali Widget v2.1 from:', 'https://kali.kuhlekt-info.com/widget.js?v=2.1&t=' + Date.now());
            `,
          }}
        />

        {/* External Kali Widget Script - Updated to explicitly request v2.1 with timestamp */}
        <Script src={`https://kali.kuhlekt-info.com/widget.js?v=2.1&t=${Date.now()}`} strategy="afterInteractive" />

        <NewVisitorBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
