import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="h-[580px] overflow-hidden border-cynthia-yellow-mustard/30 shadow-lg">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gradient-to-br from-cynthia-yellow-mustard/20 to-cynthia-orange-pumpkin/20">
        <Skeleton className="w-full h-full bg-cynthia-yellow-mustard/30" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-16 h-6 rounded-full bg-cynthia-green-leaf/30" />
        </div>
      </div>

      <CardContent className="p-4 flex flex-col h-[calc(580px-192px)]">
        {/* Title and price */}
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-6 w-3/4 bg-cynthia-green-dark/20" />
          <Skeleton className="h-6 w-16 rounded-full bg-cynthia-orange-pumpkin/30" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="h-4 w-2/3 bg-gray-300" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 bg-cynthia-yellow-mustard/30" />
          ))}
          <Skeleton className="w-12 h-4 ml-2 bg-gray-300" />
        </div>

        {/* Size selector */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-20 bg-cynthia-orange-pumpkin/30" />
          <Skeleton className="h-10 w-full rounded bg-cynthia-yellow-mustard/30" />
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full bg-cynthia-orange-pumpkin/30" />
            <Skeleton className="w-12 h-6 rounded bg-cynthia-green-dark/30" />
            <Skeleton className="w-8 h-8 rounded-full bg-cynthia-orange-pumpkin/30" />
          </div>
        </div>

        {/* Add to cart button */}
        <div className="mt-auto">
          <Skeleton className="h-10 w-full rounded bg-cynthia-green-dark/30" />
        </div>
      </CardContent>
    </Card>
  )
}
