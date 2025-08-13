import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Solutions } from "@/components/solutions"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Solutions />
      <Testimonials />
      <CTA />
    </>
  )
}
