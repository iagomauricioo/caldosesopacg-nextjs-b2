import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function PromotionAlert() {
  return (
    <section className="container mx-auto px-4 py-4">
      <Alert className="border-cynthia-yellow-mustard bg-gradient-to-r from-cynthia-yellow-mustard/10 to-cynthia-orange-pumpkin/10 hover:scale-[1.02] transition-transform duration-300">
        <Info className="h-4 w-4 text-cynthia-orange-pumpkin animate-pulse" />
        <AlertDescription className="text-cynthia-green-dark font-medium">
          <strong>🎉 Oferta especial:</strong> Frete grátis para pedidos acima de R$ 30,00!
          <span className="ml-2 text-cynthia-orange-pumpkin font-bold">🚚 Aproveite!</span>
        </AlertDescription>
      </Alert>
    </section>
  )
}
