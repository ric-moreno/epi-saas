import api from "./axios"

export const lancamentosApi = {
  listar:  (filtros = {}) => api.get("/lancamentos/", { params: filtros }),
  buscar:  (id)           => api.get(`/lancamentos/${id}`),
  criar:   (dados)        => api.post("/lancamentos/", dados),
  editar:  (id, dados)    => api.put(`/lancamentos/${id}`, dados),
  excluir: (id)           => api.delete(`/lancamentos/${id}`),
}