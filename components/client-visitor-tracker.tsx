"use client"

import dynamic from "next/dynamic"

const VisitorTracker = dynamic(() => import("./visitor-tracker").then((mod) => ({ default: mod.VisitorTracker })), {
  ssr: false,
  loading: () => null,
})

export function ClientVisitorTracker() {
  return <VisitorTracker />
}
