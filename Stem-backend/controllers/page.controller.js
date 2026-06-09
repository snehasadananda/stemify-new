import { db } from "../config/db.js";
import { success } from "../utils/response.js";

// CREATE / EDIT
export const savePage = async (req, res) => {

  const { title, slug, content } = req.body;

  await db.query(
    `INSERT INTO pages (title, slug, content)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       content=?`,
    [title, slug, content, content]
  );

  return success(res, "saved");
};

// GET PUBLIC PAGE
export const getPage = async (req, res) => {

  const [[p]] = await db.query(
    "SELECT * FROM pages WHERE slug=?",
    [req.params.slug]
  );

  return success(res, "page", p);
};

// LIST FOR FOOTER
export const listPages = async (req, res) => {

  const [rows] = await db.query(
    "SELECT title, slug FROM pages"
  );

  return success(res, "list", rows);
};
