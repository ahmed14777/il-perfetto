// lib/pdf.ts
import jsPDF from "jspdf";

export type CompanyInfo = {
  name: string;
  piva: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  logoDataUrl?: string; // Base64 (PNG/SVG)
  iban?: string; // يظهر في التذييل إن وُجد
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
  quoteNumber?: string;
  validityDays?: number;
};

const BRAND = {
  hex: "#f07818",
  rgb: [240, 120, 24] as [number, number, number],
};
const GREY = (n: number) => [n, n, n] as [number, number, number];
const BRAND_SOFT = [255, 243, 234] as [number, number, number];

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
function line(doc: jsPDF, y: number, x1 = 40, x2 = 555) {
  doc.setDrawColor(230, 230, 230);
  doc.line(x1, y, x2, y);
}
function multiline(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 14
) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((ln, i) => doc.text(ln, x, y + i * lineHeight));
  return y + (lines.length - 1) * lineHeight;
}

export function generateQuotePDF(
  company: CompanyInfo,
  client: ClientInfo,
  quote: QuoteInfo
) {
  const doc = new jsPDF({ unit: "pt", compress: true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const MARGIN_X = 40;
  const BOTTOM_MARGIN = 40;

  // Meta
  doc.setProperties({
    title: `Preventivo ${company.name}`,
    subject: "Stima Preventivo",
    author: company.name,
    creator: company.name,
  });
  const today = new Date();
  const dateStr = today.toLocaleDateString("it-IT");
  const quoteNo =
    quote.quoteNumber ||
    `PF-${today.getFullYear()}${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  const validityDays = quote.validityDays ?? 14;

  // Header band
  doc.setFillColor(...BRAND.rgb);
  rrect(doc, 0, 0, pageW, 115, 0, "F");

  // Logo (optional)
  if (company.logoDataUrl) {
    try {
      doc.addImage(
        company.logoDataUrl,
        "PNG",
        MARGIN_X,
        28,
        120,
        54,
        undefined,
        "FAST"
      );
    } catch {}
  }

  // Company block
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(company.name, 200, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`P.IVA ${company.piva}`, 200, 60);
  doc.text(company.address, 200, 74);
  const contactLine = [company.email, company.phone, company.website]
    .filter(Boolean)
    .join(" • ");
  if (contactLine) doc.text(contactLine, 200, 88);

  // Title + meta
  doc.setTextColor(...GREY(20));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PREVENTIVO", MARGIN_X, 150);
  doc.setDrawColor(...BRAND.rgb);
  doc.setLineWidth(1.2);
  doc.line(MARGIN_X, 155, MARGIN_X + 140, 155);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(110));
  doc.text(`Data: ${dateStr}`, MARGIN_X, 170);
  doc.text(`N°: ${quoteNo}`, MARGIN_X + 80, 170);
  doc.text(`Validità: ${validityDays} giorni`, MARGIN_X + 160, 170);
  doc.setLineWidth(0.2);

  // Cards: Cliente + Dettagli
  const colW = 255,
    gap = 15,
    topCardsY = 195;

  // Dati Cliente
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(255, 255, 255);
  rrect(doc, MARGIN_X, topCardsY, colW, 130, 10, "DF");
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Dati Cliente", MARGIN_X + 15, topCardsY + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(65));
  let y = topCardsY + 46;
  doc.text(`Nome: ${client.name || "-"}`, MARGIN_X + 15, y);
  y += 16;
  doc.text(`Email: ${client.email || "-"}`, MARGIN_X + 15, y);
  y += 16;
  doc.text(`Telefono: ${client.phone || "-"}`, MARGIN_X + 15, y);
  y += 16;
  doc.text(`Città: ${client.city || "-"}`, MARGIN_X + 15, y);

  // Dettagli Lavoro (أوضح)
  rrect(doc, MARGIN_X + colW + gap, topCardsY, colW, 130, 10, "DF");
  doc.setFillColor(...BRAND_SOFT);
  rrect(doc, MARGIN_X + colW + gap, topCardsY, colW, 130, 10, "F");
  const badgeX = MARGIN_X + colW + gap + 15,
    badgeY = topCardsY + 16,
    badgeH = 18,
    badgeW = 118;
  doc.setFillColor(...BRAND.rgb);
  rrect(doc, badgeX, badgeY, badgeW, badgeH, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Dettagli Lavoro", badgeX + 8, badgeY + 12);

  doc.setTextColor(...GREY(25));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const materialLabel = titleCase(quote.material);
  const finishLabel = quote.finish === "premium" ? "Premium" : "Standard";
  let ly = topCardsY + 46;
  const bullets = [
    `Materiale: ${materialLabel}`,
    `Finitura: ${finishLabel}`,
    `Superficie: ${quote.mq} mq`,
    `Prezzo al mq: ${eur(quote.pricePerMq)}`,
  ];
  bullets.forEach((b) => {
    doc.setFillColor(...BRAND.rgb);
    rrect(doc, MARGIN_X + colW + gap + 15, ly - 9, 6, 6, 2, "F");
    doc.text(b, MARGIN_X + colW + gap + 15 + 12, ly);
    ly += 16;
  });

  // Descrizione lavoro
  const descY = topCardsY + 160;
  doc.setTextColor(...GREY(30));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Descrizione lavoro", MARGIN_X, descY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY(70));
  doc.setFontSize(10);
  const desc =
    `- Installazione e posa ${materialLabel} (${finishLabel}).\n` +
    `- Incollaggio professionale su sottofondo idoneo.\n` +
    `- Tagli, allineamenti e raccordi necessari.\n` +
    `- Sigillatura, pulizia tecnica e finitura del lavoro a regola d’arte.`;
  multiline(doc, desc, MARGIN_X, descY + 18, pageW - MARGIN_X * 2, 16);

  // RIEPILOGO COSTI — ترويسة أوضح
  const tableY = descY + 110;
  doc.setFillColor(...BRAND.rgb);
  rrect(doc, MARGIN_X, tableY - 22, 160, 20, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RIEPILOGO COSTI", MARGIN_X + 8, tableY - 7);

  const rowH = 32; // أعلى لتوسيط النص
  const tableX = MARGIN_X;
  const tableW = pageW - MARGIN_X * 2;
  const col1 = 0.62 * tableW;

  // رأس الجدول (تباين أعلى + نص داكن جدًا)
  doc.setFillColor(232, 232, 232);
  rrect(doc, tableX, tableY + 12, tableW, rowH, 8, "F");
  doc.setTextColor(...GREY(5)); // شبه أسود لتباين قوي
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const headerBaseline = tableY + 12 + Math.floor(rowH / 2) + 4; // تقريبًا منتصف الصف
  doc.text("Voce", tableX + 12, headerBaseline);
  doc.text("Importo", tableX + tableW - 12, headerBaseline, {
    align: "right",
  } as any);

  // Rows
  const rows: Array<[string, string]> = [
    [
      `Posa ${materialLabel} (${finishLabel}) — ${quote.mq} mq × ${eur(
        quote.pricePerMq
      )}`,
      eur(quote.baseTotal),
    ],
    ["IVA (22%)", eur(quote.vat)],
  ];

  let ry = tableY + 12 + rowH + 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY(40));
  rows.forEach(([label, val], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      rrect(doc, tableX, ry - (rowH - 14), tableW, rowH, 6, "F");
    }
    const wrapped = doc.splitTextToSize(label, col1 - 24) as string[];
    // baseline للسطر الأول
    const baseY = ry;
    // النص يسار
    doc.text(wrapped, tableX + 12, baseY);
    // القيمة يمين
    doc.text(val, tableX + tableW - 12, baseY, { align: "right" } as any);
    // عدّل الارتفاع وفق عدد الأسطر
    ry += Math.max(rowH, 14 * (wrapped.length || 1));
  });

  // Totale
  const totalBoxY = ry + 10;
  doc.setFillColor(...BRAND.rgb);
  doc.setTextColor(255, 255, 255);
  rrect(doc, tableX, totalBoxY, tableW, 54, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTALE INDICATIVO", tableX + 12, totalBoxY + 36);
  doc.setFontSize(14);
  doc.text(eur(quote.total), tableX + tableW - 12, totalBoxY + 36, {
    align: "right",
  } as any);

  // Note
  const noteY = totalBoxY + 78;
  doc.setTextColor(...GREY(110));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const note =
    "Stima indicativa, soggetta a sopralluogo e verifica del sottofondo. Offerta non vincolante. " +
    `Validità ${validityDays} giorni dalla data del preventivo.`;
  multiline(doc, note, MARGIN_X, noteY, tableW, 13);

  // Footer — داخل حدود الصفحة دائمًا
  const footerY = pageH - BOTTOM_MARGIN; // 40pt من أسفل
  line(doc, footerY - 18);
  doc.setTextColor(...GREY(110));
  doc.setFontSize(9);
  const footerParts = [
    company.name,
    `P.IVA ${company.piva}`,
    company.address,
    [company.email, company.phone, company.website].filter(Boolean).join(" • "),
    company.iban ? `IBAN: ${company.iban}` : undefined,
  ].filter(Boolean) as string[];

  // لو التذييل طويل، هنقلل عرضه ونخليه يتلف داخل المساحة
  const footerMaxWidth = tableW; // نفس عرض المحتوى
  multiline(
    doc,
    footerParts.join(" • "),
    MARGIN_X,
    footerY,
    footerMaxWidth,
    12
  );

  // Save
  const safeName = (client.name || "cliente").replace(
    /[^\p{L}\p{N}\-_ ]/gu,
    ""
  );
  doc.save(`Preventivo_${safeName}_${quote.mq}mq.pdf`);
}
