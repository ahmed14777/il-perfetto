"use client";
import { useEffect, useState, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gallery from "@/data/gallery";

type GalleryItem = {
  src: string | StaticImageData;
  alt: string;
};

const ITEMS: GalleryItem[] = gallery as unknown as GalleryItem[];

const backDrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const zoom = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

const toSrcString = (s: string | StaticImageData) =>
  typeof s === "string" ? s : s.src;

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number>(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % ITEMS.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length),
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev]);

  return (
    <section
      id="gallery"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 md:scroll-mt-32 md:px-6"
    >
      <h2 className="text-center text-2xl font-bold md:text-3xl">Galleria</h2>

      {/* Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {ITEMS.map((img, i) => (
          <button
            key={toSrcString(img.src) + i}
            onClick={() => openAt(i)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            aria-label={`Apri immagine: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={900}
              height={600}
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4"
            variants={backDrop}
            initial="hidden"
            animate="show"
            exit="exit"
            aria-modal="true"
            role="dialog"
            onClick={close}
          >
            {/* Container يمنع إغلاق عند الضغط على الصورة نفسها */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={zoom}
              className="relative w-full max-w-5xl"
            >
              {/* صورة كبيرة — نستخدم fill + object-contain */}
              <div className="relative mx-auto aspect-[16/10] w-full max-h-[80vh]">
                <Image
                  src={ITEMS[index].src}
                  alt={ITEMS[index].alt}
                  fill
                  sizes="90vw"
                  className="rounded-xl object-contain"
                  priority={false}
                />
              </div>

              <div className="mt-3 text-center text-sm text-neutral-300">
                {ITEMS[index].alt}
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
                <button
                  onClick={prev}
                  className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Precedente"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Successivo"
                >
                  ›
                </button>
              </div>

              <button
                onClick={close}
                className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Chiudi"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
