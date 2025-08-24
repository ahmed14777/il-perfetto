"use client";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import projects from "@/data/projects";
import { fadeUp, staggerContainer } from "@/lib/animations";

type ProjectItem = {
  id: string;
  title: string;
  city?: string;
  year?: string;
  image: string | StaticImageData;
  alt: string;
};

const ITEMS = projects as unknown as ProjectItem[];

export default function Portfolio() {
  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <motion.h2
        variants={fadeUp()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-2xl font-bold md:text-3xl"
      >
        Alcuni lavori realizzati
      </motion.h2>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ITEMS.map((p) => (
          <motion.figure
            key={p.id}
            variants={fadeUp()}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {/* الصورة — next/image يدعم string أو StaticImageData */}
            <div className="relative h-56 w-full">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                priority={false}
              />
            </div>

            {/* Overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <div className="translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-neutral-300">
                  {p.city} {p.city && p.year ? "•" : ""} {p.year}
                </p>
              </div>
              <a
                href="#preventivo"
                className="translate-y-3 rounded-md border border-white/20 px-3 py-1 text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white/5"
              >
                Preventivo
              </a>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
