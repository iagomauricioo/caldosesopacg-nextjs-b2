"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavbar } from "@/components/mobile-navbar"
import { ReviewForm } from "@/components/review-form"
import { ReviewStats } from "@/components/review-stats"
import { ReviewList } from "@/components/review-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, Award } from "lucide-react"

// Mock products para seleção
const products = [
  { id: 1, name: "Caldo de Frango" },
  { id: 2, name: "Caldo de Kenga" },
  { id: 3, name: "Caldo de Camarão" },
  { id: 4, name: "Caldo de Charque" },
  { id: 5, name: "Sopa de Feijão com Carne" },
  { id: 6, name: "Canja de Galinha" },
]

export default function AvaliarPage() {
  const [selectedProductId, setSelectedProductId] = useState<number>(1)
  const selectedProduct = products.find((p) => p.id === selectedProductId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Avaliações dos Clientes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sua opinião é muito importante para nós! Compartilhe sua experiência e ajude outros clientes a escolherem os
            melhores caldos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold">4.8</h3>
              <p className="text-gray-600">Avaliação Média</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold">247</h3>
              <p className="text-gray-600">Avaliações Totais</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold">96%</h3>
              <p className="text-gray-600">Recomendações</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Selection */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Selecione um Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedProductId.toString()}
                onValueChange={(value) => setSelectedProductId(Number.parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha um produto para avaliar" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Ver Avaliações</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="add">Adicionar Avaliação</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações - {selectedProduct?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewList productId={selectedProductId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas - {selectedProduct?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewStats productId={selectedProductId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <ReviewForm productId={selectedProductId} productName={selectedProduct?.name || ""} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <MobileNavbar />
    </div>
  )
}
