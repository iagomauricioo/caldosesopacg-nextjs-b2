"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-cynthia-cream">
      {/* Header Skeleton */}
      <div className="bg-cynthia-green-dark h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full bg-cynthia-yellow-mustard/30" />
          <div className="hidden sm:block">
            <Skeleton className="h-5 w-32 bg-white/20 mb-1" />
            <Skeleton className="h-3 w-20 bg-white/20" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20 bg-white/20" />
          <Skeleton className="h-8 w-8 rounded bg-white/20" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="h-96 bg-gradient-to-br from-cynthia-green-dark to-cynthia-green-dark/80 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Skeleton className="h-6 w-32 bg-cynthia-yellow-mustard/30 mb-4" />
            <Skeleton className="h-12 w-96 bg-white/20 mb-4" />
            <Skeleton className="h-12 w-80 bg-white/20 mb-6" />
            <Skeleton className="h-6 w-64 bg-white/20 mb-8" />
            <Skeleton className="h-12 w-40 bg-cynthia-orange-pumpkin/30" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Skeleton */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-12 w-full bg-white" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 bg-white" />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="h-[580px] overflow-hidden border-cynthia-yellow-mustard/30 shadow-lg">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gradient-to-br from-cynthia-yellow-mustard/20 to-cynthia-orange-pumpkin/20">
        <Skeleton className="w-full h-full bg-cynthia-yellow-mustard/30" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-16 h-6 rounded-full bg-cynthia-green-leaf/30" />
        </div>
        <div className="absolute top-2 left-2">
          <Skeleton className="w-8 h-8 rounded-full bg-white/50" />
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

export function CartLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 bg-cynthia-green-dark/20 mb-4" />
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full bg-cynthia-green-dark/20" />
                  <Skeleton className="h-4 w-16 bg-cynthia-green-dark/20" />
                </div>
              ))}
            </div>
            <Skeleton className="h-2 w-full bg-cynthia-green-dark/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do Pedido Skeleton */}
          <div className="lg:col-span-1">
            <Card className="border-cynthia-yellow-mustard/30">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-cynthia-green-dark/20" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-cynthia-cream/30 rounded-lg">
                    <Skeleton className="w-16 h-16 rounded-lg bg-white" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 bg-cynthia-green-dark/20 mb-2" />
                      <Skeleton className="h-3 w-16 bg-gray-300 mb-2" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 bg-cynthia-yellow-mustard/30" />
                        <Skeleton className="h-6 w-8 bg-cynthia-yellow-mustard/30" />
                        <Skeleton className="h-6 w-6 bg-cynthia-yellow-mustard/30" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16 bg-cynthia-green-dark/20" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Formulários Skeleton */}
          <div className="lg:col-span-2">
            <Card className="border-cynthia-yellow-mustard/30">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-cynthia-green-dark/20" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full bg-gray-200" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full bg-gray-200" />
                  <Skeleton className="h-10 w-full bg-gray-200" />
                </div>
                <Skeleton className="h-32 w-full bg-gray-200" />
                <Skeleton className="h-10 w-full bg-cynthia-green-dark/20" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InlineLoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-2 border-cynthia-green-dark border-t-transparent rounded-full animate-spin`}
      />
    </div>
  )
}
