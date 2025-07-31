"use client"

import { Suspense } from "react"
import { CartContainer } from "./cart-container"
import { CartSkeleton } from "./cart-skeleton"

export default function CarrinhoClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<CartSkeleton />}>
          <CartContainer />
        </Suspense>
      </div>
    </div>
  )
}
