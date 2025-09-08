import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VisitorTracker } from "@/components/visitor-tracker"
import { NewVisitorBanner } from "@/components/new-visitor-banner"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AR Automation & Digital Collections",
  description:
    "Transform your accounts receivable process with Kuhlekt's automated AR solutions. Reduce DSO, improve cash flow, and streamline collections with our enterprise-grade platform.",
  keywords:
    "accounts receivable, AR automation, digital collections, cash flow management, DSO reduction, credit management",
  authors: [{ name: "Kuhlekt" }],
  openGraph: {
    title: "Kuhlekt - AR Automation & Digital Collections",
    description: "Transform your accounts receivable process with automated AR solutions",
    url: "https://kuhlekt.com",
    siteName: "Kuhlekt",
    images: [
      {
        url: "/images/kuhlekt-dashboard-interface.png",
        width: 1200,
        height: 630,
        alt: "Kuhlekt AR Dashboard Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuhlekt - AR Automation & Digital Collections",
    description: "Transform your accounts receivable process with automated AR solutions",
    images: ["/images/kuhlekt-dashboard-interface.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Z5H3V9LW83" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z5H3V9LW83');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <VisitorTracker />
          <NewVisitorBanner />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* Tidio Chat Script */}
        <Script src="//code.tidio.co/cqpecqjlg18crvtdezszocsiflmpnp9k.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
