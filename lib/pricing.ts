// lib/pricing.ts
export type MaterialKey = "piastrella" | "ceramica" | "parquet";
export type FinishKey = "standard" | "premium";

export type QuoteInput = {
  material: MaterialKey;
  finish: FinishKey;
  mq: number;
  client: {
    name: string;
    email: string;
    phone: string;
    city?: string;
  };
};

export type QuoteResult = {
  pricePerMq: number;
  baseTotal: number;
  vat: number;
  total: number;
};

export const PRICES: Record<MaterialKey, Record<FinishKey, number>> = {
  piastrella: { standard: 20, premium: 25 },
  ceramica: { standard: 30, premium: 35 },
  parquet: { standard: 50, premium: 60 },
};

export function computeQuote(input: QuoteInput): QuoteResult {
  const pricePerMq = PRICES[input.material][input.finish];
  const baseTotal = input.mq * pricePerMq;
  const vat = Math.round(baseTotal * 0.22);
  const total = baseTotal + vat;
  return { pricePerMq, baseTotal, vat, total };
}
