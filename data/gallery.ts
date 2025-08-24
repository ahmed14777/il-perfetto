// data/gallery.ts
import { IMAGES } from "./images";
import type { Category } from "./types";

export type GalleryItem = {
  src: (typeof IMAGES)[keyof typeof IMAGES];
  alt: string;
  category?: Category;
};

const gallery: GalleryItem[] = [
  { src: IMAGES.bagno1, alt: "Bagno con doccia in vetro", category: "bagno" },
  {
    src: IMAGES.bagno2,
    alt: "Rivestimento bagno in marmo chiaro",
    category: "bagno",
  },
  {
    src: IMAGES.parquet,
    alt: "Parquet in legno naturale",
    category: "parquet",
  },
  { src: IMAGES.piscina, alt: "Piscina con mosaico blu", category: "piscina" },
  { src: IMAGES.scala, alt: "Scala interna in gres", category: "scala" },
  { src: IMAGES.bagno3, alt: "doccia", category: "bagno" },
  { src: IMAGES.blue, alt: "bagno", category: "bagno" },
  { src: IMAGES.bagno5, alt: "bagno", category: "bagno" },
  { src: IMAGES.pavimento, alt: "pavimento", category: "parquet" },
  { src: IMAGES.pavimento2, alt: "pavimento", category: "parquet" },
  { src: IMAGES.pavimento3, alt: "pavimento", category: "parquet" },
  { src: IMAGES.scala4, alt: "scala", category: "scala" },
];

export default gallery;
