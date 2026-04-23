import './index.css'
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import LoginPage from "./pages/LoginPage"
import HistoryPage from "./pages/HistoryPage"
import ExplorationPage from "./pages/ExplorationPage"
import ProtectedRoute from "./components/ProtectedRoute"
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/exploration/:id" element={<ProtectedRoute><ExplorationPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
