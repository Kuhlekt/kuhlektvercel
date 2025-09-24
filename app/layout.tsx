import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import NewVisitorBanner from "@/components/new-visitor-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
  description:
    "Transform your AR process with Kuhlekt's AI-driven platform. Reduce DSO by 40%, automate collections, and maintain customer relationships.",
  keywords: "accounts receivable, AR automation, debt collection, AI collections, DSO reduction, invoice management",
  authors: [{ name: "Kuhlekt" }],
  openGraph: {
    title: "Kuhlekt - AI-Powered Accounts Receivable Automation",
    description:
      "Transform your AR process with Kuhlekt's AI-driven platform. Reduce DSO by 40%, automate collections, and maintain customer relationships.",
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
      "Transform your AR process with Kuhlekt's AI-driven platform. Reduce DSO by 40%, automate collections, and maintain customer relationships.",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <VisitorTracker />
          <NewVisitorBanner />
          <Header />

          {/* Google Analytics */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                <!-- Google tag (gtag.js) -->
                (function() {
                  var script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-B25J90XFDN';
                  document.head.appendChild(script);
                  
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-B25J90XFDN');
                })();
              `,
            }}
          />

          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
