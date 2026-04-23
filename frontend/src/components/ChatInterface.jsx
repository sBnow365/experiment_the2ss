import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { API_BASE } from "../config/env";
export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const res = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: input })
    });

    const data = await res.json();

    const aiMessage = {
      role: "assistant",
      content: data.answer
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="chat-container">

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something more about this..."
        />

        <button onClick={sendMessage}>Ask</button>
      </div>

    </div>
  );
}