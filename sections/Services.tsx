"use client";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import services from "@/data/services";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";

type ServiceItem = {
  id?: string;
  title: string;
  image: string | StaticImageData; // يقبل مسار نصّي أو StaticImport
  alt: string;
  slug?: string;
};

// نطبع الداتا بحيث ندعم img أو image + alt افتراضي لو ناقص
const ITEMS: ServiceItem[] = (services as any).map((s: any) => ({
  id: s.id,
  title: s.title,
  image: (s.image ?? s.img) as string | StaticImageData,
  alt: s.alt ?? s.title,
  slug: s.slug,
}));

export default function Services() {
  return (
    <section id="servizi" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <motion.h2
        variants={fadeUp()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-2xl font-bold md:text-3xl"
      >
        I nostri servizi principali
      </motion.h2>

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {ITEMS.map((s, i) => (
          <motion.a
            key={s.id ?? s.slug ?? s.title ?? i}
            href="#preventivo"
            variants={scaleIn}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {/* صورة ريسبونسف خفيفة بـ next/image */}
            <div className="relative h-40 w-full">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
              />
            </div>

            {/* Overlay خفيف + عنوان */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 p-4">
              <h3 className="text-lg font-semibold">{s.title}</h3>
            </div>

            {/* خط سفلي يتسحب وقت الهوفر */}
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--brand)] transition-all duration-300 group-hover:w-full" />
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
