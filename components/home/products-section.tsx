import { Separator } from "@/components/ui/separator"
import { ProductsFilter } from "@/components/home/products-filter"
import type { Product } from "@/types/product"

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section className="container mx-auto px-4 pb-12" id="cardapio">
      <ProductsFilter products={products} />
      <Separator className="my-12 bg-cynthia-yellow-mustard/30" />
    </section>
  )
}
