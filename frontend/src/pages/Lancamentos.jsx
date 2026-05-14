import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Trash2, Pencil } from "lucide-react"
import { lancamentosApi } from "../api/lancamentos"
import { formatData, formatMoeda, badgeTipo } from "../utils/formatters"
import FormLancamento from "../components/FormLancamento"

export default function Lancamentos() {
  const queryClient = useQueryClient()

  // Estado dos filtros
  const [filtros, setFiltros] = useState({ tipo: "", codigo: "", nome: "" })
  const [pagina, setPagina]   = useState(1)
  const LIMITE                = 50

  // Estado do formulário
  const [modalAberto, setModalAberto]       = useState(false)
  const [lancamentoEditar, setLancamentoEditar] = useState(null)

  // Busca os lançamentos
  const { data, isLoading } = useQuery({
    queryKey: ["lancamentos", pagina, filtros],
    queryFn: () =>
      lancamentosApi
        .listar({ skip: (pagina - 1) * LIMITE, limit: LIMITE, ...filtros })
        .then((r) => r.data),
  })

  // Mutação de exclusão
  const excluir = useMutation({
    mutationFn: (id) => lancamentosApi.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["lancamentos"])
    },
  })

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

  const totalPaginas = Math.ceil((data?.total || 0) / LIMITE)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">🦺 EPI SaaS</h1>
        <span className="text-sm text-gray-500">
          {JSON.parse(localStorage.getItem("usuario") || "{}").nome}
        </span>
      </header>

      <main className="p-8 space-y-6">

        {/* Título + botão novo */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Lançamentos</h2>
          <button
            onClick={handleNovo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Novo Lançamento
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">

          {/* Busca por código */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Código do item..."
              value={filtros.codigo}
              onChange={(e) => {
                setFiltros((f) => ({ ...f, codigo: e.target.value }))
                setPagina(1)
              }}
              className="text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Busca por funcionário */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Nome do funcionário..."
              value={filtros.nome}
              onChange={(e) => {
                setFiltros((f) => ({ ...f, nome: e.target.value }))
                setPagina(1)
              }}
              className="text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filtros.tipo}
            onChange={(e) => {
              setFiltros((f) => ({ ...f, tipo: e.target.value }))
              setPagina(1)
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            <option value="">Todos os tipos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SAÍDA">Saídas</option>
          </select>

        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["ID","Data","Tipo","Código","Descrição","Funcionário","Qtde","R$ Unit.","R$ Total","Ações"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                      Carregando...
                    </td>
                  </tr>
                ) : data?.itens?.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                      Nenhum lançamento encontrado
                    </td>
                  </tr>
                ) : (
                  data?.itens?.map((lanc) => (
                    <tr key={lanc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{lanc.id}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatData(lanc.data)}</td>
                      <td className="px-4 py-3">
                        <span className={badgeTipo(lanc.tipo_mov)}>{lanc.tipo_mov}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-700">{lanc.codigo}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{lanc.descricao}</td>
                      <td className="px-4 py-3 text-gray-700">{lanc.nome}</td>
                      <td className="px-4 py-3 text-gray-700 text-right">{lanc.qtde}</td>
                      <td className="px-4 py-3 text-gray-700 text-right whitespace-nowrap">{formatMoeda(lanc.rs_unitario)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 text-right whitespace-nowrap">{formatMoeda(lanc.rs_total)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditar(lanc)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => confirmarExclusao(lanc.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Página {pagina} de {totalPaginas} — {data?.total} registros
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Próxima →
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Modal de formulário */}
      {modalAberto && (
        <FormLancamento
          lancamento={lancamentoEditar}
          onFechar={handleFecharModal}
        />
      )}

    </div>
  )
}