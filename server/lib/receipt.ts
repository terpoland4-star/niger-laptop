import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { company } from "../../client/src/data/company";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface ReceiptData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  total: number;
  items: OrderItem[];
  paidAt: string;
}

const LOGO_PATH = path.join(
  process.cwd(),
  "client",
  "public",
  "assets",
  "images",
  "logo",
  "logolap-transparent.png"
);

const RECEIPTS_DIR = path.join(process.cwd(), "uploads", "receipts");

const GREEN = "#1F6F3C";
const DARK = "#1A1A1A";
const GREY = "#666666";

export function generateReceiptPdf(order: ReceiptData): string {
  if (!fs.existsSync(RECEIPTS_DIR)) {
    fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
  }

  const filename = `recu-${order.orderNumber}.pdf`;
  const filePath = path.join(RECEIPTS_DIR, filename);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // --- Filigrane (logo centré, très faible opacité) ---
  if (fs.existsSync(LOGO_PATH)) {
    const wmSize = 320;
    doc.opacity(0.06);
    doc.image(
      LOGO_PATH,
      (pageWidth - wmSize) / 2,
      (pageHeight - wmSize) / 2,
      { width: wmSize }
    );
    doc.opacity(1);
  }

  // --- En-tête : logo net + nom entreprise ---
  if (fs.existsSync(LOGO_PATH)) {
    doc.image(LOGO_PATH, 50, 45, { width: 70 });
  }

  doc
    .fillColor(DARK)
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(company.name, 130, 50);

  doc
    .fillColor(GREY)
    .fontSize(9)
    .font("Helvetica")
    .text(company.tagline, 130, 74);

  doc
    .fontSize(8)
    .fillColor(GREY)
    .text(
      `RCCM ${company.legal.rccm}  ·  NIF ${company.legal.nif}`,
      130,
      88
    );

  doc.moveTo(50, 130).lineTo(pageWidth - 50, 130).strokeColor("#DDDDDD").stroke();

  // --- Titre reçu ---
  doc
    .fillColor(GREEN)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("REÇU DE PAIEMENT", 50, 150);

  doc
    .fillColor(DARK)
    .fontSize(10)
    .font("Helvetica")
    .text(`Commande n° ${order.orderNumber}`, 50, 175)
    .text(
      `Payé le ${new Date(order.paidAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      50,
      190
    );

  // --- Infos client ---
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Client", 350, 175)
    .font("Helvetica")
    .text(order.customerName, 350, 190)
    .text(order.customerPhone, 350, 204);

  if (order.deliveryAddress) {
    doc.text(order.deliveryAddress, 350, 218, { width: 200 });
  }

  // --- Tableau articles ---
  let y = 260;
  doc
    .rect(50, y, pageWidth - 100, 22)
    .fill(GREEN);
  doc
    .fillColor("#FFFFFF")
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("Désignation", 58, y + 6)
    .text("Qté", 330, y + 6)
    .text("Prix unitaire", 390, y + 6)
    .text("Total", 490, y + 6);

  y += 22;
  doc.font("Helvetica").fontSize(9).fillColor(DARK);

  order.items.forEach((item, i) => {
    const rowHeight = 24;
    if (i % 2 === 0) {
      doc.rect(50, y, pageWidth - 100, rowHeight).fill("#F7F7F7");
      doc.fillColor(DARK);
    }
    doc
      .fontSize(9)
      .text(item.productName, 58, y + 7, { width: 260 })
      .text(String(item.quantity), 330, y + 7)
      .text(`${item.unitPrice.toLocaleString("fr-FR")} FCFA`, 390, y + 7)
      .text(`${item.lineTotal.toLocaleString("fr-FR")} FCFA`, 490, y + 7);
    y += rowHeight;
  });

  // --- Total ---
  y += 10;
  doc.moveTo(350, y).lineTo(pageWidth - 50, y).strokeColor("#DDDDDD").stroke();
  y += 12;
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(GREEN)
    .text("TOTAL PAYÉ", 350, y)
    .text(`${order.total.toLocaleString("fr-FR")} FCFA`, 490, y);

  // --- Mention légale DGI ---
  y += 60;
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(GREY)
    .text(
      "Ce document est un reçu de paiement à usage commercial interne, émis par Niger Laptops. " +
        "Il ne constitue pas une facture fiscale certifiée. Les factures certifiées relèvent de la " +
        "Direction Générale des Impôts (DGI), via le compte fiscal dédié à l'entreprise.",
      50,
      y,
      { width: pageWidth - 100 }
    );

  // --- Pied de page ---
  const footerY = pageHeight - 90;
  doc.moveTo(50, footerY).lineTo(pageWidth - 50, footerY).strokeColor("#DDDDDD").stroke();
  doc
    .fontSize(8)
    .fillColor(GREY)
    .text(
      `${company.name}  ·  ${company.address}`,
      50,
      footerY + 10,
      { width: pageWidth - 100 }
    )
    .text(
      `Tél : ${company.phone.join(" · ")}  ·  ${company.website}`,
      50,
      footerY + 24
    );

  doc.end();

  return `uploads/receipts/${filename}`;
}
