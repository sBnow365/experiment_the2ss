import { useState } from "react";
import axios from "axios";
import { API_BASE } from "./config/env";
import LocationButton from "./components/LocationButton";
import SimpleMarkdown from "./components/SimpleMarkdown";
import TabFollowupPanel from "./features/TabFollowupPanel";
import TabImages from "./components/TabImages";
import NewsTab from "./components/NewsTab";
import { useNavigate } from "react-router-dom";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("culture");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }
    setLoading(true);
    setData(null);
    const formData = new FormData();
    formData.append("file", file);
    if (location) {
      formData.append("lat", location.lat);
      formData.append("lon", location.lon);
    }
    try {
      const res = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setData(res.data);
      if (res.data.session_id) setSessionId(res.data.session_id);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      {/* Navbar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#1e1e1e",
        borderBottom: "1px solid #333",
        marginBottom: 20
      }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          🌍 AI Travel Explorer
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: "#aaa", fontSize: 14 }}>
            {localStorage.getItem("email")}
          </span>
          <button onClick={() => navigate("/history")} style={navBtn}>
            My Explorations
          </button>
          <button onClick={handleLogout} style={{ ...navBtn, background: "#ff4444" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>

        <h1>🌍 AI Travel Explorer</h1>

        {/* Upload Section */}
        <div style={{ marginBottom: 20, border: "1px solid #ddd", padding: 15, borderRadius: 8 }}>
          <input type="file" onChange={handleFileChange} />
          <LocationButton setLocation={setLocation} />
          <button onClick={handleUpload} disabled={loading} style={{ marginLeft: 10 }}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* Image Preview */}
        {preview && (
          <img src={preview} width="300" alt="preview"
            style={{ borderRadius: 8, marginBottom: 20 }} />
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["culture", "geo", "travel", "news"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 20px",
              background: activeTab === tab ? "#007bff" : "#eee",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none", borderRadius: 4, cursor: "pointer"
            }}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {data && (
          <div style={{ border: "1px solid #000000", padding: 20, borderRadius: 8, background: "#262626" }}>
            <div style={{ display: activeTab === "news" ? "block" : "none" }}>
              <NewsTab placeContext={data.place} />
            </div>
            {["culture", "geo", "travel"].map((tab) => (
              <div key={tab} style={{ display: activeTab === tab ? "block" : "none" }}>
                <TabImages tab={tab} placeContext={data.place} tabContent={data[tab]} />
                <SimpleMarkdown content={data[tab]} />
                {sessionId && <TabFollowupPanel sessionId={sessionId} tab={tab} />}
              </div>
            ))}
          </div>
        )}

        {location && (
          <p style={{ fontSize: 12, color: "#666" }}>
            📍 Search Origin: {location.lat}, {location.lon}
          </p>
        )}

      </div>
    </div>
  );
}

const navBtn = {
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: 13
};

export default App;