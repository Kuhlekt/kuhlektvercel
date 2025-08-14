"use client"
import { useEffect, useState } from "react"

export default function DemoPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorInfo = {
        reason: event.reason,
        reasonType: typeof event.reason,
        reasonValue: String(event.reason),
        stack: event.reason?.stack || "No stack trace available",
        timestamp: new Date().toISOString(),
      }

      console.error("Unhandled promise rejection caught:", errorInfo)
      setDebugInfo((prev) => [...prev, JSON.stringify(errorInfo, null, 2)])

      // Prevent the error from appearing in console
      event.preventDefault()
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    console.log("Demo page loaded - error handler attached")

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Demo Request - Debug Mode</h1>

      {debugInfo.length > 0 && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Promise Rejection Debug Info:</h2>
          {debugInfo.map((info, index) => (
            <pre key={index} className="text-sm text-red-700 whitespace-pre-wrap mb-2">
              {info}
            </pre>
          ))}
        </div>
      )}

      <p className="text-gray-600 mb-4">This is a minimal demo page to test for promise rejection errors.</p>

      <button
        onClick={() => {
          console.log("Test button clicked - no promises involved")
          setDebugInfo([])
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Clear Debug Info
      </button>
    </div>
  )
}
