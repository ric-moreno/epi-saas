import api from './axios'

export const lancamentosApi = {
  listar: (params) => api.get('/lancamentos', { params }),
  buscar: (id)     => api.get(`/lancamentos/${id}`),
  criar:  (dados)  => api.post('/lancamentos', dados),
  editar: (id, dados) => api.put(`/lancamentos/${id}`, dados),
  excluir:(id)     => api.delete(`/lancamentos/${id}`),
}

export const dashboardApi = {
  top10Saidas: () => api.get('/dashboard/top10-saidas'),
  saldoGeral:  () => api.get('/dashboard/saldo-geral'),
  vencimentos: () => api.get('/dashboard/vencimentos'),
}