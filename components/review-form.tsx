"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/contexts/review-context"
import { useToast } from "@/contexts/toast-context"

interface ReviewFormProps {
  productId: number
  productName: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const { addReview } = useReviews()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    rating: 0,
    comment: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      showToast("Por favor, selecione uma avaliação", "error")
      return
    }

    if (!formData.customerName.trim() || !formData.comment.trim()) {
      showToast("Por favor, preencha todos os campos obrigatórios", "error")
      return
    }

    setIsSubmitting(true)

    try {
      // Simula delay de envio
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addReview({
        productId,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        verified: false, // Em um sistema real, isso seria determinado pelo backend
      })

      showToast("Avaliação enviada com sucesso!", "success")

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        rating: 0,
        comment: "",
      })

      onSuccess?.()
    } catch (error) {
      showToast("Erro ao enviar avaliação. Tente novamente.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar {productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Nome *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Seu nome"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">E-mail</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <Label>Sua avaliação *</Label>
            <div className="mt-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData({ ...formData, rating })}
                size="lg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Comentário *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Conte-nos sobre sua experiência com este produto..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-green-800 hover:bg-green-900">
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
