import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="h-[400px] overflow-hidden border-cynthia-yellow-mustard/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
      <div className="relative h-48 bg-gradient-to-br from-cynthia-yellow-mustard/20 to-cynthia-orange-pumpkin/20">
        <Skeleton className="w-full h-full bg-cynthia-yellow-mustard/30" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-16 h-6 rounded-full bg-cynthia-green-leaf/30" />
        </div>
      </div>

      <CardContent className="p-4 flex flex-col h-52">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2 bg-cynthia-green-dark/20" />
          <Skeleton className="h-4 w-full mb-1 bg-gray-300" />
          <Skeleton className="h-4 w-2/3 mb-3 bg-gray-300" />

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4 bg-cynthia-yellow-mustard/30" />
            ))}
            <Skeleton className="w-12 h-4 ml-2 bg-gray-300" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-cynthia-orange-pumpkin/30" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded bg-cynthia-yellow-mustard/30" />
              <Skeleton className="h-8 w-16 rounded bg-cynthia-yellow-mustard/30" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cynthia-yellow-mustard/30">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20 bg-cynthia-green-dark/30" />
            <Skeleton className="h-10 w-24 rounded bg-cynthia-orange-pumpkin/30" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
