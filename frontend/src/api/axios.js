import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
})

// Coloca o token JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se o token expirar, volta para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("usuario")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api