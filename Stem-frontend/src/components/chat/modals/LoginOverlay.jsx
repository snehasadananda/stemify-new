

export default function LoginOverlay() {
  return (
    <div className="chat-login-overlay">
      <div className="chat-login-card">
        <h2>Login Required</h2>
        <p>You need to login to access the STEMIFY AI chat.</p>
        <div className="chat-login-buttons">
          <a href="/login" className="chat-login-btn primary">
            Go to Login
          </a>
          <a href="/" className="chat-login-btn secondary">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
