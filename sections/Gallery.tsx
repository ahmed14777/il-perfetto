"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gallery from "@/data/gallery";

type GalleryItem = { src: string | StaticImageData; alt: string };
const ITEMS: GalleryItem[] = gallery as unknown as GalleryItem[];

// Animations
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

  // Lock scroll + keyboard nav when lightbox open
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

  // --- Touch swipe handlers (mobile) ---
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const threshold = 40; // بكسل

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    moved.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    // لو السوايب أفقي غالبًا، امنع السكورل الأفقي الافتراضي
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      moved.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!moved.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    // تجاهل السوايب الرأسي
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx <= -threshold) {
      next(); // سوايب لليسار → الصورة التالية
    } else if (dx >= threshold) {
      prev(); // سوايب لليمين → السابقة
    }
  };

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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-2"
            variants={backDrop}
            initial="hidden"
            animate="show"
            exit="exit"
            aria-modal="true"
            role="dialog"
            onClick={close}
          >
            {/* Container يمنع الإغلاق عند الضغط على الصورة نفسها */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={zoom}
              className="relative w-full h-full max-w-6xl flex flex-col justify-center"
              // سوايب الموبايل
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* صورة كبيرة تملأ الشاشة تقريبًا على الموبايل */}
              <div className="relative mx-auto w-full h-[82vh] sm:h-[88vh]">
                <Image
                  src={ITEMS[index].src}
                  alt={ITEMS[index].alt}
                  fill
                  sizes="100vw"
                  className="object-contain rounded-lg"
                />
              </div>

              {/* الوصف */}
              <div className="mt-3 text-center text-sm text-neutral-300">
                {ITEMS[index].alt}
              </div>

              {/* أزرار التنقل */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
                <button
                  onClick={prev}
                  className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/20 hover:bg-white/30 text-xl"
                  aria-label="Precedente"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/20 hover:bg-white/30 text-xl"
                  aria-label="Successivo"
                >
                  ›
                </button>
              </div>

              {/* زر الإغلاق */}
              <button
                onClick={close}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
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
