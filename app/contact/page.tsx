import { Suspense } from "react"
import ContactFormComponent from "./contact-form-component"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function ContactPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <ContactFormComponent />
    </>
  )
}
