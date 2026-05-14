import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Layout from "./components/Layout"
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

          {/* Todas as rotas protegidas ficam dentro do Layout */}
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Layout />
              </RotaProtegida>
            }
          >
            <Route index             element={<Dashboard />}   />
            <Route path="lancamentos" element={<Lancamentos />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}