import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewVisitorBanner } from "@/components/new-visitor-banner"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
  description:
    "Transform your AR process with Kuhlekt's AI-driven platform. Reduce DSO by 40%, automate collections, and improve cash flow with intelligent automation.",
  keywords: "accounts receivable, AR automation, debt collection, DSO reduction, cash flow management, AI collections",
  openGraph: {
    title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
    description:
      "Transform your AR process with Kuhlekt's AI-driven platform. Reduce DSO by 40%, automate collections, and improve cash flow.",
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
    title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
    description:
      "Transform your AR process with Kuhlekt's AI-driven platform. Reduce DSO by 40%, automate collections, and improve cash flow.",
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
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <NewVisitorBanner />
        </Suspense>
        <Header />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B25J90XFDN" />
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

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
