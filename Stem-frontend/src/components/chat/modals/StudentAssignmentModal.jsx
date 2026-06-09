import { useState } from "react";
import { API_BASE_URL } from "../../../config";

export default function StudentAssignmentModal({ token, assignment, onClose }) {
  if (!assignment) return null;

  const isSubmitted =
    assignment.status === "submitted" || assignment.status === "completed";

  const [answer, setAnswer] = useState(assignment.answer_text || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChangeAnswer = (e) => setAnswer(e.target.value);

  const handlePaste = (e) => e.preventDefault();
  const handleDrop = (e) => e.preventDefault();
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
      e.preventDefault();
    }
  };

  const submit = async (status) => {
    if (!token) return;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("answerText", answer);
      if (file) formData.append("attachment", file);

      const res = await fetch(
  `${API_BASE_URL}/assignments/${assignment.id}/submit`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }
);

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save assignment.");
        setSaving(false);
        return;
      }

      onClose(true); // parent will refresh
    } catch (err) {
      console.error("Submit assignment error:", err);
      setError("Something went wrong.");
      setSaving(false);
    }
  };

  // existing attachment
  let attachmentUrl = null;
  if (assignment.attachment_path) {
    const clean = assignment.attachment_path.replace(/^\.?\/*/, "");
    attachmentUrl = `http://localhost:5000/${clean}`;
  }

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-card large">
        <div className="chat-modal-header">
          <h2>{assignment.title}</h2>
          <button className="chat-modal-close" onClick={() => onClose(false)}>
            ✕
          </button>
        </div>

        <div className="chat-modal-body standard-scroll">
          <div className="form-group">
            <label>Question</label>
            <div className="assignment-question">
              {assignment.question || "No question text provided."}
            </div>
          </div>

          <div className="form-group">
            <label>Your Answer</label>
            <textarea
              className="assignment-answer-textarea standard-scroll"
              rows={7}
              value={answer}
              onChange={handleChangeAnswer}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onKeyDown={handleKeyDown}
              placeholder="Write your answer here."
              disabled={isSubmitted}
            />
            {isSubmitted && (
              <div className="chat-modal-hint">
                You have already submitted this assignment. Answers are
                read-only.
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Attach Files (optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isSubmitted}
            />
            {attachmentUrl && (
              <div className="chat-modal-hint">
                Current file:{" "}
                <a href={attachmentUrl} target="_blank" rel="noreferrer">
                  View / Download
                </a>
              </div>
            )}
          </div>

          {error && <div className="chat-modal-error">{error}</div>}

          <div className="chat-modal-footer">
            <button
              className="chat-modal-secondary-btn"
              onClick={() => submit("saved")}
              disabled={saving || isSubmitted}
            >
              {saving ? "Saving..." : "Save Now"}
            </button>
            <button
              className="chat-modal-primary-btn"
              onClick={() => submit("submitted")}
              disabled={saving || isSubmitted}
            >
              {saving ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
