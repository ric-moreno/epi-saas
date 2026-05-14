import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Trash2, Pencil } from "lucide-react"
import { lancamentosApi } from "../api/lancamentos"
import { formatData, formatMoeda, badgeTipo } from "../utils/formatters"
import FormLancamento from "../components/FormLancamento"

export default function Lancamentos() {
  const queryClient = useQueryClient()

  // ── Estado dos filtros ─────────────────────────────────────
  const [filtros, setFiltros] = useState({ tipo: "", codigo: "", nome: "" })
  const [pagina, setPagina]   = useState(1)
  const LIMITE                = 50

  // ── Estado do modal ────────────────────────────────────────
  const [modalAberto, setModalAberto]           = useState(false)
  const [lancamentoEditar, setLancamentoEditar] = useState(null)

  // ── Busca os lançamentos ───────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["lancamentos", pagina, filtros],
    queryFn: () =>
      lancamentosApi
        .listar({ skip: (pagina - 1) * LIMITE, limit: LIMITE, ...filtros })
        .then((r) => r.data),
    keepPreviousData: true,
  })

  // ── Exclusão ───────────────────────────────────────────────
  const excluir = useMutation({
    mutationFn: (id) => lancamentosApi.excluir(id),
    onSuccess: () => queryClient.invalidateQueries(["lancamentos"]),
  })

  // ── Handlers ───────────────────────────────────────────────
  function handleEditar(lanc) {
    setLancamentoEditar(lanc)
    setModalAberto(true)
  }

  function handleNovo() {
    setLancamentoEditar(null)
    setModalAberto(true)
  }

  function handleFecharModal() {
    setModalAberto(false)
    setLancamentoEditar(null)
    queryClient.invalidateQueries(["lancamentos"])
  }

  function confirmarExclusao(id) {
    if (window.confirm("Confirma a exclusão deste lançamento?")) {
      excluir.mutate(id)
    }
  }

  function handleFiltro(campo, valor) {
    setFiltros((f) => ({ ...f, [campo]: valor }))
    setPagina(1)
  }

  const totalPaginas = Math.ceil((data?.total || 0) / LIMITE)

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Título + botão novo */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lançamentos</h1>
        <button
          onClick={handleNovo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Novo Lançamento
        </button>
      </div>

      {/* ── Filtros ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">

        {/* Filtro por código */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Código do item..."
            value={filtros.codigo}
            onChange={(e) => handleFiltro("codigo", e.target.value)}
            className="text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Filtro por funcionário */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Nome do funcionário..."
            value={filtros.nome}
            onChange={(e) => handleFiltro("nome", e.target.value)}
            className="text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Filtro por tipo */}
        <select
          value={filtros.tipo}
          onChange={(e) => handleFiltro("tipo", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          <option value="">Todos os tipos</option>
          <option value="ENTRADA">Entradas</option>
          <option value="SAÍDA">Saídas</option>
        </select>

        {/* Botão limpar filtros */}
        {(filtros.codigo || filtros.nome || filtros.tipo) && (
          <button
            onClick={() => {
              setFiltros({ tipo: "", codigo: "", nome: "" })
              setPagina(1)
            }}
            className="text-sm text-gray-400 hover:text-gray-600 px-2 transition-colors"
          >
            Limpar filtros ✕
          </button>
        )}

      </div>

      {/* ── Tabela ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* Cabeçalho */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  { label: "ID",          cls: "w-12"  },
                  { label: "Data",        cls: "w-28"  },
                  { label: "Tipo",        cls: "w-24"  },
                  { label: "Código",      cls: "w-28"  },
                  { label: "Descrição",   cls: ""      },
                  { label: "Funcionário", cls: "w-40"  },
                  { label: "Qtde",        cls: "w-16 text-right" },
                  { label: "R$ Unit.",    cls: "w-28 text-right" },
                  { label: "R$ Total",    cls: "w-28 text-right" },
                  { label: "Ações",       cls: "w-20"  },
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

            {/* Corpo */}
            <tbody className="divide-y divide-gray-100">

              {/* Carregando */}
              {isLoading && (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </div>
                  </td>
                </tr>
              )}

              {/* Sem dados */}
              {!isLoading && data?.itens?.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <p className="text-gray-400 text-sm">Nenhum lançamento encontrado.</p>
                    <button
                      onClick={handleNovo}
                      className="mt-3 text-blue-500 hover:text-blue-700 text-sm underline"
                    >
                      Criar o primeiro lançamento
                    </button>
                  </td>
                </tr>
              )}

              {/* Linhas */}
              {!isLoading &&
                data?.itens?.map((lanc) => (
                  <tr
                    key={lanc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                      {lanc.id}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {formatData(lanc.data)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={badgeTipo(lanc.tipo_mov)}>
                        {lanc.tipo_mov}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700 text-xs">
                      {lanc.codigo || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-[220px] truncate">
                      {lanc.descricao || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                      {lanc.nome || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {lanc.qtde ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right whitespace-nowrap">
                      {formatMoeda(lanc.rs_unitario)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 text-right whitespace-nowrap">
                      {formatMoeda(lanc.rs_total)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditar(lanc)}
                          title="Editar"
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => confirmarExclusao(lanc.id)}
                          title="Excluir"
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
        </div>

        {/* ── Paginação ── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            {data?.total
              ? `${data.total} registro${data.total !== 1 ? "s" : ""} encontrado${data.total !== 1 ? "s" : ""}`
              : "Nenhum registro"}
          </p>

          {totalPaginas > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500 px-2">
                {pagina} / {totalPaginas}
              </span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina === totalPaginas}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── Modal de formulário ── */}
      {modalAberto && (
        <FormLancamento
          lancamento={lancamentoEditar}
          onFechar={handleFecharModal}
        />
      )}

    </div>
  )
}