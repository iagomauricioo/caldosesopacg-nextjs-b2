import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Receipt } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartSummaryProps {
  items: CartItem[]
  total: number
  deliveryFee?: number
}

export function CartSummary({ items, total, deliveryFee = 0 }: CartSummaryProps) {
  const subtotal = total
  const totalWithDelivery = subtotal + deliveryFee

  return (
    <Card className="border-cynthia-yellow-mustard/30 sticky top-4">
      <CardHeader className="bg-cynthia-yellow-mustard/10">
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <Receipt className="w-5 h-5" />
          Resumo do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Subtotal ({items.length} {items.length === 1 ? "item" : "itens"}):
            </span>
            <span className="font-medium">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(subtotal / 100)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Taxa de Entrega:</span>
            <span className={`font-medium ${deliveryFee === 0 ? "text-cynthia-green-leaf" : ""}`}>
              {deliveryFee === 0 ? (
                <Badge variant="secondary" className="bg-cynthia-green-leaf text-white text-xs">
                  Grátis
                </Badge>
              ) : (
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(deliveryFee / 100)
              )}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
          <span>Total:</span>
          <span>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalWithDelivery / 100)}
          </span>
        </div>

        {deliveryFee === 0 && (
          <div className="text-xs text-cynthia-green-leaf text-center bg-cynthia-green-leaf/10 p-2 rounded">
            🎉 Entrega grátis para sua região!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
