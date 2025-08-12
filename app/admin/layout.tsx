import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Kuhlekt",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
    nosnippet: true,
  },
  other: {
    googlebot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
    bingbot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
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
      <meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex,nocache" />
      <meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet,noimageindex" />
      <meta name="bingbot" content="noindex,nofollow,noarchive,nosnippet,noimageindex" />
      <meta name="duckduckbot" content="noindex,nofollow" />
      <meta name="baiduspider" content="noindex,nofollow" />
      <meta name="yandexbot" content="noindex,nofollow" />
      {children}
    </>
  )
}
