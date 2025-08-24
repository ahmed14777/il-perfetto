// lib/pdf.ts
import jsPDF from "jspdf";

export type CompanyInfo = {
  name: string;
  piva: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  logoDataUrl?: string; // PNG/SVG كـ Base64 (optional)
};

export type ClientInfo = {
  name: string;
  email: string;
  phone: string;
  city?: string;
};

export type QuoteInfo = {
  material: "piastrella" | "ceramica" | "parquet";
  finish: "standard" | "premium";
  mq: number;
  pricePerMq: number;
  baseTotal: number;
  vat: number;
  total: number;
};

const BRAND = {
  hex: "#f07818",
  rgb: [240, 120, 24] as [number, number, number],
};
const GREY = (n: number) => [n, n, n] as [number, number, number];

function eur(n: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**  triangle   */
function rrect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r = 8,
  style: "S" | "F" | "FD" | "DF" = "S"
) {
  (doc as any).roundedRect(x, y, w, h, r, r, style);
}

/** line */
function line(doc: jsPDF, y: number, x1 = 40, x2 = 555) {
  doc.setDrawColor(230, 230, 230);
  doc.line(x1, y, x2, y);
}

export function generateQuotePDF(
  company: CompanyInfo,
  client: ClientInfo,
  quote: QuoteInfo
) {
  const doc = new jsPDF({ unit: "pt", compress: true });

  // meta data
  doc.setProperties({
    title: `Preventivo ${company.name}`,
    subject: "Stima Preventivo",
    author: company.name,
    creator: company.name,
  });
  const today = new Date();
  const dateStr = today.toLocaleDateString("it-IT");

  // logo
  doc.setFillColor(...BRAND.rgb);
  rrect(doc, 0, 0, 595, 110, 0, "F");

  // logo (optional)
  if (company.logoDataUrl) {
    try {
      doc.addImage(
        company.logoDataUrl,
        "PNG",
        40,
        28,
        120,
        54,
        undefined,
        "FAST"
      );
    } catch {
      /* continue without logo */
    }
  }

  // campany details
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(company.name, 200, 45, { baseline: "middle" } as any);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`P.IVA ${company.piva}`, 200, 65);
  doc.text(company.address, 200, 80);
  const contactLine = [company.email, company.phone, company.website]
    .filter(Boolean)
    .join(" • ");
  if (contactLine) doc.text(contactLine, 200, 95);

  // title
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PREVENTIVO", 40, 150);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(110));
  doc.text(`Data: ${dateStr}`, 40, 168);

  // client card
  const colW = 255;
  const gap = 15;
  const topCardsY = 195;

  //  "Dati Cliente"
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(255, 255, 255);
  rrect(doc, 40, topCardsY, colW, 120, 10, "DF");
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Dati Cliente", 55, topCardsY + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(60));
  let y = topCardsY + 46;
  doc.text(`Nome: ${client.name || "-"}`, 55, y);
  y += 16;
  doc.text(`Email: ${client.email || "-"}`, 55, y);
  y += 16;
  doc.text(`Telefono: ${client.phone || "-"}`, 55, y);
  y += 16;
  doc.text(`Città: ${client.city || "-"}`, 55, y);

  //  "Dettagli Lavoro"
  rrect(doc, 40 + colW + gap, topCardsY, colW, 120, 10, "DF");
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Dettagli Lavoro", 55 + colW + gap, topCardsY + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(60));
  y = topCardsY + 46;
  const materialLabel = titleCase(quote.material);
  const finishLabel = quote.finish === "premium" ? "Premium" : "Standard";
  doc.text(`Materiale: ${materialLabel}`, 55 + colW + gap, y);
  y += 16;
  doc.text(`Finitura: ${finishLabel}`, 55 + colW + gap, y);
  y += 16;
  doc.text(`Superficie: ${quote.mq} mq`, 55 + colW + gap, y);
  y += 16;
  doc.text(`Prezzo al mq: ${eur(quote.pricePerMq)}`, 55 + colW + gap, y);

  // table Breakdown
  const tableY = topCardsY + 150;
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Riepilogo costi", 40, tableY);

  // table header
  const rowH = 28;
  const tableX = 40;
  const tableW = 515;
  const col1 = 0.6 * tableW; // الوصف
  const col2 = 0.4 * tableW; // المبلغ

  // table
  doc.setFillColor(246, 246, 246);
  rrect(doc, tableX, tableY + 12, tableW, rowH, 8, "F");
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Voce", tableX + 12, tableY + 12 + 18);
  doc.text("Importo", tableX + col1 + 12, tableY + 12 + 18);

  // data array
  const rows: Array<[string, string]> = [
    ["Posa base", eur(quote.baseTotal)],
    ["IVA (22%)", eur(quote.vat)],
  ];
  let ry = tableY + 12 + rowH + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(70));
  rows.forEach(([label, val], i) => {
    // background
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      rrect(doc, tableX, ry - 20, tableW, rowH, 6, "F");
    }
    doc.text(label, tableX + 12, ry);
    doc.text(val, tableX + col1 + 12, ry, { align: "left" } as any);
    ry += rowH;
  });

  //total
  const totalBoxY = ry + 8;
  doc.setFillColor(...BRAND.rgb);
  doc.setTextColor(255, 255, 255);
  rrect(doc, tableX, totalBoxY, tableW, 46, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTALE INDICATIVO", tableX + 12, totalBoxY + 30);
  doc.setFontSize(14);
  doc.text(eur(quote.total), tableX + col1 + 12, totalBoxY + 30);

  const noteY = totalBoxY + 70;
  doc.setTextColor(...GREY(110));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Stima indicativa, soggetta a sopralluogo. Offerta non vincolante.",
    40,
    noteY
  );

  const footerY = 812;
  line(doc, footerY - 20);
  doc.setTextColor(...GREY(110));
  doc.setFontSize(9);
  const footer = [
    company.name,
    `P.IVA ${company.piva}`,
    company.address,
    [company.email, company.phone, company.website].filter(Boolean).join(" • "),
  ]
    .filter(Boolean)
    .join(" • ");
  doc.text(footer, 40, footerY);

  // save file
  doc.save(`Preventivo_${client.name || "cliente"}_${quote.mq}mq.pdf`);
}
