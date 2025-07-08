"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, User, Eye, EyeOff, ChefHat } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginResponse {
  success: boolean
  statusCode: number
  message: string
  data?: {
    token: string
    user: {
      id: string
      email: string
      nome: string
      role: string
    }
  }
  timestamp: string
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log("🔐 Tentando fazer login...")

    try {
      const response = await fetch("https://api.caldosesopacg.com/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      })

      console.log("📡 Status da resposta:", response.status)

      const data: LoginResponse = await response.json()
      console.log("📦 Resposta da API:", data)

      if (response.ok && data.success && data.data) {
        // Salvar token no localStorage
        localStorage.setItem("auth_token", data.data.token)
        localStorage.setItem("user_data", JSON.stringify(data.data.user))

        console.log("✅ Login realizado com sucesso!")

        toast({
          title: "Login Realizado!",
          description: `Bem-vindo(a), ${data.data.user.nome}!`,
        })

        // Redirecionar para a página de pedidos
        router.push("/pedidos")
      } else {
        throw new Error(data.message || "Credenciais inválidas")
      }
    } catch (err) {
      console.error("❌ Erro no login:", err)
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login"
      setError(errorMessage)
      toast({
        title: "Erro no Login",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email.trim() && password.length >= 6

  return (
    <div className="min-h-screen bg-cynthia-cream/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-cynthia-green-dark rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-cynthia-green-dark">Caldos da Cynthia</h1>
          <p className="text-cynthia-green-dark/70">Painel Administrativo</p>
        </div>

        {/* Formulário de Login */}
        <Card className="border-cynthia-green-dark/20 shadow-lg">
          <CardHeader className="bg-cynthia-yellow-mustard/20">
            <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
              <Lock className="w-5 h-5" />
              Fazer Login
            </CardTitle>
            <CardDescription className="text-cynthia-green-dark/70">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cynthia-green-dark">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-10 border-cynthia-green-dark/30 focus:border-cynthia-green-dark"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cynthia-green-dark">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="pl-10 pr-10 border-cynthia-green-dark/30 focus:border-cynthia-green-dark"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 hover:text-cynthia-green-dark"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <Alert className="border-red-400 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            {/* Informações de Teste */}
            <div className="mt-6 p-4 bg-cynthia-cream/50 rounded-lg border border-cynthia-yellow-mustard/30">
              <h4 className="font-semibold text-cynthia-green-dark mb-2">Credenciais de Teste:</h4>
              <div className="text-sm text-cynthia-green-dark/70 space-y-1">
                <p>
                  <strong>Email:</strong> admin@caldosesopacg.com
                </p>
                <p>
                  <strong>Senha:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-cynthia-green-dark/70">
          <p>© 2025 Caldos da Cynthia - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}
