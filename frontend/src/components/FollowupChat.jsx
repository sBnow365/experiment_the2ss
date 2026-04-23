import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { API_BASE } from "../config/env";
export default function FollowupChat({ sessionId, tab }) {

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askFollowup = async () => {

    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question
    };

    setMessages(prev => [...prev, userMessage]);

    const res = await fetch(`${API_BASE}/followup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id: sessionId,
        tab: tab,
        question: question
      })
    });

    const data = await res.json();

    const aiMessage = {
      role: "assistant",
      content: data.answer
    };

    setMessages(prev => [...prev, aiMessage]);

    setQuestion("");
  };

  return (
    <div className="chat-container">

      <div className="chat-messages">

        {messages.map((msg, i) => (

          <div
            key={i}
            className={
              msg.role === "user"
                ? "message user"
                : "message ai"
            }
          >

            <ReactMarkdown>
              {msg.content}
            </ReactMarkdown>

          </div>

        ))}

        <div ref={bottomRef}></div>

      </div>

      <div className="chat-input">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter") askFollowup();
          }}
          placeholder="Ask follow-up question..."
        />

        <button onClick={askFollowup}>
          Ask
        </button>

      </div>

    </div>
  );
}