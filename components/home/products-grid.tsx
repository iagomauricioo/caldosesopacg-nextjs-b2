import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/product"

interface ProductsGridProps {
  products: Product[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-cynthia-green-dark mb-2">Nenhum produto encontrado</h3>
        <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in-up hover:scale-[1.02] transition-transform duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
