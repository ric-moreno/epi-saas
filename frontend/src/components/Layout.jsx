import { Outlet, NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const MENU = [
  { caminho: "/",             icone: LayoutDashboard, label: "Dashboard"   },
  { caminho: "/lancamentos",  icone: ClipboardList,   label: "Lançamentos" },
  { caminho: "/estoque",      icone: Package,         label: "Estoque"     },
]

export default function Layout() {
  const navigate  = useNavigate()
  const usuario   = JSON.parse(localStorage.getItem("usuario") || "{}")
  const [menuAberto, setMenuAberto] = useState(false)

  function sair() {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ── MENU LATERAL ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-200
        ${menuAberto ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦺</span>
            <div>
              <p className="font-bold text-white text-sm leading-tight">EPI SaaS</p>
              <p className="text-xs text-gray-400">Almoxarifado</p>
            </div>
          </div>
          {/* Fechar menu no mobile */}
          <button
            onClick={() => setMenuAberto(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {MENU.map(({ caminho, icone: Icone, label }) => (
            <NavLink
              key={caminho}
              to={caminho}
              end={caminho === "/"}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icone size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuário + Sair */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {usuario.nome?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{usuario.nome}</p>
              <p className="text-xs text-gray-400 capitalize">{usuario.perfil}</p>
            </div>
          </div>
          <button
            onClick={sair}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors w-full"
          >
            <LogOut size={16} />
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* Fundo escuro no mobile quando menu aberto */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* ── ÁREA PRINCIPAL ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header superior */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          {/* Botão hamburguer — só aparece no mobile */}
          <button
            onClick={() => setMenuAberto(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <span className="text-sm text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </header>

        {/* Conteúdo da página atual */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}