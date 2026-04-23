import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../config/env"

export default function HistoryPage() {
  const [explorations, setExplorations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_BASE}/explorations/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setExplorations(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={center}>Loading your explorations...</div>

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1 style={{ color: "white" }}>🗺️ My Explorations</h1>
        <button
          onClick={() => navigate("/")}
          style={btnStyle}
        >
          + New Exploration
        </button>
      </div>

      {explorations.length === 0 ? (
        <p style={{ color: "#aaa" }}>No explorations yet. Go analyze a place!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {explorations.map(exp => (
            <div
              key={exp.id}
              onClick={() => navigate(`/exploration/${exp.id}`)}
              style={cardStyle}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "white", fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
                    📍 {extractPlace(exp.place)}
                  </p>
                  <p style={{ color: "#aaa", fontSize: 13 }}>
                    {new Date(exp.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                  {exp.conversation?.length > 0 && (
                    <p style={{ color: "#007bff", fontSize: 12, marginTop: 4 }}>
                      💬 {exp.conversation.length} followup{exp.conversation.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <span style={{ color: "#007bff", fontSize: 20 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function extractPlace(placeContext) {
  if (!placeContext) return "Unknown Place"
  if (typeof placeContext === "object") {
    return placeContext.name && placeContext.city 
      ? `${placeContext.name}, ${placeContext.city}` 
      : placeContext.name || "Unknown Place"
  }
  const lines = placeContext.split("\n").filter(Boolean)
  return lines[0]?.replace(/^#+\s*/, "").slice(0, 60) || "Unknown Place"
}
const cardStyle = {
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 10,
  padding: "16px 20px",
  cursor: "pointer",
  transition: "border-color 0.2s",
}

const btnStyle = {
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: 15
}

const center = {
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh"
}