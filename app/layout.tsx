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

        <Script src="https://kuhlekt.com/widget.js" strategy="afterInteractive" />

        <Script
          id="widget-debug"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[v0] Checking for Kuhlekt widget...');
              
              // Check if widget script loaded
              setTimeout(() => {
                console.log('[v0] Window object keys:', Object.keys(window).filter(k => k.toLowerCase().includes('kuhlekt') || k.toLowerCase().includes('chat') || k.toLowerCase().includes('widget')));
                console.log('[v0] Widget script loaded, checking for initialization...');
              }, 2000);
            `,
          }}
        />

        <NewVisitorBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
