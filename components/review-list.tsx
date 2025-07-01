"use client"

import { useState } from "react"
import { ThumbsUp, Shield, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/contexts/review-context"
import type { Review } from "@/types/review"

interface ReviewListProps {
  productId: number
  limit?: number
}

export function ReviewList({ productId, limit }: ReviewListProps) {
  const { getProductReviews, markHelpful } = useReviews()
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating" | "helpful">("newest")
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const reviews = getProductReviews(productId)

  const sortedAndFilteredReviews = reviews
    .filter((review) => (filterRating ? review.rating === filterRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "rating":
          return b.rating - a.rating
        case "helpful":
          return b.helpful - a.helpful
        default:
          return 0
      }
    })
    .slice(0, limit)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
        <p className="text-sm text-gray-400 mt-2">Seja o primeiro a avaliar!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Ordenação */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant={sortBy === "newest" ? "default" : "outline"} size="sm" onClick={() => setSortBy("newest")}>
            Mais recentes
          </Button>
          <Button variant={sortBy === "helpful" ? "default" : "outline"} size="sm" onClick={() => setSortBy("helpful")}>
            Mais úteis
          </Button>
          <Button variant={sortBy === "rating" ? "default" : "outline"} size="sm" onClick={() => setSortBy("rating")}>
            Maior nota
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            Todas
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
            >
              {rating}★
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {sortedAndFilteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} onMarkHelpful={markHelpful} />
        ))}
      </div>

      {limit && reviews.length > limit && (
        <div className="text-center">
          <Button variant="outline">Ver todas as avaliações ({reviews.length})</Button>
        </div>
      )}
    </div>
  )
}

interface ReviewCardProps {
  review: Review
  onMarkHelpful: (reviewId: string) => void
}

function ReviewCard({ review, onMarkHelpful }: ReviewCardProps) {
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false)

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful) {
      onMarkHelpful(review.id)
      setHasMarkedHelpful(true)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-semibold">{review.customerName.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{review.customerName}</h4>
                {review.verified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Compra verificada</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkHelpful}
            disabled={hasMarkedHelpful}
            className="text-gray-500 hover:text-gray-700"
          >
            <ThumbsUp className={`w-4 h-4 mr-2 ${hasMarkedHelpful ? "fill-current" : ""}`} />
            Útil ({review.helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
