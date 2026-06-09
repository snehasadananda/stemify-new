import { useEffect, useState } from "react";
import VikiLayout from "../../components/viki/VikiLayout";
import { getPages, savePage } from "../../services/cmsService";
import "./CmsEditor.css";

export default function CmsEditor() {
  const [pages, setPages] = useState([]);
  const [active, setActive] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    getPages().then((d) => setPages(d));
  }, []);

  const open = (p) => {
    setActive(p);
    setContent(p.content || "");
  };

  const save = async () => {
    await savePage({
      slug: active.slug,
      title: active.title,
      content
    });

    alert("Saved!");
  };

  return (
    <VikiLayout>
      <h2>CMS Pages</h2>

      <div className="cms-grid">
        <div className="cms-list">
          {pages.map((p) => (
            <div
              key={p.slug}
              className="cms-item"
              onClick={() => open(p)}
            >
              {p.title}
            </div>
          ))}
        </div>

        {active && (
          <div className="cms-editor">
            <h3>{active.title}</h3>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
            />

            <button onClick={save}>Save</button>
          </div>
        )}
      </div>
    </VikiLayout>
  );
}
