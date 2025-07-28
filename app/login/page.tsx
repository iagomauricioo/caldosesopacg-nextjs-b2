"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
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
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validações básicas
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido.")
      setLoading(false)
      return
    }

    try {
      console.log("🔐 Tentando fazer login...")

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
      console.log("📋 Resposta do servidor:", data)

      if (data.success && data.data) {
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
        throw new Error(data.message || "Erro ao fazer login")
      }
    } catch (error) {
      console.error("❌ Erro no login:", error)
      setError(error instanceof Error ? error.message : "Erro interno do servidor")

      toast({
        title: "Erro no Login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fillTestCredentials = () => {
    setEmail("admin@caldosesopacg.com")
    setPassword("admin123")
    toast({
      title: "Credenciais Preenchidas",
      description: "Credenciais de teste foram inseridas automaticamente.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-cynthia-cream/50 to-cynthia-yellow-mustard/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-cynthia-green-dark rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-cynthia-green-dark mb-2">Caldos da Cynthia</h1>
          <p className="text-cynthia-green-dark/70">Painel Administrativo</p>
        </div>

        {/* Card de Login */}
        <Card className="border-cynthia-green-dark/20 shadow-xl">
          <CardHeader className="bg-cynthia-green-dark text-white rounded-t-lg">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Fazer Login
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-white p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cynthia-green-dark font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-cynthia-green-dark/30 focus:border-cynthia-green-dark"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cynthia-green-dark font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-cynthia-green-dark/30 focus:border-cynthia-green-dark"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 hover:text-cynthia-green-dark"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </div>
                )}
              </Button>
            </form>

            {/* Credenciais de Teste */}
            <div className="mt-6 pt-4 border-t border-cynthia-green-dark/20">
              <div className="bg-cynthia-yellow-mustard/10 p-4 rounded-lg border border-cynthia-yellow-mustard/30">
                <h4 className="font-semibold text-cynthia-green-dark mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Credenciais de Teste
                </h4>
                <div className="text-sm text-cynthia-green-dark/80 space-y-1 mb-3">
                  <p>
                    <strong>Email:</strong> admin@caldosesopacg.com
                  </p>
                  <p>
                    <strong>Senha:</strong> admin123
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillTestCredentials}
                  className="border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white bg-transparent"
                  disabled={loading}
                >
                  Preencher Automaticamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="text-center mt-6 text-sm text-cynthia-green-dark/70">
          <p>Sistema de Gerenciamento de Pedidos</p>
          <p className="mt-1">© 2024 Caldos da Cynthia - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}

// deploy
