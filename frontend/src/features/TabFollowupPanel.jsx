import FollowupInput from "../components/FollowupInput";
import { useFollowup } from "../hooks/useFollowup";
import SimpleMarkdown from "../components/SimpleMarkdown";
import { useEffect, useRef } from "react";

export default function TabFollowupPanel({ sessionId, tab, initialHistory = [] }) {
  const { ask, history, loading } = useFollowup(sessionId, tab, initialHistory)

  const bottomRef = useRef(null);

  // auto scroll when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  // console.log(history);
  return (
    <div style={{ marginTop: 30 }}>

      {/* CHAT AREA */}
      <div
        style={{
          maxHeight: 350,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 10,
          border: "1px solid #000000",
          borderRadius: 8,
          background: "#262626"
        }}
      >

        {history.map((item, i) => (
          <div key={i}>

            {/* USER QUESTION */}
            <div
              style={{
                alignSelf: "flex-end",
                background: "#007bff",
                color: "white",
                padding: "10px 14px",
                borderRadius: 12,
                maxWidth: "70%",
                marginBottom: 6
              }}
            >
              {item.question}
            </div>

            {/* AI ANSWER */}
            <div
              style={{
                alignSelf: "flex-start",
                background: "#262626",
                padding: "10px 14px",
                borderRadius: 12,
                maxWidth: "70%"
              }}
            >
              <SimpleMarkdown content={item.answer} />
            </div>

          </div>
        ))}

        <div ref={bottomRef}></div>

      </div>

      {/* INPUT */}
      <div style={{ marginTop: 15 }}>
        <FollowupInput onAsk={ask} loading={loading} />
      </div>

    </div>
  );
}