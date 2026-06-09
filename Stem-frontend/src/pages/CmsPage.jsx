import { useParams } from "react-router-dom";

export default function CmsPage() {
  const { slug } = useParams();

  return (
    <div style={{ padding: 40, marginBottom: 60 }}>
      <h2>{slug.replace("-", " ").toUpperCase()}</h2>

      <p>
        This content will be loaded from backend:
        page.controller.js → /api/pages/{slug}
      </p>

      <p>
        Super Admin will edit this from dashboard.
      </p>
    </div>
  );
}
