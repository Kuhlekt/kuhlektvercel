"use client"

import dynamic from "next/dynamic"

const VisitorTracker = dynamic(() => import("./visitor-tracker").then((mod) => ({ default: mod.VisitorTracker })), {
  ssr: false,
})

export function ClientVisitorTracker() {
  return <VisitorTracker />
}
