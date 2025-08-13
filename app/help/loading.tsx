import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-80 mx-auto mb-8 bg-white/20" />
          
          {/* Search Bar Skeleton */}
          <div className="relative max-w-2xl mx-auto">
            <Skeleton className="h-16 w-full bg-white/20 rounded-lg" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid Skeleton */}
        <section className="mb-16">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </CardHeader>
                <CardContent className="text-center">
                  <Skeleton className="h-6 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Articles Skeleton */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-6">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-80 mb-3" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                    <Skeleton className="w-5 h-5 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support Skeleton */}
        <section className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto mb-6" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </section>
      </div>
    </div>
  )
}
