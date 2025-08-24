// data/images.ts
import type { StaticImageData } from "next/image";

import bagno1 from "@/public/images/bagno-1.jpg";
import bagno from "@/public/images/bagno.jpg";
import bagno2 from "@/public/images/bagno2.jpg";
import bagno3 from "@/public/images/bagno3.jpg";
import bagno4 from "@/public/images/bagno4.jpg";
import bagno5 from "@/public/images/bagno5.jpg";
import blue from "@/public/images/blue.jpg";
import doccia from "@/public/images/docia.jpg";

import parquet from "@/public/images/parquet.jpg";
import pavimento from "@/public/images/pavimento.jpg";
import pavimento2 from "@/public/images/pavimento2.jpg";
import pavimento3 from "@/public/images/pavimento3.jpg";

import piscina from "@/public/images/piscina.jpg";
import scala from "@/public/images/scala.jpg";
import scala2 from "@/public/images/scala-2.jpg";
import scala4 from "@/public/images/scala4.jpg";

export const IMAGES = {
  bagno1,
  bagno,
  bagno2,
  bagno3,
  bagno4,
  bagno5,
  blue,
  doccia,
  parquet,
  pavimento,
  pavimento2,
  pavimento3,
  piscina,
  scala,
  scala2,
  scala4,
} satisfies Record<string, StaticImageData>;

export type Img = StaticImageData;
