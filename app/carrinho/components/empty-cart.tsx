import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function EmptyCart() {
  return (
    <div className="max-w-md mx-auto">
      <Card className="text-center">
        <CardContent className="py-12">
          <div className="mb-6">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-cynthia-green-dark mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-8">Que tal experimentar nossos deliciosos caldos artesanais?</p>
          <Button asChild className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Ver Cardápio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
