import ContactForm from "@/components/contact-form"
import DemoForm from "@/components/demo-form"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Started Today</h1>
          <p className="text-xl text-gray-600">
            Contact us or request a demo to see how we can help your business grow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />
          <DemoForm />
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Valid Affiliate Numbers</h3>
          <p className="text-blue-700 text-sm mb-2">For testing purposes, use one of these affiliate numbers:</p>
          <div className="flex flex-wrap gap-2">
            {["AFF001", "AFF002", "AFF003", "AFF010", "AFF015", "AFF100"].map((affiliate) => (
              <span key={affiliate} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {affiliate}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
