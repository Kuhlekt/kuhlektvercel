import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Kuhlekt",
  description: "Administrative dashboard for Kuhlekt website management",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  other: {
    robots: "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache",
    googlebot: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    bingbot: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    slurp: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    duckduckbot: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    baiduspider: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    yandexbot: "noindex, nofollow, noarchive, nosnippet, noimageindex",
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
      <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="duckduckbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="baiduspider" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="yandexbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="referrer" content="no-referrer" />
      <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta name="pragma" content="no-cache" />
      <meta name="expires" content="0" />
      {children}
    </>
  )
}
