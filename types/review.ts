export interface Review {
  id: string
  productId: number
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  createdAt: string
  verified: boolean
  helpful: number
  images?: string[]
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}
