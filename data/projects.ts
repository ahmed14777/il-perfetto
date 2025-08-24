// data/projects.ts
import { IMAGES } from "./images";
import type { Project } from "./types";

const projects: Project[] = [
  {
    id: "p1",
    title: "Doccia moderna",
    city: "Milano",
    year: "2024",
    image: IMAGES.doccia,
    alt: "Doccia moderna con rivestimento blu lucido",
    category: "bagno",
    tags: ["doccia", "gres", "milano"],
  },
  {
    id: "p2",
    title: "Parquet grigio",
    city: "Legnano",
    year: "2024",
    image: IMAGES.parquet,
    alt: "Pavimento in parquet grigio effetto legno",
    category: "parquet",
    tags: ["parquet", "legnano"],
  },
  {
    id: "p3",
    title: "Piscina",
    city: "Milano",
    year: "2025",
    image: IMAGES.piscina,
    alt: "Piscina rivestita in mosaico blu",
    category: "piscina",
    tags: ["piscina", "mosaico", "milano"],
  },
];

export default projects;
