import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, MessageCircle } from "lucide-react"
import Link from "next/link"

interface OrderConfirmationProps {
  orderId: string | null
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="max-w-md mx-auto">
      <Card className="border-cynthia-green-leaf/30 text-center">
        <CardContent className="py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-cynthia-green-leaf/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-cynthia-green-leaf" />
          </div>

          <h2 className="text-2xl font-bold text-cynthia-green-dark mb-4">Pedido Confirmado!</h2>

          <p className="text-muted-foreground mb-2">Seu pedido foi recebido com sucesso.</p>

          {orderId && (
            <p className="text-sm text-cynthia-green-dark font-mono bg-cynthia-cream px-3 py-1 rounded mb-6">
              #{orderId}
            </p>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white">
              <Link href="/pedidos">Acompanhar Pedido</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-cynthia-green-dark text-cynthia-green-dark bg-transparent"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full text-cynthia-orange-pumpkin">
              <Link href="https://wa.me/5582999999999" target="_blank">
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar no WhatsApp
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
