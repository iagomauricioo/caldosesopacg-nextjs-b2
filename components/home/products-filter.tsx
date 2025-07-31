"use client"

import { useState } from "react"
import { ProductsGrid } from "@/components/home/products-grid"
import { SearchAndFilters } from "@/components/search-and-filters"
import type { Product } from "@/types/product"

interface ProductsFilterProps {
  products: Product[]
}

export function ProductsFilter({ products }: ProductsFilterProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  return (
    <>
      <SearchAndFilters products={products} onFilteredProducts={setFilteredProducts} />
      <ProductsGrid products={filteredProducts} />
    </>
  )
}
