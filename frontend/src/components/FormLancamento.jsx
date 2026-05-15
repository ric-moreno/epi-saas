import { useState } from "react"
import { lancamentosApi } from "../api/lancamentos"
import { X } from "lucide-react"

const CAMPOS_INICIAIS = {
  data: new Date().toISOString().split("T")[0],
  tipo_mov: "ENTRADA",
  matr_cnpj: "",
  nome: "",
  justificativa: "",
  categoria: "",
  codigo: "",
  descricao: "",
  qtde: "",
  rs_unitario: "",
  ca: "",
  nr_serie: "",
  nota_fiscal: "",
  data_vencimento: "",
  observacao: "",
}

// ──────────────────────────────────────────────────────────────
// Campo declarado FORA do FormLancamento — evita perda de foco
// ──────────────────────────────────────────────────────────────
function Campo({ label, name, type = "text", obrigatorio = false, opcoes, value, onChange }) {
  if (opcoes) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {label}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={obrigatorio}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {opcoes.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={obrigatorio}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Formulário principal
// ──────────────────────────────────────────────────────────────
export default function FormLancamento({ lancamento, onFechar }) {
  const editando = !!lancamento

  const [form, setForm] = useState(
    editando
      ? {
          ...CAMPOS_INICIAIS,
          ...lancamento,
          data: lancamento.data?.split("T")[0] || "",
          data_vencimento: lancamento.data_vencimento?.split("T")[0] || "",
        }
      : CAMPOS_INICIAIS
  )

  const [salvando, setSalvando] = useState(false)
  const [erro, setErro]         = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    setSalvando(true)

    try {
      if (editando) {
        await lancamentosApi.editar(lancamento.id, form)
      } else {
        await lancamentosApi.criar(form)
      }
      onFechar()
    } catch (err) {
      setErro(err.response?.data?.detail || "Erro ao salvar. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  // Calcula R$ Total em tempo real
  const rsTotal =
    form.qtde && form.rs_unitario
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
          .format(parseFloat(form.qtde) * parseFloat(form.rs_unitario))
      : "R$ 0,00"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {editando ? "Editar Lançamento" : "Novo Lançamento"}
          </h2>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Linha 1 — Data e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Data"
              name="data"
              type="date"
              obrigatorio
              value={form.data}
              onChange={handleChange}
            />
            <Campo
              label="Tipo"
              name="tipo_mov"
              value={form.tipo_mov}
              onChange={handleChange}
              opcoes={[
                { value: "ENTRADA", label: "ENTRADA" },
                { value: "SAÍDA",   label: "SAÍDA"   },
              ]}
            />
          </div>

          {/* Linha 2 — Matrícula e Nome */}
          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Matrícula / CNPJ"
              name="matr_cnpj"
              value={form.matr_cnpj}
              onChange={handleChange}
            />
            <Campo
              label="Nome do Funcionário"
              name="nome"
              obrigatorio
              value={form.nome}
              onChange={handleChange}
            />
          </div>

          {/* Linha 3 — Código e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Código do Item"
              name="codigo"
              obrigatorio
              value={form.codigo}
              onChange={handleChange}
            />
            <Campo
              label="Categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            />
          </div>

          {/* Descrição */}
          <Campo
            label="Descrição do Item"
            name="descricao"
            obrigatorio
            value={form.descricao}
            onChange={handleChange}
          />

          {/* Linha 4 — Justificativa e Nota Fiscal */}
          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Justificativa"
              name="justificativa"
              value={form.justificativa}
              onChange={handleChange}
            />
            <Campo
              label="Nota Fiscal"
              name="nota_fiscal"
              value={form.nota_fiscal}
              onChange={handleChange}
            />
          </div>

          {/* Linha 5 — Qtde, Valor e Total */}
          <div className="grid grid-cols-3 gap-4">
            <Campo
              label="Quantidade"
              name="qtde"
              type="number"
              obrigatorio
              value={form.qtde}
              onChange={handleChange}
            />
            <Campo
              label="R$ Unitário"
              name="rs_unitario"
              type="number"
              obrigatorio
              value={form.rs_unitario}
              onChange={handleChange}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                R$ Total
              </label>
              <input
                type="text"
                readOnly
                value={rsTotal}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Linha 6 — CA, Série e Vencimento */}
          <div className="grid grid-cols-3 gap-4">
            <Campo
              label="CA (Certificado)"
              name="ca"
              value={form.ca}
              onChange={handleChange}
            />
            <Campo
              label="Nº de Série"
              name="nr_serie"
              value={form.nr_serie}
              onChange={handleChange}
            />
            <Campo
              label="Data de Vencimento"
              name="data_vencimento"
              type="date"
              value={form.data_vencimento}
              onChange={handleChange}
            />
          </div>

          {/* Observação */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Observação
            </label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {erro}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Lançamento"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}