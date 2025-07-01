"use client"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Review, ReviewStats } from "@/types/review"

interface ReviewContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "createdAt" | "helpful">) => void
  getProductReviews: (productId: number) => Review[]
  getProductStats: (productId: number) => ReviewStats
  markHelpful: (reviewId: string) => void
}

const ReviewContext = createContext<ReviewContextType | null>(null)

// Mock data para demonstração
const mockReviews: Review[] = [
  {
    id: "1",
    productId: 1,
    customerName: "Maria Silva",
    customerEmail: "maria@email.com",
    rating: 5,
    comment:
      "Caldo de frango maravilhoso! Muito saboroso e bem temperado. Chegou quentinho e no tempo certo. Recomendo!",
    createdAt: "2024-01-15T10:30:00Z",
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    productId: 1,
    customerName: "João Santos",
    customerEmail: "joao@email.com",
    rating: 4,
    comment: "Muito bom! Só achei que poderia ter mais pedaços de frango, mas o sabor está excelente.",
    createdAt: "2024-01-10T15:45:00Z",
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    productId: 2,
    customerName: "Ana Costa",
    customerEmail: "ana@email.com",
    rating: 5,
    comment: "O Caldo de Kenga é incrível! A combinação de frango, calabresa e bacon é perfeita. Virou meu favorito!",
    createdAt: "2024-01-12T18:20:00Z",
    verified: true,
    helpful: 15,
  },
  {
    id: "4",
    productId: 3,
    customerName: "Carlos Oliveira",
    customerEmail: "carlos@email.com",
    rating: 5,
    comment: "Caldo de camarão cremoso e delicioso! Ingredientes frescos e muito bem preparado. Parabéns!",
    createdAt: "2024-01-08T12:15:00Z",
    verified: true,
    helpful: 6,
  },
  {
    id: "5",
    productId: 1,
    customerName: "Lucia Ferreira",
    customerEmail: "lucia@email.com",
    rating: 3,
    comment: "Bom caldo, mas achei um pouco salgado para meu gosto. Entrega foi rápida.",
    createdAt: "2024-01-05T14:30:00Z",
    verified: false,
    helpful: 3,
  },
]

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)

  const addReview = useCallback((newReview: Omit<Review, "id" | "createdAt" | "helpful">) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      helpful: 0,
    }
    setReviews((prev) => [review, ...prev])
  }, [])

  const getProductReviews = useCallback(
    (productId: number) => {
      return reviews.filter((review) => review.productId === productId)
    },
    [reviews],
  )

  const getProductStats = useCallback(
    (productId: number): ReviewStats => {
      const productReviews = getProductReviews(productId)
      const totalReviews = productReviews.length

      if (totalReviews === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        }
      }

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      let totalRating = 0

      productReviews.forEach((review) => {
        totalRating += review.rating
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++
      })

      return {
        averageRating: totalRating / totalReviews,
        totalReviews,
        ratingDistribution,
      }
    },
    [getProductReviews],
  )

  const markHelpful = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)),
    )
  }, [])

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getProductStats, markHelpful }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider")
  }
  return context
}
