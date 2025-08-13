import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      title: "Automated Workflows",
      description: "Streamline your collection process with intelligent automation",
      icon: "⚡",
    },
    {
      title: "Real-time Analytics",
      description: "Track performance and optimize your collection strategies",
      icon: "📊",
    },
    {
      title: "Compliance Management",
      description: "Stay compliant with all relevant regulations and laws",
      icon: "✅",
    },
    {
      title: "Multi-channel Communication",
      description: "Reach customers through email, SMS, and phone calls",
      icon: "📱",
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Businesses</h2>
          <p className="text-xl text-gray-600">Everything you need to manage credit and collections effectively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
