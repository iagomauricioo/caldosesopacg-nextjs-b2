import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-cynthia-green-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Caldos da Cynthia</h3>
            <p className="text-white/80 mb-4">
              Caldos artesanais feitos com amor e ingredientes frescos. Aquecendo corações há mais de 10 anos.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/cardapio"
                  className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
                >
                  Cardápio
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-white/80 hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-110 transform"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cynthia-yellow-mustard" />
                <span className="text-white/80">(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cynthia-yellow-mustard" />
                <span className="text-white/80">contato@caldosdacynthia.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cynthia-yellow-mustard mt-1" />
                <span className="text-white/80">
                  Rua dos Caldos, 123
                  <br />
                  Centro, São Paulo - SP
                </span>
              </li>
            </ul>
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Funcionamento</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cynthia-yellow-mustard" />
                <span className="text-white/80">Segunda a Sexta</span>
              </div>
              <p className="text-white/60 ml-6">11:00 - 22:00</p>

              <div className="flex items-center gap-2 mt-3">
                <Clock className="w-4 h-4 text-cynthia-yellow-mustard" />
                <span className="text-white/80">Sábado e Domingo</span>
              </div>
              <p className="text-white/60 ml-6">12:00 - 23:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 animate-fade-in-up">
            © 2024 Cynthia Gonçalves - Caldos e Sopa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
