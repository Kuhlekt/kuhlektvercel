import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Kuhlekt",
  description: "Admin dashboard for Kuhlekt",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    notranslate: true,
  },
  other: {
    googlebot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
    bingbot: "noindex,nofollow,noarchive,nosnippet",
    duckduckbot: "noindex,nofollow",
    baiduspider: "noindex,nofollow",
    yandexbot: "noindex,nofollow",
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex,notranslate" />
      <meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet,noimageindex" />
      <meta name="bingbot" content="noindex,nofollow,noarchive,nosnippet" />
      <meta name="duckduckbot" content="noindex,nofollow" />
      <meta name="baiduspider" content="noindex,nofollow" />
      <meta name="yandexbot" content="noindex,nofollow" />
      {children}
    </>
  )
}
