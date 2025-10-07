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
  return <div className="admin-layout">{children}</div>
}
