import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-16 w-full mb-6" />
              <Skeleton className="h-6 w-96 mb-8" />
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-48" />
              </div>
              
              <div className="flex items-center gap-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
            
            <div className="relative">
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-12 w-16 mx-auto mb-2" />
                <Skeleton className="h-5 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-20 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-8 text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Features Skeleton */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex gap-4">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-80 mx-auto mb-6" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-10 w-96 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-80 mx-auto mb-8 bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 bg-white/20" />
            <Skeleton className="h-12 w-32 bg-white/20" />
          </div>
        </div>
      </section>
    </div>
  )
}
