// data/images.ts
// استخدم مسارات public مباشرة (بدون أي import لصور)
export const IMAGES = {
  bagno1: "/images/bagno-1.jpg",
  bagno: "/images/bagno.jpg",
  bagno2: "/images/bagno2.jpg",
  bagno3: "/images/bagno3.jpg",
  bagno4: "/images/bagno4.jpg",
  bagno5: "/images/bagno5.jpg",
  blue: "/images/blue.jpg",
  doccia: "/images/docia.jpg",
  parquet: "/images/parquet.jpg",
  pavimento: "/images/pavimento.jpg",
  pavimento2: "/images/pavimento2.jpg",
  pavimento3: "/images/pavimento3.jpg",
  piscina: "/images/piscina.jpg",
  scala: "/images/scala.jpg",
  scala2: "/images/scala-2.jpg",
  scala4: "/images/scala4.jpg",
} as const;

export type Img = string; // ✅ أبسط حل يريح كل المستهلكين
