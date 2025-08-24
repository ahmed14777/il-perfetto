// lib/advisor.ts
export type RoomType = "bagno" | "cucina" | "soggiorno" | "scala" | "esterno";
export type MaterialKey =
  | "piastrella"
  | "ceramica"
  | "parquet_laminato"
  | "parquet_ingegnerizzato";
export type FinishKey = "standard" | "premium";
export type BudgetBand = "basso" | "medio" | "alto";

export type Inputs = {
  room: RoomType;
  mq: number;
  wetArea: boolean; // مناطق رطبة/ماء؟
  traffic: "low" | "med" | "high"; // كثافة استخدام
  underfloorHeat: boolean; // تدفئة أرضية؟
  budget: BudgetBand;
  distanzaKm?: number; // مسافة تقديرية للنقل
  removeOldFloor?: boolean; // نزع أرضية قديمة
};

export const PRICES: Record<MaterialKey, Record<FinishKey, number>> = {
  piastrella: { standard: 20, premium: 25 },
  ceramica: { standard: 30, premium: 35 },
  parquet_laminato: { standard: 50, premium: 60 },
  parquet_ingegnerizzato: { standard: 60, premium: 80 },
};

// بنود إضافية (بالـ €/م² أو مبلغ ثابت)
const EXTRAS = {
  waterproofing: 8, // عازل رطوبة (€/م²)
  siliconeFinish: 2, // تشطيب سيليكون (€/م²)
  skirtingPerMq: 3, // وزر/حلية تقديري (€/م²)
  removeOldFloorPerMq: 6, // رفع أرضية قديمة (€/م²)
  stairPerStep: 25, // درجة سلم (لكل درجة) — اختياري
  transportPerKm: 1.2, // نقل (€/كم) سقف بسيط
};

const VAT = 0.22;

// اختيار مبدئي للـ Material/Finish منطقياً حسب المدخلات
export function adviseMaterial(i: Inputs): {
  material: MaterialKey;
  finish: FinishKey;
  notes: string[];
} {
  const notes: string[] = [];
  // مناطق رطبة/ماء أو استعمال عالي → فضّل بورسلين/سيراميك
  if (
    i.wetArea ||
    i.room === "bagno" ||
    i.room === "cucina" ||
    i.traffic === "high"
  ) {
    // لو الميزانية منخفضة → piastrella standard، لو أعلى → ceramica
    if (i.budget === "basso") {
      notes.push("Area umida/uso intenso → piastrella consigliata.");
      return { material: "piastrella", finish: "standard", notes };
    }
    notes.push("Area umida/uso intenso → ceramica consigliata.");
    return {
      material: "ceramica",
      finish: i.budget === "alto" ? "premium" : "standard",
      notes,
    };
  }

  // تدفئة أرضية → ابعد عن لامينيت الرخيص
  if (i.underfloorHeat) {
    notes.push(
      "Riscaldamento a pavimento → parquet ingegnerizzato o ceramica."
    );
    if (i.budget === "alto")
      return { material: "parquet_ingegnerizzato", finish: "premium", notes };
    return { material: "parquet_ingegnerizzato", finish: "standard", notes };
  }

  // صالون/غرف جافة
  if (i.room === "soggiorno") {
    if (i.budget === "basso")
      return { material: "parquet_laminato", finish: "standard", notes };
    if (i.budget === "medio")
      return { material: "parquet_laminato", finish: "premium", notes };
    return { material: "parquet_ingegnerizzato", finish: "standard", notes };
  }

  // سلم/خارجي
  if (i.room === "scala" || i.room === "esterno") {
    notes.push("Scala/esterno → ceramica antiscivolo consigliata.");
    return {
      material: "ceramica",
      finish: i.budget === "alto" ? "premium" : "standard",
      notes,
    };
  }

  // افتراضي
  return { material: "piastrella", finish: "standard", notes };
}

export type ComputedQuote = {
  pricePerMq: number;
  baseTotal: number;
  extras: { label: string; amount: number }[];
  subtotal: number;
  vat: number;
  total: number;
};

export function computeQuote(
  i: Inputs,
  pick?: { material: MaterialKey; finish: FinishKey }
): ComputedQuote {
  const advice = pick ?? adviseMaterial(i);
  const pricePerMq = PRICES[advice.material][advice.finish];

  // أساس: سعر الم² × المساحة
  let baseTotal = pricePerMq * i.mq;

  const extras: { label: string; amount: number }[] = [];

  // منطق الإضافات
  if (i.wetArea || i.room === "bagno") {
    extras.push({
      label: "Impermeabilizzazione (massetto/box doccia)",
      amount: EXTRAS.waterproofing * i.mq,
    });
    extras.push({
      label: "Sigillature siliconiche",
      amount: EXTRAS.siliconeFinish * i.mq,
    });
  }

  // وزر غالبًا لأي أرضية داخلية
  if (i.room !== "esterno") {
    extras.push({
      label: "Battiscopa (stima)",
      amount: EXTRAS.skirtingPerMq * i.mq,
    });
  }

  if (i.removeOldFloor) {
    extras.push({
      label: "Rimozione pavimento esistente",
      amount: EXTRAS.removeOldFloorPerMq * i.mq,
    });
  }

  if (i.distanzaKm && i.distanzaKm > 0) {
    const transport = Math.min(i.distanzaKm * EXTRAS.transportPerKm, 300); // سقف 300€
    extras.push({ label: `Trasporto (${i.distanzaKm} km)`, amount: transport });
  }

  // جمع
  const extrasTotal = extras.reduce((s, e) => s + e.amount, 0);
  const subtotal = baseTotal + extrasTotal;
  const vat = Math.round(subtotal * VAT);
  const total = Math.round(subtotal + vat);

  return { pricePerMq, baseTotal, extras, subtotal, vat, total };
}
