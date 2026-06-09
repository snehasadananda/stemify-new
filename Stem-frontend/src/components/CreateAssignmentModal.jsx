// src/components/chat/modals/CreateAssignmentModal.jsx
import { useState } from "react";
import "./CreateAssignmentModal.css";

export default function CreateAssignmentModal({
  token,
  students,
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    if (!token) return;

    setSaving(true);
    setError("");

    // Frontend validation (includes dueDate)
    if (!title.trim() || !description.trim() || !dueDate || selectedIds.length === 0) {
      setError("Missing title, question, due date, or studentIds.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/assignments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          question: description, // backend stores this into description column
          dueDate,               // IMPORTANT: matches server.mjs (dueDate)
          studentIds: selectedIds,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to create assignment.");
        setSaving(false);
        return;
      }

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Create assignment error:", err);
      setError("Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-card large create-assignment-modal">
        {/* Header */}
        <div className="chat-modal-header">
          <h2>Create Assignment</h2>
          <button className="chat-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="chat-modal-body standard-scroll">
          {/* Title */}
          <div className="form-group">
            <label>Assignment Question (Title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Eg: Explain Newton’s First Law"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Details / Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed instructions for the assignment..."
            />
          </div>

          {/* Due date */}
          <div className="form-group">
            <label>Timeline to complete (Due date)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Students */}
          <div className="form-group">
            <label>Select Students</label>
            <div className="assign-student-list standard-scroll">
              {(!students || students.length === 0) && (
                <div className="chat-modal-empty">
                  No students mapped to you yet.
                </div>
              )}

              {students?.map((s) => (
                <label key={s.id} className="assign-student-row clickable">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                  />
                  <span>{s.name || s.email_phone}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <div className="chat-modal-error">{error}</div>}

          {/* Footer */}
          <div className="chat-modal-footer">
            <button
              className="chat-modal-primary-btn"
              onClick={submit}
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
