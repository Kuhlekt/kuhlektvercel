"use client"
import { Suspense, useEffect } from "react"
import type React from "react"

import DemoFormComponent from "./demo-form-component"
import VisitorTracker from "@/components/visitor-tracker"

// Error boundary wrapper component
function ErrorBoundaryWrapper({ children, componentName }: { children: React.ReactNode; componentName: string }) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error(`Error in ${componentName}:`, error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [componentName])

  return <>{children}</>
}

export default function DemoPage() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log("[v0] Unhandled rejection caught:", {
        reason: event.reason,
        reasonType: typeof event.reason,
        reasonValue: event.reason,
        isNull: event.reason === null,
        isUndefined: event.reason === undefined,
        isFalsy: !event.reason,
      })

      // Handle various forms of null/empty rejections
      if (
        event.reason === null ||
        event.reason === undefined ||
        event.reason === "" ||
        (typeof event.reason === "object" && event.reason !== null && Object.keys(event.reason).length === 0)
      ) {
        console.log("[v0] Ignoring null/empty promise rejection")
        event.preventDefault()
        return
      }

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
      <ErrorBoundaryWrapper componentName="VisitorTracker">
        <Suspense fallback={null}>
          <VisitorTracker />
        </Suspense>
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper componentName="DemoFormComponent">
        <DemoFormComponent />
      </ErrorBoundaryWrapper>
    </>
  )
}
