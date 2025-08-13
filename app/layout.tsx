import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
  description:
    "Transform your accounts receivable process with Kuhlekt's AI-driven platform. Reduce DSO by 40% and increase collection rates by 60%.",
  keywords: "accounts receivable, AR automation, debt collection, invoice management, cash flow, DSO reduction",
  authors: [{ name: "Kuhlekt" }],
  creator: "Kuhlekt",
  publisher: "Kuhlekt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.gif",
    shortcut: "/favicon.gif",
    apple: "/favicon.gif",
  },
  openGraph: {
    title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
    description:
      "Transform your accounts receivable process with Kuhlekt's AI-driven platform. Reduce DSO by 40% and increase collection rates by 60%.",
    url: "https://kuhlekt.com",
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
    title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
    description:
      "Transform your accounts receivable process with Kuhlekt's AI-driven platform. Reduce DSO by 40% and increase collection rates by 60%.",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
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
