// data/services.ts
import { IMAGES } from "./images";
import type { Service } from "./types";

const services: Service[] = [
  {
    id: "s1",
    title: "Marmo & Ceramica",
    image: IMAGES.bagno1,
    alt: "Rivestimento in marmo e ceramica per bagno moderno",
    slug: "marmo-ceramica",
    category: "bagno",
  },
  {
    id: "s2",
    title: "Parquet & Laminato",
    image: IMAGES.parquet,
    alt: "Parquet naturale e laminato posa professionale",
    slug: "parquet-laminato",
    category: "parquet",
  },
  {
    id: "s3",
    title: "Esterni & Scale",
    image: IMAGES.scala,
    alt: "Rivestimenti per esterni e scale in gres",
    slug: "esterni-scale",
    category: "esterni",
  },
  {
    id: "s4",
    title: "Piscine & Speciali",
    image: IMAGES.piscina,
    alt: "Rivestimenti piscina e progetti speciali",
    slug: "piscine-speciali",
    category: "piscina",
  },
];

export default services;
