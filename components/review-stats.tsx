"use client"

import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/contexts/review-context"

interface ReviewStatsProps {
  productId: number
}

export function ReviewStats({ productId }: ReviewStatsProps) {
  const { getProductStats } = useReviews()
  const stats = getProductStats(productId)

  if (stats.totalReviews === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Nenhuma avaliação ainda</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
          <StarRating rating={Math.round(stats.averageRating)} readonly />
          <p className="text-sm text-gray-500 mt-1">{stats.totalReviews} avaliações</p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
