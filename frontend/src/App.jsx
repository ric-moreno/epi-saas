import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Tela de login simples para testar
function Login() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EPI SaaS</h1>
        <p className="text-gray-500 mb-6">Controle de Almoxarifado</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
          />
          <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg">
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}