import { Suspense } from "react"
import DemoFormComponent from "./demo-form-component"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function DemoPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <DemoFormComponent />
    </>
  )
}
