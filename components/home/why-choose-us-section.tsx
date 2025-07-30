import { Heart, CheckCircle, Clock, Award } from "lucide-react"

export function WhyChooseUsSection() {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-cynthia-orange-pumpkin" />,
      title: "Feito com Amor",
      description: "Cada caldo é preparado com carinho e dedicação",
      delay: "0s",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-cynthia-green-leaf" />,
      title: "Ingredientes Naturais",
      description: "Produtos frescos e selecionados diariamente",
      delay: "0.1s",
    },
    {
      icon: <Clock className="w-8 h-8 text-cynthia-orange-pumpkin" />,
      title: "Entrega Rápida",
      description: "Seu caldo quentinho em até 30 minutos",
      delay: "0.2s",
    },
    {
      icon: <Award className="w-8 h-8 text-cynthia-green-leaf" />,
      title: "Qualidade Premium",
      description: "Receitas tradicionais aperfeiçoadas",
      delay: "0.3s",
    },
  ]

  return (
    <section className="container mx-auto px-4 pb-12">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-xl border border-cynthia-yellow-mustard/30 animate-fade-in-up hover:shadow-2xl transition-shadow duration-500">
        <h2 className="text-3xl font-bold mb-8 text-center text-cynthia-green-dark">Por que escolher nossos caldos?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border border-cynthia-yellow-mustard/20 group cursor-pointer"
              style={{ animationDelay: item.delay }}
            >
              <div
                className="bg-cynthia-yellow-mustard/20 p-4 rounded-full mb-4 animate-float border border-cynthia-yellow-mustard/30 group-hover:bg-cynthia-yellow-mustard/30 transition-colors duration-300"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold mb-2 text-cynthia-green-dark group-hover:text-cynthia-orange-pumpkin transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
