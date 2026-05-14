import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate  = useNavigate()
  const usuario   = JSON.parse(localStorage.getItem("usuario") || "{}")

  function sair() {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦺</span>
          <h1 className="text-lg font-bold text-gray-900">EPI SaaS</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Olá, <strong>{usuario.nome}</strong>
          </span>
          <button
            onClick={sair}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Entradas</p>
            <p className="text-3xl font-bold text-green-600">R$ 0,00</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Saídas</p>
            <p className="text-3xl font-bold text-red-600">R$ 0,00</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Itens em Estoque</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>

        {/* Mensagem de boas vindas */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-1">
            Sistema funcionando! ✅
          </h3>
          <p className="text-blue-700 text-sm">
            Backend conectado, login autenticado com JWT, banco de dados ativo.
            Próximo passo: criar a tela de lançamentos.
          </p>
        </div>
      </main>

    </div>
  )
}