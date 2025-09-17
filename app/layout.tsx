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
  title: "Kuhlekt - AR Automation & Digital Collections",
  description:
    "Transform your accounts receivable process with Kuhlekt's automated collections platform. Reduce DSO by 30% and eliminate 80% of manual tasks.",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NewVisitorBanner />
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
          <VisitorTracker />

          {/* Tidio Chat Script */}
          <script src="//code.tidio.co/cqpecqjlg18crvtdezszocsiflmpnp9k.js" async />
        </ThemeProvider>
      </body>
    </html>
  )
}
