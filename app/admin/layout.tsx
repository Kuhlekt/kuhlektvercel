import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Kuhlekt",
  description: "Administrative dashboard for Kuhlekt",
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
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, nocache" />
      <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="duckduckbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="baiduspider" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="yandexbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <div className="admin-layout">{children}</div>
    </>
  )
}
