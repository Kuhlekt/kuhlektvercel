import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function DemoLoading() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column Skeleton */}
            <div className="space-y-8">
              <div>
                <Skeleton className="h-12 w-96 mb-6" />
                <Skeleton className="h-6 w-80" />
              </div>

              {/* Benefits List Skeleton */}
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="w-6 h-6 rounded-full flex-shrink-0 mt-1" />
                    <Skeleton className="h-5 w-80" />
                  </div>
                ))}
              </div>

              {/* Steps Skeleton */}
              <div className="flex items-center gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <Skeleton className="h-5 w-64" />
              </div>
            </div>

            {/* Right Column - Form Skeleton */}
            <Card className="p-8 rounded-lg border border-gray-200 shadow-sm">
              <CardContent className="p-0 space-y-6">
                {/* Logo Skeleton */}
                <div className="text-center">
                  <Skeleton className="h-10 w-32 mx-auto mb-6" />
                </div>

                <div className="mb-8">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-80" />
                </div>

                {/* Form Fields Skeleton */}
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Company */}
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Role */}
                  <div>
                    <Skeleton className="h-4 w-8 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Challenges */}
                  <div>
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-24 w-full" />
                  </div>

                  {/* Submit Button */}
                  <Skeleton className="h-12 w-full" />
                </div>

                <Skeleton className="h-3 w-64 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
