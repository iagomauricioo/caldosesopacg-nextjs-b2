"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const scrollToProducts = () => {
    document.querySelector("#cardapio")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <section className="container mx-auto px-4 pb-20">
      <div className="text-center animate-fade-in-up">
        <div className="bg-gradient-to-r from-cynthia-yellow-mustard to-cynthia-orange-pumpkin rounded-2xl p-8 text-cynthia-green-dark shadow-xl border border-cynthia-orange-pumpkin/30 hover:scale-[1.02] transition-transform duration-300">
          <Badge className="mb-4 bg-cynthia-orange-pumpkin text-white hover:scale-105 transition-transform duration-300">
            🔥 Oferta Limitada
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Pronto para se aquecer?</h2>
          <p className="text-xl mb-6 opacity-90">
            Experimente nossos caldos artesanais agora mesmo e sinta o carinho em cada colherada!
          </p>
          <Button
            size="lg"
            onClick={scrollToProducts}
            className="bg-cynthia-green-dark text-white hover:bg-cynthia-green-dark/80 px-8 py-4 text-lg font-semibold hover:scale-110 transition-all duration-300 animate-pulse-soft shadow-xl"
          >
            Peça agora mesmo! 🔥
          </Button>
        </div>
      </div>
    </section>
  )
}
