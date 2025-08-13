import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Solutions() {
  const solutions = [
    {
      title: "SME Credit Management",
      description: "Tailored solutions for small and medium enterprises",
      image: "/sme-credit-dashboard.png",
    },
    {
      title: "Enterprise Receivables",
      description: "Comprehensive receivables management for large organizations",
      image: "/enterprise-receivables-dashboard.png",
    },
    {
      title: "Debt Collection System",
      description: "Advanced debt collection with automated workflows",
      image: "/debt-collection-system-interface.png",
    },
  ]

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solutions for Every Business</h2>
          <p className="text-xl text-gray-600">Choose the right solution for your organization's needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index}>
              <CardHeader>
                <img
                  src={solution.image || "/placeholder.svg"}
                  alt={solution.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{solution.title}</CardTitle>
                <CardDescription>{solution.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
