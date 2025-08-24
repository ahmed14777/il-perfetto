import dynamic from "next/dynamic";
import SmartQuote from "@/sections/SmartQuote";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
function SectionSkeleton({ className = "" }: { className?: string }) {
  return (
    <section
      className={`mx-auto max-w-7xl px-4 md:px-6 ${className}`}
      aria-hidden
    >
      <div className="animate-pulse">
        <div className="h-8 w-1/3 rounded bg-white/10" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </section>
  );
}

const Gallery = dynamic(() => import("@/sections/Gallery"), {
  ssr: true,
  loading: () => <SectionSkeleton className="py-14" />,
});

const Quote = dynamic(() => import("@/sections/Quote"), {
  ssr: true,
  loading: () => <SectionSkeleton className="py-14" />,
});

const Contact = dynamic(() => import("@/sections/Contact"), {
  ssr: true,
  loading: () => <SectionSkeleton className="py-16" />,
});

import WhatsAppFab from "@/components/WhatsAppFab";

export default function HomePage() {
  return (
    <main id="content" role="main">
      <Hero />
      <Services />
      <Portfolio />
      <Gallery />
      <SmartQuote />
      {/* <Quote /> */}
      <Contact />
      <WhatsAppFab
        phone="393296895007"
        message="Salve! Vorrei un preventivo per pavimenti/ceramica. Possiamo parlarne?"
        position="right"
      />
    </main>
  );
}
