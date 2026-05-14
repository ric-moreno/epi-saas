// R$ 1500.5 → "R$ 1.500,50"
export function formatMoeda(valor) {
  if (valor == null) return "R$ 0,00"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

// "2024-05-13" → "13/05/2024"
export function formatData(dataStr) {
  if (!dataStr) return "—"
  const [ano, mes, dia] = dataStr.split("T")[0].split("-")
  return `${dia}/${mes}/${ano}`
}

// "ENTRADA" → badge verde | "SAÍDA" → badge vermelho
export function badgeTipo(tipo) {
  const base = "px-2 py-0.5 rounded-full text-xs font-semibold"
  return tipo === "ENTRADA"
    ? `${base} bg-green-100 text-green-700`
    : `${base} bg-red-100 text-red-700`
}