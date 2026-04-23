import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../config/env"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register"
      const res = await axios.post(`${API_BASE}${endpoint}`, { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("email", res.data.email)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
    fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "#1e1e1e",
        padding: 40,
        borderRadius: 12,
        width: 360,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ color: "white", marginBottom: 24, textAlign: "center" }}>
          🌍 {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={inputStyle}
        />

        {error && <p style={{ color: "#ff4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 16
          }}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p style={{ color: "#aaa", textAlign: "center", fontSize: 14 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #444",
  background: "#2a2a2a",
  color: "white",
  fontSize: 15,
  boxSizing: "border-box"
}