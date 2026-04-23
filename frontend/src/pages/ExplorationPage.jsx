import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../config/env"
import SimpleMarkdown from "../components/SimpleMarkdown"
import TabFollowupPanel from "../features/TabFollowupPanel"
import TabImages from "../components/TabImages"
import NewsTab from "../components/NewsTab"

export default function ExplorationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exp, setExp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("culture")

  useEffect(() => {
    axios.get(`${API_BASE}/explorations/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setExp(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={center}>Loading exploration...</div>
  if (!exp) return <div style={center}>Exploration not found.</div>

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button onClick={() => navigate("/history")} style={backBtn}>
          ← Back
        </button>
        <p style={{ color: "#aaa", fontSize: 13 }}>
          {new Date(exp.created_at).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
          })}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["culture", "geo", "travel", "news"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              background: activeTab === tab ? "#007bff" : "#2a2a2a",
              color: activeTab === tab ? "#fff" : "#aaa",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ border: "1px solid #333", padding: 20, borderRadius: 8, background: "#1e1e1e" }}>

        {/* NEWS */}
        <div style={{ display: activeTab === "news" ? "block" : "none" }}>
          <NewsTab placeContext={exp.place} />
        </div>

        {/* CULTURE / GEO / TRAVEL */}
        {["culture", "geo", "travel"].map(tab => (
          <div key={tab} style={{ display: activeTab === tab ? "block" : "none" }}>
            <TabImages tab={tab} placeContext={exp.place} tabContent={exp[tab]} />
            <SimpleMarkdown content={exp[tab]} />
            <TabFollowupPanel 
            sessionId={exp.session_id} 
            tab={tab}
            initialHistory={exp.conversation?.filter(c => c.tab === tab) || []}
            />          </div>
        ))}

      </div>
    </div>
  )
}

const center = {
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  fontFamily: "sans-serif"
}

const backBtn = {
  background: "transparent",
  color: "#007bff",
  border: "1px solid #007bff",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: 14
}