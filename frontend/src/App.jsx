import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

// Protege rotas — se não tiver token, vai para o login
function RotaProtegida({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}