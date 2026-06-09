import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../../../config";

export default function StudentDetailModal({ token, student, onClose }) {
  const [view, setView] = useState("chats");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    assignments: [],
    chats: [],
    messages: [],
  });

  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    if (!student || !token) return;
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await fetch(
  `${API_BASE_URL}/students/${student.id}/overview`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
        const json = await res.json();
        if (res.ok) {
          setOverview(json);
        } else {
          console.error("Overview error:", json);
        }
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [student, token]);

  const chatMessagesById = useMemo(() => {
    const map = {};
    for (const msg of overview.messages || []) {
      if (!map[msg.session_id]) map[msg.session_id] = [];
      map[msg.session_id].push(msg);
    }
    return map;
  }, [overview.messages]);

  if (!student) return null;

  const getAttachmentUrl = (path) => {
    if (!path) return null;
    const clean = path.replace(/^\.?\/*/, "");
    return `http://localhost:5000/${clean}`;
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-card">
        <div className="chat-modal-header">
          <h2>{student.name || student.email_phone}</h2>
          <button className="chat-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="chat-modal-tabs">
          <button
            className={view === "chats" ? "active" : ""}
            onClick={() => setView("chats")}
          >
            Show Chats
          </button>
          <button
            className={view === "assignments" ? "active" : ""}
            onClick={() => setView("assignments")}
          >
            Show Assignments
          </button>
        </div>

        <div className="chat-modal-body standard-scroll">
          {loading && <div>Loading…</div>}

          {!loading && view === "chats" && (
            <div className="chat-modal-list">
              {overview.chats.length === 0 && (
                <div className="chat-modal-empty">No chats yet.</div>
              )}
              {overview.chats.map((c) => (
                <div
                  key={c.id}
                  className="chat-modal-item clickable"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedChat(c)}
                >
                  <div className="title">
                    {c.messages || c.title || `Chat ${c.id}`}
                  </div>
                  <div className="meta">
                    Updated:{" "}
                    {c.updated_at
                      ? new Date(c.updated_at).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && view === "assignments" && (
            <div className="chat-modal-list">
              {overview.assignments.length === 0 && (
                <div className="chat-modal-empty">No assignments yet.</div>
              )}
              {overview.assignments.map((a) => (
                <div
                  key={a.id}
                  className="chat-modal-item clickable"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedAssignment(a)}
                >
                  <div className="title">{a.title}</div>
                  <div className="meta">
                    Status: {a.status} | Due:{" "}
                    {a.due_date
                      ? new Date(a.due_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHAT TRANSCRIPT MODAL */}
      {selectedChat && (
        <div className="chat-modal-overlay">
          <div className="chat-modal-card large">
            <div className="chat-modal-header">
              <h2>
                Chat #{selectedChat.id} –{" "}
                {student.name || student.email_phone}
              </h2>
              <button
                className="chat-modal-close"
                onClick={() => setSelectedChat(null)}
              >
                ✕
              </button>
            </div>

            <div className="chat-modal-body chat-transcript-body standard-scroll">
              {!(chatMessagesById[selectedChat.id] || []).length && (
                <div className="chat-modal-empty">
                  No messages in this chat yet.
                </div>
              )}

              {(chatMessagesById[selectedChat.id] || []).map((m) => {
                const isStudent = (m.sender || "").startsWith("student");
                return (
                  <div
                    key={m.id}
                    className={
                      "chat-transcript-row " +
                      (isStudent ? "from-student" : "from-others")
                    }
                  >
                    <div className="chat-transcript-bubble">
                      <div className="chat-transcript-meta">
                        {m.sender} •{" "}
                        {m.created_at
                          ? new Date(m.created_at).toLocaleString()
                          : ""}
                      </div>
                      <div className="chat-transcript-text">{m.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENT PREVIEW MODAL */}
      {selectedAssignment && (
        <div className="chat-modal-overlay">
          <div className="chat-modal-card large">
            <div className="chat-modal-header">
              <h2>{selectedAssignment.title}</h2>
              <button
                className="chat-modal-close"
                onClick={() => setSelectedAssignment(null)}
              >
                ✕
              </button>
            </div>

            <div className="chat-modal-body standard-scroll">
              <div className="form-group">
                <label>Question</label>
                <div className="assignment-question">
                  {selectedAssignment.question ||
                    "No question text provided."}
                </div>
              </div>

              <div className="form-group">
                <label>Student Answer</label>
                <div className="assignment-question">
                  {selectedAssignment.answer_text
                    ? selectedAssignment.answer_text
                    : "No answer has been submitted yet."}
                </div>
              </div>

              <div className="form-group">
                <label>Attachment</label>
                {getAttachmentUrl(selectedAssignment.attachment_path) ? (
                  <a
                    href={getAttachmentUrl(
                      selectedAssignment.attachment_path
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View / Download file
                  </a>
                ) : (
                  <div className="assignment-question">
                    No file uploaded.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
