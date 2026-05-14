import api from "./axios"

export const authApi = {
  login: (email, senha) =>
    api.post("/auth/login", { email, senha }),
}