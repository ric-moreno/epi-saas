import { useQuery } from "@tanstack/react-query"
import { TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react"
import api from "../api/axios"
import { formatMoeda, formatData } from "../utils/formatters"

function Card({ titulo, valor, sub, icone: Icone, cor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900">{valor}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${cor}`}>
          <Icone size={20} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data: resumo, isLoading } = useQuery({
    queryKey: ["dashboard-resumo"],
    queryFn: () => api.get("/dashboard/resumo").then((r) => r.data),
    retry: false,
  })

  const { data: vencimentos } = useQuery({
    queryKey: ["vencimentos"],
    queryFn: () => api.get("/dashboard/vencimentos").then((r) => r.data),
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          titulo="Entradas (mês)"
          valor={formatMoeda(resumo?.total_entradas_mes)}
          icone={TrendingUp}
          cor="bg-green-100 text-green-600"
        />
        <Card
          titulo="Saídas (mês)"
          valor={formatMoeda(resumo?.total_saidas_mes)}
          icone={TrendingDown}
          cor="bg-red-100 text-red-600"
        />
        <Card
          titulo="Total de Lançamentos"
          valor={resumo?.total_lancamentos ?? "—"}
          sub="todos os registros"
          icone={Package}
          cor="bg-blue-100 text-blue-600"
        />
        <Card
          titulo="Vencendo em 30 dias"
          valor={resumo?.vencimentos_proximos ?? "—"}
          sub="itens a vencer"
          icone={AlertTriangle}
          cor="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Tabela de vencimentos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          ⚠️ Itens com Vencimento Próximo (30 dias)
        </h2>

        {!vencimentos || vencimentos.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">
            Nenhum item vencendo nos próximos 30 dias.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Código","Descrição","Funcionário","CA","Vencimento"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vencimentos.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono text-gray-600">{item.codigo}</td>
                    <td className="py-3 px-3 text-gray-800">{item.descricao}</td>
                    <td className="py-3 px-3 text-gray-600">{item.nome}</td>
                    <td className="py-3 px-3 text-gray-600">{item.ca || "—"}</td>
                    <td className="py-3 px-3">
                      <span className="text-orange-600 font-semibold">
                        {formatData(item.data_vencimento)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}