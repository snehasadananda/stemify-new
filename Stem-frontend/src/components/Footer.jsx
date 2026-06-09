import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  // Later this will call your backend page.controller.js
  useEffect(() => {
    setPages([
      { slug: "privacy-policy", title: "Privacy Policy" },
      { slug: "terms", title: "Terms & Conditions" },
      { slug: "refund", title: "Refund Policy" }
    ]);
  }, []);

  return (
    <footer style={styles.footer}>
      <div style={styles.left}>
        © {new Date().getFullYear()} STEMIFY AI
      </div>

      <div style={styles.right}>
        {pages.map(p => (
          <span
            key={p.slug}
            style={styles.link}
            onClick={() => navigate(`/page/${p.slug}`)}
          >
            {p.title}
          </span>
        ))}
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#0a0e1a",
    color: "#fff",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    position: "fixed",
    bottom: 0,
    width: "100%",
    fontSize: "13px"
  },
  right: {
    display: "flex",
    gap: "15px"
  },
  link: {
    cursor: "pointer",
    color: "#9fb4ff"
  }
};
