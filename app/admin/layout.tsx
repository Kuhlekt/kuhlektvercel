import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Kuhlekt",
  description: "Admin dashboard for Kuhlekt",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow, nocache, nosnippet, noimageindex, noarchive" />
        <meta name="googlebot" content="noindex, nofollow, noimageindex, nosnippet, noarchive" />
        <meta name="bingbot" content="noindex, nofollow, noimageindex, nosnippet, noarchive" />
        <meta name="slurp" content="noindex, nofollow, noimageindex, nosnippet, noarchive" />
        <meta name="duckduckbot" content="noindex, nofollow, noimageindex, nosnippet, noarchive" />
        <meta name="baiduspider" content="noindex, nofollow, noimageindex, nosnippet, noarchive" />
        <meta name="yandexbot" content="noindex, nofollow, noimageindex, nosnippet, noarchive" />
      </head>
      <body>{children}</body>
    </html>
  )
}
