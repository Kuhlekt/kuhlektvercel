import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
        <Header />
        <main>{children}</main>
        <Footer />

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

        <Script
          id="chatbot-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.hc = window.hc || function() {
                (window.hc.q = window.hc.q || []).push(arguments);
              };
            `,
          }}
        />
        <Script
          id="chatbot-widget"
          src="https://chatbot.hindleconsultants.com/widget.js"
          strategy="afterInteractive"
        />
        <Script
          id="chatbot-start"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.hc) {
                window.hc('init', { tenantId: 'c3a22737-835a-480b-9cd2-5ee9b40d3be4' });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
