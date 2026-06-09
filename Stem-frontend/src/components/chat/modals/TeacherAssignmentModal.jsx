import { useState } from "react";
import { API_BASE_URL } from "../../../config";
import "./TeacherAssignmentModal.css";

function TeacherAssignmentModal({ onClose, students, onCreated, token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    setError("");

    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (selectedStudents.length === 0) {
      setError("Select at least one student.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/assignments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          studentIds: selectedStudents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create assignment");
        setLoading(false);
        return;
      }

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Create assignment error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-modal-overlay">
      <div className="assign-modal">
        <h2 className="assign-title">Create New Assignment</h2>

        <label className="assign-label">Assignment Title</label>
        <input
          className="assign-input"
          type="text"
          placeholder="Enter assignment title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="assign-label">Details / Description</label>
        <textarea
          className="assign-textarea"
          placeholder="Enter assignment details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="assign-label">Timeline to Complete</label>
        <input
          className="assign-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <label className="assign-label">Assign to Students</label>
        <div className="assign-students-box">
          {students.map((s) => (
            <div
              key={s.id}
              className={`assign-student-item ${
                selectedStudents.includes(s.id) ? "selected" : ""
              }`}
              onClick={() => toggleStudent(s.id)}
            >
              <span>{s.name}</span>
            </div>
          ))}
        </div>

        {error && <p className="assign-error">{error}</p>}

        <div className="assign-actions">
          <button className="assign-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="assign-create"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignmentModal;
