"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  const { scrollY } = useScroll();
  // Parallax بسيط للصورة
  const y = useTransform(scrollY, [0, 300], [0, 60]);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-20 md:pt-24"
    >
      <div className="absolute inset-0 -z-20 bg-neutral-900" aria-hidden />

      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image
          src="/images/parquet.jpg" // استبدلها بنسخة مضغوطة 1600–1920px
          alt="" // ديكور فقط
          fill // تغطي كل المساحة
          priority // مهم لتحسين LCP
          fetchPriority="high"
          sizes="100vw"
          className="object-cover opacity-60"
        />
      </motion.div>

      {/* Overlay خفيف */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-900/80 via-neutral-900/70 to-neutral-900/90" />

      {/* محتوى الهيرو مع ارتفاع ثابت لمنع CLS */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="max-w-3xl py-20 md:py-28 min-h-[60vh] flex flex-col justify-center"
        >
          <motion.h1
            variants={fadeUp()}
            className="text-3xl font-extrabold tracking-tight md:text-5xl"
          >
            Pavimenti, Marmo, Ceramica e Parquet{" "}
            <span className="text-[var(--brand)]">su misura</span>.
          </motion.h1>

          <motion.p
            variants={fadeUp(0.08)}
            className="mt-4 text-neutral-300 md:text-lg"
          >
            Dal bagno alla piscina: qualità, precisione e materiali certificati.
            Installazione a regola d’arte in tutta l’area di Milano e dintorni.
          </motion.p>

          <motion.div
            variants={fadeUp(0.16)}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#preventivo"
              className="rounded-md bg-[var(--brand)] px-6 py-3 text-center font-semibold text-black hover:opacity-90"
            >
              Richiedi Preventivo Online
            </a>
            <a
              href="#portfolio"
              className="rounded-md border border-white/20 px-6 py-3 text-center hover:bg-white/5"
            >
              Vedi lavori realizzati
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
