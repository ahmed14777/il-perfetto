"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

const navItems = [
  { id: "home", label: "Home" },
  { id: "servizi", label: "Servizi" },
  { id: "portfolio", label: "Realizzazioni" },
  { id: "preventivo", label: "Preventivo" },
  { id: "contatti", label: "Contatti" },
];

function useScrollSpy(ids: string[], offset = 150) {
  const [active, setActive] = useState<string>(ids[0] || "");
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        { rootMargin: `-${offset}px 0px -50% 0px`, threshold: 0.01 }
      );
      io.observe(el);
      obs.push(io);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [ids, offset]);
  return active;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ids = useMemo(() => navItems.map((n) => n.id), []);
  const active = useScrollSpy(ids, 160);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all",
          "border-b border-white/10 backdrop-blur",
          scrolled
            ? "bg-neutral-950/70 shadow-[0_10px_30px_-20px_rgba(0,0,0,.7)]"
            : "bg-neutral-950/30",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -8, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-2xl font-bold"
            >
              P
            </motion.div>
            <span className="font-semibold text-xl tracking-wide ">
              IL PERFETTO
            </span>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {navItems.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={goTo(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative py-1 transition-colors",
                    isActive ? "text-[var(--brand)]" : "hover:text-white/90",
                  ].join(" ")}
                >
                  <span
                    className="bg-gradient-to-r from-[var(--brand)] to-orange-400 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out"
                    style={{
                      backgroundSize: isActive ? "100% 2px" : undefined,
                    }}
                  >
                    {label}
                  </span>
                </a>
              );
            })}
            <a
              href="#preventivo"
              onClick={goTo("preventivo")}
              className="rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_8px_24px_-10px_rgba(240,120,24,.7)] hover:opacity-95"
            >
              Preventivo Online
            </a>
          </nav>

          {/* Mobile button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
            aria-label="Apri menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
          >
            <div className="mb-1 h-[2px] w-6 bg-white" />
            <div className="mb-1 h-[2px] w-6 bg-white" />
            <div className="h-[2px] w-6 bg-white" />
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="md:hidden border-t border-white/10 bg-black/90"
            >
              <div className="mx-auto max-w-7xl space-y-3 px-4 py-3">
                {navItems.map(({ id, label }) => {
                  const isActive = active === id;
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={goTo(id)}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "block py-2 text-lg transition-colors",
                        isActive ? "text-[var(--brand)]" : "",
                      ].join(" ")}
                    >
                      {label}
                    </a>
                  );
                })}
                <a
                  href="#preventivo"
                  onClick={goTo("preventivo")}
                  className="mt-2 block rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 px-4 py-2 text-center font-semibold text-black"
                >
                  Preventivo Online
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* progress bar (اختياري يُخفى مع Reduce Motion) */}
      {!reduce && (
        <motion.div
          style={{ scaleX }}
          className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-[var(--brand)]"
          aria-hidden
        />
      )}
    </>
  );
}
