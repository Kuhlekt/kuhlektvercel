import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { VisitorTracker } from "@/components/visitor-tracker"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuhlekt - AR Automation Platform",
  description:
    "The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline debt recovery, and improve cash flow.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Fix Monaco Editor worker issue
              if (typeof window !== 'undefined') {
                window.MonacoEnvironment = {
                  getWorkerUrl: function (moduleId, label) {
                    if (label === 'json') {
                      return './json.worker.js';
                    }
                    if (label === 'css' || label === 'scss' || label === 'less') {
                      return './css.worker.js';
                    }
                    if (label === 'html' || label === 'handlebars' || label === 'razor') {
                      return './html.worker.js';
                    }
                    if (label === 'typescript' || label === 'javascript') {
                      return './ts.worker.js';
                    }
                    return './editor.worker.js';
                  }
                };
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <VisitorTracker />
        {children}
      </body>
    </html>
  )
}
