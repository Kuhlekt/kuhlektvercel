import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Kuhlekt - AR Automation & Digital Collections",
  description:
    "The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline debt recovery, and improve cash flow.",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 bg-white">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Automate AR. Get Paid Faster.</h1>
            <p className="text-xl text-slate-600 mb-8">
              The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline debt
              recovery, and improve cash flow.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/demo" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Schedule a Demo
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
