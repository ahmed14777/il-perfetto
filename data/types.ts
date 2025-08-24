// data/types.ts
import type { Img } from "./images";

export type Category =
  | "bagno"
  | "parquet"
  | "piscina"
  | "scala"
  | "esterni"
  | "speciali";

export type Project = {
  id: string;
  title: string;
  city?: string;
  year?: string;
  image: Img;
  alt: string;
  category?: Category;
  tags?: string[];
};

export type Service = {
  id: string;
  title: string;
  image: Img;
  alt: string;
  slug: string; 
  category?: Category;
};
