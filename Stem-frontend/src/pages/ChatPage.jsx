import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatBox from "../components/ChatBox";
import Footer from "../components/Footer";

import LoginOverlay from "../components/chat/modals/LoginOverlay";
import StudentDetailModal from "../components/chat/modals/StudentDetailModal";
import TeacherAssignmentModal from "../components/chat/modals/TeacherAssignmentModal";
import StudentAssignmentModal from "../components/chat/modals/StudentAssignmentModal";

import { API_BASE_URL } from "../config";
import "./ChatPage.css";

export default function ChatPage() {
  const rawToken = localStorage.getItem("stemify_token");
  const rawUser = localStorage.getItem("stemify_user");

  const token =
    rawToken && rawToken !== "undefined" && rawToken !== "null"
      ? rawToken
      : null;

  let parsedUser = null;
  try {
    parsedUser =
      rawUser && rawUser !== "undefined" && rawUser !== "null"
        ? JSON.parse(rawUser)
        : null;
  } catch (e) {
    parsedUser = null;
  }

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

const [data, setData] = useState(
  parsedUser ? { user: parsedUser, chats: [] } : { chats: [] }
);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  const [studentModal, setStudentModal] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);

  const year = new Date().getFullYear();
  const isLoggedIn = !!token;

  // Load /api/users/me
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (res.ok) {
          setData(json);
          if (json.user) {
            localStorage.setItem("stemify_user", JSON.stringify(json.user));
          }
        } else {
          if (parsedUser) setData({ user: parsedUser });
          else setData(null);
        }
      } catch (err) {
        console.error("users/me fetch error:", err);
        if (parsedUser) setData({ user: parsedUser });
        else setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auto-select first chat
  useEffect(() => {
    if (!data?.chats) return;
    if (!currentChatId && data.chats.length > 0) {
      setCurrentChatId(data.chats[0].id);
    }
  }, [data, currentChatId]);

  const handleNewChat = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/chat/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("New chat error:", json);
        return;
      }

      setData((prev) => ({
        ...(prev || {}),
        chats: [json, ...(prev?.chats || [])],
      }));

      setCurrentChatId(json.id);
    } catch (err) {
      console.error("New chat error:", err);
    }
  };

  if (loading && token) {
    return <div className="chat-loading">Loading chat interface…</div>;
  }

  return (
    <div className={`chat-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {isLoggedIn && (
        <Sidebar
          data={data}
          token={token}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={handleNewChat}
          onCloseMobile={() => setSidebarOpen(false)}
          onStudentClick={(student) => setStudentModal(student)}
          onCreateAssignment={() => setShowAssignModal(true)}
          onAssignmentClick={(assignment) => setActiveAssignment(assignment)}
        />
      )}

      <div className="chat-main">
        <Topbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          showMenuButton={isLoggedIn}
        />

        <div className="chat-main-body">
          {isLoggedIn && data?.user ? (
             currentChatId ? (
        <ChatBox sessionId={currentChatId} token={token} user={data.user} />
         ) : (
      <div style={{ margin: "auto", color: "#9ca3af" }}>
      Click <strong>New Chat</strong> to start.
    </div>
       )
       ) : null}
        </div>

        <Footer yearOverride={year} />

        {!isLoggedIn && <LoginOverlay />}

        {studentModal && (
          <StudentDetailModal
            token={token}
            student={studentModal}
            onClose={() => setStudentModal(null)}
          />
        )}

        {showAssignModal && data?.user?.role === "teacher" && (
          <TeacherAssignmentModal
            token={token}
            students={data.students || []}
            onClose={() => setShowAssignModal(false)}
          />
        )}

        {activeAssignment && data?.user?.role === "student" && (
          <StudentAssignmentModal
            token={token}
            assignment={activeAssignment}
            onClose={() => setActiveAssignment(null)}
          />
        )}
      </div>
    </div>
  );
}
