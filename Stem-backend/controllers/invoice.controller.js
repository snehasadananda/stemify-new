import PDFDocument from "pdfkit";
import { db } from "../config/db.js";

export const downloadInvoice = async (req, res) => {

  const paymentId = req.params.id;

  const [[p]] = await db.query(
    `SELECT * FROM payments WHERE id=?`,
    [paymentId]
  );

  const doc = new PDFDocument();

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=invoice.pdf"
  );

  doc.pipe(res);

  doc.fontSize(18).text("STEMIFY INVOICE");
  doc.text(`Amount: Rs ${p.amount}`);
  doc.text(`Status: ${p.status}`);
  doc.text(`Date: ${p.created_at}`);

  doc.end();
};
