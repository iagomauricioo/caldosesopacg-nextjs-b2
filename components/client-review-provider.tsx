"use client"

import { ReviewProvider } from "@/contexts/review-context"

interface ClientReviewProviderProps {
  children: React.ReactNode
}

export function ClientReviewProvider({ children }: ClientReviewProviderProps) {
  return <ReviewProvider>{children}</ReviewProvider>
}
