import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function EmptyCart() {
  return (
    <div className="text-center py-16">
      <ShoppingCart className="w-24 h-24 mx-auto text-cynthia-green-dark/30 mb-6" />
      <h1 className="text-3xl font-bold text-cynthia-green-dark mb-4">Seu carrinho está vazio</h1>
      <p className="text-cynthia-green-dark/70 mb-8">Adicione alguns caldos deliciosos ao seu carrinho!</p>
      <Link href="/">
        <Button className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80">Ver Cardápio</Button>
      </Link>
    </div>
  )
}
