import api from "./axios"

export const estoqueApi = {
  listar: () => api.get("/estoque/"),
}