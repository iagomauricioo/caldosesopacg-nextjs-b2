import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SoupBubbles } from "@/components/animations/soup-bubbles"
import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-96 bg-gradient-to-br from-cynthia-green-dark via-cynthia-green-dark/90 to-cynthia-green-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />

      {/* Padrão decorativo animado */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-cynthia-yellow-mustard via-cynthia-orange-pumpkin to-cynthia-yellow-mustard">
        <div className="flex items-center justify-center h-full space-x-8 animate-slide-in-left">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="text-cynthia-green-dark text-2xl animate-float hover:scale-125 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              🍲
            </div>
          ))}
        </div>
      </div>

      <SoupBubbles className="absolute inset-0" />

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl animate-slide-in-left">
          <Badge className="mb-4 bg-cynthia-yellow-mustard text-cynthia-green-dark hover:scale-105 transition-transform duration-300">
            <Zap className="w-3 h-3 mr-1" />✨ Artesanal & Natural
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-white">
            Sabor que aquece
            <span className="block text-cynthia-yellow-mustard animate-pulse">sua alma</span>
          </h1>
          <p className="text-xl opacity-90 mb-8 text-cynthia-cream">
            Caldos artesanais feitos com amor e ingredientes frescos, entregues quentinhos na sua casa
          </p>
          <Button
            size="lg"
            className="bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white px-8 py-4 text-lg animate-pulse-soft hover:scale-105 transition-all duration-300 font-semibold shadow-xl"
          >
            Experimente Agora! 🍲
          </Button>
        </div>
      </div>
    </section>
  )
}
