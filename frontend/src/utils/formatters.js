// Formata número para moeda brasileira: 1500.5 → "R$ 1.500,50"
export function formatMoeda(valor) {
  if (valor == null) return "R$ 0,00"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

// Formata data ISO para brasileiro: "2024-05-13" → "13/05/2024"
export function formatData(dataStr) {
  if (!dataStr) return "—"
  const [ano, mes, dia] = dataStr.split("T")[0].split("-")
  return `${dia}/${mes}/${ano}`
}

// Formata data para enviar ao backend: "13/05/2024" → "2024-05-13"
export function dataParaISO(dataStr) {
  if (!dataStr) return null
  const [dia, mes, ano] = dataStr.split("/")
  return `${ano}-${mes}-${dia}`
}

// Retorna classe de cor conforme tipo de movimento
export function corTipoMov(tipo) {
  return tipo === "ENTRADA"
    ? "text-green-600 bg-green-50"
    : "text-red-600 bg-red-50"
}

// Formata quantidade: 5.000 → "5" | 2.500 → "2,5"
export function formatQtde(valor) {
  if (valor == null) return "0"
  return new Intl.NumberFormat("pt-BR").format(valor)
}