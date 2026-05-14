import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authApi } from "../api/auth"

export default function Login() {
  const [email, setEmail]           = useState("")
  const [senha, setSenha]           = useState("")
  const [erro, setErro]             = useState("")
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    setCarregando(true)

    try {
      const resposta = await authApi.login(email, senha)
      const { access_token, usuario } = resposta.data

      // Salva o token e os dados do usuário no navegador
      localStorage.setItem("token", access_token)
      localStorage.setItem("usuario", JSON.stringify(usuario))

      // Vai para a tela principal
      navigate("/")

    } catch (err) {
      setErro("Email ou senha incorretos.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="mb-8">
          <div className="bg-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🦺</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EPI SaaS</h1>
          <p className="text-gray-500 text-sm mt-1">Controle de Almoxarifado</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@empresa.com"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </div>
    </div>
  )
}