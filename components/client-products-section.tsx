"use client"

import { ProductsSection } from "@/components/home/products-section"
import type { Product } from "@/types/product"

interface ClientProductsSectionProps {
  products: Product[]
}

export function ClientProductsSection({ products }: ClientProductsSectionProps) {
  return <ProductsSection products={products} />
} 