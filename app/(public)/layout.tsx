import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewVisitorBanner from "@/components/new-visitor-banner"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NewVisitorBanner />
      <Header />
      {children}
      <Footer />
    </>
  )
}
