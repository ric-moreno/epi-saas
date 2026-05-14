import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, TrendingUp, TrendingDown, Package } from "lucide-react"
import { estoqueApi } from "../api/estoque"
import { formatMoeda } from "../utils/formatters"

// Badge de situação do saldo
function BadgeSaldo({ saldo }) {
  if (saldo <= 0)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Zerado
      </span>
    )
  if (saldo <= 5)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
        Baixo
      </span>
    )
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      OK
    </span>
  )
}

export default function Estoque() {
  const [busca, setBusca]         = useState("")
  const [categoria, setCategoria] = useState("")

  const { data: itens = [], isLoading } = useQuery({
    queryKey: ["estoque"],
    queryFn: () => estoqueApi.listar().then((r) => r.data),
  })

  // Filtrar localmente (já que são poucos itens)
  const itensFiltrados = itens.filter((item) => {
    const buscaOk =
      !busca ||
      item.codigo?.toLowerCase().includes(busca.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(busca.toLowerCase())

    const categoriaOk = !categoria || item.categoria === categoria

    return buscaOk && categoriaOk
  })

  // Categorias únicas para o filtro
  const categorias = [...new Set(itens.map((i) => i.categoria).filter(Boolean))]

  // Totalizadores
  const totalItens       = itensFiltrados.length
  const totalValorSaldo  = itensFiltrados.reduce((s, i) => s + i.valor_saldo, 0)
  const itensZerados     = itensFiltrados.filter((i) => i.saldo <= 0).length
  const itensBaixos      = itensFiltrados.filter((i) => i.saldo > 0 && i.saldo <= 5).length

  return (
    <div className="space-y-6">

      {/* Título */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-sm text-gray-400">
          Posição atual de todos os itens
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Itens diferentes</p>
              <p className="text-xl font-bold text-gray-900">{totalItens}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Valor em estoque</p>
              <p className="text-xl font-bold text-gray-900">
                {formatMoeda(totalValorSaldo)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Estoque baixo</p>
              <p className="text-xl font-bold text-orange-600">{itensBaixos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Package size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Zerados</p>
              <p className="text-xl font-bold text-red-600">{itensZerados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por código ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>

        {categorias.length > 0 && (
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}

        {(busca || categoria) && (
          <button
            onClick={() => { setBusca(""); setCategoria("") }}
            className="text-sm text-gray-400 hover:text-gray-600 px-2 transition-colors"
          >
            Limpar ✕
          </button>
        )}

      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  { label: "Código",       cls: "w-28"           },
                  { label: "Descrição",    cls: ""               },
                  { label: "Categoria",    cls: "w-32"           },
                  { label: "Qt. Entrada",  cls: "w-28 text-right"},
                  { label: "Qt. Saída",    cls: "w-28 text-right"},
                  { label: "Saldo",        cls: "w-24 text-right"},
                  { label: "Situação",     cls: "w-24"           },
                  { label: "Último Preço", cls: "w-28 text-right"},
                  { label: "Valor Saldo",  cls: "w-32 text-right"},
                ].map(({ label, cls }) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {isLoading && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Calculando estoque...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && itensFiltrados.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <p className="text-gray-400 text-sm">
                      Nenhum item encontrado no estoque.
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      Crie lançamentos do tipo ENTRADA para aparecer aqui.
                    </p>
                  </td>
                </tr>
              )}

              {!isLoading &&
                itensFiltrados.map((item) => (
                  <tr
                    key={item.codigo}
                    className={`hover:bg-gray-50 transition-colors ${
                      item.saldo <= 0 ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-gray-700 text-xs">
                      {item.codigo}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium max-w-[240px] truncate">
                      {item.descricao || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {item.categoria || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-green-700 font-medium">
                      {item.qtde_entrada}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">
                      {item.qtde_saida}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {item.saldo}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeSaldo saldo={item.saldo} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                      {formatMoeda(item.ultimo_preco)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {formatMoeda(item.valor_saldo)}
                    </td>
                  </tr>
                ))}

            </tbody>

            {/* Rodapé com totais */}
            {!isLoading && itensFiltrados.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Total — {totalItens} item{totalItens !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {itensFiltrados.reduce((s, i) => s + i.saldo, 0)}
                  </td>
                  <td />
                  <td />
                  <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                    {formatMoeda(totalValorSaldo)}
                  </td>
                </tr>
              </tfoot>
            )}

          </table>
        </div>
      </div>

    </div>
  )
}