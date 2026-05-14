import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Lancamentos from "./pages/Lancamentos"

const queryClient = new QueryClient()

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/lancamentos" element={<RotaProtegida><Lancamentos /></RotaProtegida>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}