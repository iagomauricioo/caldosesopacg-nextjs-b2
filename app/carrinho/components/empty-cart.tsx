import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function EmptyCart() {
  return (
    <div className="max-w-md mx-auto">
      <Card className="border-cynthia-green-dark/20 text-center">
        <CardContent className="py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-cynthia-cream rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-cynthia-green-dark/50" />
          </div>

          <h2 className="text-2xl font-bold text-cynthia-green-dark mb-4">Seu carrinho está vazio</h2>

          <p className="text-muted-foreground mb-8">Que tal experimentar nossos deliciosos caldos artesanais?</p>

          <Button asChild className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver Cardápio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
