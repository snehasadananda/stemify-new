import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../config";
import "./ChatBox.css";

export default function ChatBox({ sessionId, token, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    
  }, [messages, aiTyping]);

  // Load session messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId || !token) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/chat/${sessionId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (res.ok) setMessages(json);
        else console.error(json);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
  }, [sessionId, token]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || !token) return;

    const text = input.trim();
    setInput("");

    // 1) Add your own message locally
    const myMsg = {
      id: "local-" + Date.now(),
      sender: `${user.role}:${user.id}`,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, myMsg]);

    // 2) Store user message in chat_messages table
    try {
      await fetch(`${API_BASE_URL}/chat/${sessionId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }), // sender defaults to 'user'
      });
    } catch (err) {
      console.error("Error saving user message:", err);
    }

    // 3) Call DeepSeek-R1 via backend AI endpoint
    setAiTyping(true);
    try {
      const aiRes = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: text,
          systemPrompt:
            "You are STEMIFY, an AI tutor focused on STEM education. Explain concepts clearly and concisely for school students.",
        }),
      });

      const aiJson = await aiRes.json();

      const aiText =
        aiRes.ok && aiJson.answer
          ? aiJson.answer
          : "I'm sorry, I couldn't generate an answer right now.";

      const aiMsg = {
        id: "ai-" + Date.now(),
        sender: "ai",
        content: aiText,
        created_at: new Date().toISOString(),
      };

      // Show AI reply in UI
      setMessages((prev) => [...prev, aiMsg]);

      // 4) Store AI message in chat_messages as sender='ai'
      try {
        await fetch(`${API_BASE_URL}/chat/${sessionId}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: aiText, sender: "ai" }),
        });
      } catch (err) {
        console.error("Error saving AI message:", err);
      }
    } catch (err) {
      console.error("AI request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "ai-error-" + Date.now(),
          sender: "ai",
          content: "There was an error contacting the AI tutor.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setAiTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-ui-container">
      {/* CHAT BUBBLE MAIN PANEL */}
      <div className="chat-bubble-panel">
        {messages.length === 0 && !aiTyping && (
          <div className="empty-chat-text">
            Ask anything to start the conversation!
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender?.endsWith(`:${user.id}`);

          return (
            <div
              key={msg.id}
              className={`msg-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}
            >
              <div className="msg-text">{msg.content}</div>
            </div>
          );
        })}

        {aiTyping && (
          <div className="msg-bubble ai-bubble typing">
            <div className="msg-text">STEMIFY is thinking…</div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT BAR */}
      <div className="chat-input-footer">
        <div className="input-shell">
          <span className="plus-icon">＋</span>

          <input
            type="text"
            placeholder="Ask Anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="send-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
