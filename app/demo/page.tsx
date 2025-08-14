"use client"
import { Suspense, useEffect } from "react"
import DemoFormComponent from "./demo-form-component"
import VisitorTracker from "@/components/visitor-tracker"

export default function DemoPage() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection caught:", {
        reason: event.reason,
        promise: event.promise,
        stack: event.reason?.stack || "No stack trace available",
      })

      // Prevent the error from appearing in console
      event.preventDefault()
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <DemoFormComponent />
    </>
  )
}
