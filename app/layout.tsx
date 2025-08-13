import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AI-Powered Accounts Receivable Management",
  description:
    "Transform your accounts receivable with Kuhlekt's AI-driven platform. Reduce DSO by 40% and increase collection rates by 60%. Get started with a free demo today.",
  keywords: "accounts receivable, collections, AI, automation, DSO, cash flow, invoice management",
  authors: [{ name: "Kuhlekt" }],
  creator: "Kuhlekt",
  publisher: "Kuhlekt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kuhlekt.com"),
  openGraph: {
    title: "Kuhlekt - AI-Powered Accounts Receivable Management",
    description:
      "Transform your accounts receivable with Kuhlekt's AI-driven platform. Reduce DSO by 40% and increase collection rates by 60%.",
    url: "/",
    siteName: "Kuhlekt",
    images: [
      {
        url: "/images/kuhlekt-dashboard-interface.png",
        width: 1200,
        height: 630,
        alt: "Kuhlekt Dashboard Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuhlekt - AI-Powered Accounts Receivable Management",
    description:
      "Transform your accounts receivable with Kuhlekt's AI-driven platform. Reduce DSO by 40% and increase collection rates by 60%.",
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
  verification: {
    google: "your-google-verification-code",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
