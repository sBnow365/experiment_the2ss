import { useState } from "react";

export default function FollowupInput({ onAsk, loading }) {

  const [question, setQuestion] = useState("");

  const submit = () => {
    const q = question.trim();
    if (!q || loading) return;

    onAsk(q);
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();   // prevents form reload
      submit();
    }
  };

  return (
    <div style={{ marginTop: 20 }}>

      <input
        placeholder="Ask something more about this..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: "75%",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{
          marginLeft: 10,
          padding: "10px 16px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "..." : "Ask"}
      </button>

    </div>
  );
}