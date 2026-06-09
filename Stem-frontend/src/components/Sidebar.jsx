import { useMemo, useState } from "react";
import "./Sidebar.css";

export default function Sidebar({
  data,
  token, // currently unused here but available if needed
  currentChatId,
  onSelectChat,
  onNewChat,
  onCloseMobile,
  onStudentClick,
  onCreateAssignment,
  onAssignmentClick,
}) {
  const { user, assignments = [], chats = [], students = [], children = [] } =
    data || {};

  const role = user?.role || "student";

  const [studentSearch, setStudentSearch] = useState("");
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [chatSearch, setChatSearch] = useState("");

  const filteredStudents = useMemo(() => {
    if (role !== "teacher") return students;
    if (!studentSearch.trim()) return students;
    const term = studentSearch.toLowerCase();
    return students.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.email_phone && s.email_phone.toLowerCase().includes(term))
    );
  }, [students, studentSearch, role]);

  const filteredAssignments = useMemo(() => {
    if (role !== "student") return assignments;
    if (!assignmentSearch.trim()) return assignments;
    const term = assignmentSearch.toLowerCase();
    return assignments.filter((a) =>
      (a.title || "").toLowerCase().includes(term)
    );
  }, [assignments, assignmentSearch, role]);

  const filteredChats = useMemo(() => {
    if (!chatSearch.trim()) return chats;
    const term = chatSearch.toLowerCase();
    return chats.filter(
      (c) =>
        (c.title && c.title.toLowerCase().includes(term)) ||
        (c.messages && c.messages.toLowerCase().includes(term))
    );
  }, [chats, chatSearch]);

  return (
    <aside className="chat-sidebar">
      <button className="chat-sidebar-close" onClick={onCloseMobile}>
        ✕
      </button>

      <div className="chat-sidebar-role">
        {role === "teacher"
          ? "Teacher"
          : role === "parent"
          ? "Parent"
          : "Student"}
      </div>

      {/* STUDENT VIEW */}
      {role === "student" && (
        <>
          <div className="chat-sidebar-role-block">
            <div className="chat-sidebar-section-label">Assignments</div>

            <input
              className="chat-sidebar-student-search"
              placeholder="Search assignments..."
              value={assignmentSearch}
              onChange={(e) => setAssignmentSearch(e.target.value)}
            />

            <div className="chat-sidebar-role-list limited-height">
              {filteredAssignments.length === 0 && (
                <div className="chat-sidebar-role-empty">
                  No assignments found.
                </div>
              )}
              {filteredAssignments.map((a) => (
                <div
                  key={a.id}
                  className="chat-sidebar-role-item clickable"
                  onClick={() => onAssignmentClick(a)}
                >
                  <div className="title">{a.title}</div>
                  <div className="status">
                    Status: {a.status} | Due:{" "}
                    {a.due_date
                      ? new Date(a.due_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="chat-sidebar-new-chat" onClick={onNewChat}>
            <span className="icon">＋</span>
            <span>New chat</span>
          </button>

          <div className="chat-sidebar-search-row">
            <span className="search-icon">🔍</span>
            <input
              className="chat-sidebar-search-input"
              placeholder="Search chats"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>

          <div className="chat-sidebar-section-label chats-label">Chats</div>
          <div className="chat-sidebar-chat-list">
            {filteredChats.length === 0 && (
              <div className="chat-sidebar-role-empty">
                No chats yet. Start one!
              </div>
            )}
            {filteredChats.map((c) => (
              <div
                key={c.id}
                className={
                  "chat-sidebar-chat-item" +
                  (c.id === currentChatId ? " active" : "")
                }
                onClick={() => onSelectChat(c.id)}
              >
                {c.messages || c.title || `Chat ${c.id}`}
              </div>
            ))}
          </div>
        </>
      )}

      {/* TEACHER VIEW */}
      {role === "teacher" && (
        <>
          <div className="chat-sidebar-role-block">
            <div className="chat-sidebar-section-label">Search Students</div>
            <input
              className="chat-sidebar-student-search"
              placeholder="Type to search..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />

            <div className="chat-sidebar-section-label">Mapped Students</div>
            <div className="chat-sidebar-role-list">
              {filteredStudents.length === 0 && (
                <div className="chat-sidebar-role-empty">
                  No students match your search.
                </div>
              )}
              {filteredStudents.map((s) => (
                <div
                  key={s.id}
                  className="chat-sidebar-role-item clickable"
                  onClick={() => onStudentClick(s)}
                >
                  {s.name || s.email_phone}
                </div>
              ))}
            </div>
          </div>

          <button
            className="chat-sidebar-create-assignment"
            onClick={onCreateAssignment}
          >
            + Create Assignment
          </button>

          <button className="chat-sidebar-new-chat" onClick={onNewChat}>
            <span className="icon">＋</span>
            <span>New chat</span>
          </button>

          <div className="chat-sidebar-search-row">
            <span className="search-icon">🔍</span>
            <input
              className="chat-sidebar-search-input"
              placeholder="Search chats"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>

          <div className="chat-sidebar-section-label chats-label">Chats</div>
          <div className="chat-sidebar-chat-list">
            {filteredChats.length === 0 && (
              <div className="chat-sidebar-role-empty">No chats yet.</div>
            )}
            {filteredChats.map((c) => (
              <div
                key={c.id}
                className={
                  "chat-sidebar-chat-item" +
                  (c.id === currentChatId ? " active" : "")
                }
                onClick={() => onSelectChat(c.id)}
              >
                {c.messages || c.title || `Chat ${c.id}`}
              </div>
            ))}
          </div>
        </>
      )}

      {/* PARENT VIEW */}
      {role === "parent" && (
        <>
          <div className="chat-sidebar-role-block">
            <div className="chat-sidebar-section-label">Your Children</div>
            <div className="chat-sidebar-role-list">
              {children.length === 0 && (
                <div className="chat-sidebar-role-empty">
                  No children mapped.
                </div>
              )}
              {children.map((c) => (
                <div
                  key={c.id}
                  className="chat-sidebar-role-item clickable"
                  onClick={() => onStudentClick(c)}
                >
                  {c.name || c.email_phone}
                  <div className="status">
                    {c.assignments?.length || 0} assignments
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="chat-sidebar-new-chat" onClick={onNewChat}>
            <span className="icon">＋</span>
            <span>New chat</span>
          </button>

          <div className="chat-sidebar-search-row">
            <span className="search-icon">🔍</span>
            <input
              className="chat-sidebar-search-input"
              placeholder="Search chats"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>

          <div className="chat-sidebar-section-label chats-label">Chats</div>
          <div className="chat-sidebar-chat-list">
            {filteredChats.length === 0 && (
              <div className="chat-sidebar-role-empty">No chats yet.</div>
            )}
            {filteredChats.map((c) => (
              <div
                key={c.id}
                className={
                  "chat-sidebar-chat-item" +
                  (c.id === currentChatId ? " active" : "")
                }
                onClick={() => onSelectChat(c.id)}
              >
                {c.messages || c.title || `Chat ${c.id}`}
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
