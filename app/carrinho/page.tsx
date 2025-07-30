import type { Metadata } from "next"
import { CarrinhoClientPage } from "./components/carrinho-client-page"

export const metadata: Metadata = {
  title: "Carrinho - Caldos da Cynthia",
  description: "Finalize seu pedido de caldos artesanais",
}

export default function CarrinhoPage() {
  return <CarrinhoClientPage />
}
