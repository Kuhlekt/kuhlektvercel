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

        <Script
          id="kali-widget-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.KALI_API_URL = 'https://kali.kuhlekt-info.com';
              window.KALI_CONFIG = {
                apiUrl: 'https://kali.kuhlekt-info.com',
                chatUrl: 'https://kali.kuhlekt-info.com/api/chat',
                handoffUrl: 'https://kali.kuhlekt-info.com/api/chat/handoff',
                knowledgeBaseUrl: 'https://kali.kuhlekt-info.com/api/chat/knowledge',
                enableKnowledgeBase: true,
                autoLoadKnowledgeBase: true
              };
              console.log('[Kuhlekt] Kali Widget configured to use Kali server directly');
              console.log('[Kuhlekt] API URL:', window.KALI_API_URL);
              console.log('[Kuhlekt] Config:', window.KALI_CONFIG);
            `,
          }}
        />

        <Script src="https://kali.kuhlekt-info.com/widget.js?v=2.1" strategy="afterInteractive" />

        <NewVisitorBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
