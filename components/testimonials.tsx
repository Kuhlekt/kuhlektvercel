import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      quote: "Kuhlekt transformed our collection process. We've seen a 40% improvement in recovery rates.",
      author: "Sarah Johnson",
      company: "TechCorp Solutions",
    },
    {
      quote: "The automation features saved us countless hours and improved our cash flow significantly.",
      author: "Michael Chen",
      company: "Global Manufacturing Inc.",
    },
    {
      quote: "Outstanding customer support and a platform that actually delivers on its promises.",
      author: "Emma Rodriguez",
      company: "Financial Services Ltd.",
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Trusted by businesses worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <CardDescription className="text-lg italic">"{testimonial.quote}"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.company}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
