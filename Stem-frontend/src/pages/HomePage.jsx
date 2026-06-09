import "./HomePage.css";
import robotImg from "../assets/robot.png";
import stemifyLogo from "../assets/stemify-logo.png";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  // CMS-ready footer links (later load from backend)
  const footerPages = [
    { slug: "privacy-policy", title: "Privacy Policy" },
    { slug: "terms-and-conditions", title: "Terms & Conditions" },
    { slug: "refund-policy", title: "Refund Policy" }
  ];

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-center">
          <Link to="/">
            <img
              src={stemifyLogo}
              alt="STEMIFY Logo"
              className="stemify-logo clickable-logo"
            />
          </Link>

          <p className="tagline">
            Empowering Students, Enabling Teachers
          </p>

          <div className="cta-row">
            <Link to="/login" className="cta-card small-card">
              <h2 className="cta-title primary">Start Now</h2>
              <p className="cta-text">
                Begin your learning journey with the AI Tutor
              </p>
            </Link>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="cta-card small-card"
            >
              <h2 className="cta-title secondary">
                Get STEMIFY AI App
              </h2>
              <p className="cta-text">
                Download on Play Store / App Store
              </p>
            </a>
          </div>

          <div className="cta-row">
            <Link to="/register" className="cta-card small-card">
              <h2 className="cta-title primary">Sign Up</h2>
              <p className="cta-text">
                Get registered to Learn Things
              </p>
            </Link>
          </div>
        </div>

        <div className="robot-wrapper">
          <img
            src={robotImg}
            alt="Robot"
            className="robot big-robot floating-robot"
          />
        </div>
      </section>

      {/* ✅ UPDATED FOOTER (CMS READY) */}
      <footer className="footer">
        <div className="footer-links">
          {footerPages.map((p) => (
            <span
              key={p.slug}
              className="footer-link"
              onClick={() => navigate(`/page/${p.slug}`)}
            >
              {p.title}
            </span>
          ))}
        </div>

        <p>
          © {year} STEMIFY. All rights reserved. | Powered by{" "}
          <a
            href="https://vikimediatec.com/"
            target="_blank"
            rel="noreferrer"
          >
            Vikimediatec Pvt Ltd
          </a>
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
