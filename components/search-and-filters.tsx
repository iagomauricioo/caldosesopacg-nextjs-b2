"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Product } from "@/types/product"

interface SearchAndFiltersProps {
  products: Product[]
  onFilteredProducts: (products: Product[]) => void
}

export function SearchAndFilters({ products, onFilteredProducts }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)

  // Calcular faixa de preços dos produtos
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 50 }

    const prices = products.flatMap((product) => product.variacoes.map((v) => v.preco_centavos / 100))

    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Filtro de busca
      const matchesSearch =
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de categoria
      const matchesCategory =
        selectedCategory === "todos" ||
        (selectedCategory === "caldos" && product.nome.toLowerCase().includes("caldo")) ||
        (selectedCategory === "cremes" && product.nome.toLowerCase().includes("creme")) ||
        (selectedCategory === "sopas" && product.nome.toLowerCase().includes("sopa"))

      // Filtro de preço
      const productMinPrice = Math.min(...product.variacoes.map((v) => v.preco_centavos / 100))
      const productMaxPrice = Math.max(...product.variacoes.map((v) => v.preco_centavos / 100))
      const matchesPrice = productMinPrice <= priceRange[1] && productMaxPrice >= priceRange[0]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Ordenação
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case "price-low":
        filtered.sort((a, b) => {
          const aPrice = Math.min(...a.variacoes.map((v) => v.preco_centavos))
          const bPrice = Math.min(...b.variacoes.map((v) => v.preco_centavos))
          return aPrice - bPrice
        })
        break
      case "price-high":
        filtered.sort((a, b) => {
          const aPrice = Math.max(...a.variacoes.map((v) => v.preco_centavos))
          const bPrice = Math.max(...b.variacoes.map((v) => v.preco_centavos))
          return bPrice - aPrice
        })
        break
      default:
        // popularity - manter ordem original
        break
    }

    return filtered
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  // Atualizar produtos filtrados
  useEffect(() => {
    onFilteredProducts(filteredProducts)
  }, [filteredProducts, onFilteredProducts])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("todos")
    setPriceRange([minPrice, maxPrice])
    setSortBy("popularity")
  }

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "todos" ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    sortBy !== "popularity"

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar caldos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="text-sm font-medium text-cynthia-green-dark mb-2 block">Categoria</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="caldos">Caldos</SelectItem>
            <SelectItem value="cremes">Cremes</SelectItem>
            <SelectItem value="sopas">Sopas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Busca Principal (sempre visível) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar caldos deliciosos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark"
        />
      </div>

      {/* Filtros Rápidos + Botão de Filtros Avançados */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Filtros rápidos de categoria */}
          {[
            { key: "todos", label: "Todos", icon: "🍽️" },
            { key: "caldos", label: "Caldos", icon: "🍲" },
            { key: "sopas", label: "Sopa", icon: "🍜" },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedCategory === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(filter.key)}
              className={`
                transition-all duration-300 hover:scale-105
                ${
                  selectedCategory === filter.key
                    ? "bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white"
                    : "border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                }
              `}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado
          {filteredProducts.length !== 1 ? "s" : ""}
        </span>
        {searchTerm && (
          <span>
            Buscando por: <strong>"{searchTerm}"</strong>
          </span>
        )}
      </div>
    </div>
  )
}
