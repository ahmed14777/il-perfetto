"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Contact() {
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    try {
      const data = new FormData(form);
      const res = await fetch(
        "https://formsubmit.co/ajax/ayaddev99@gmail.com",
        {
          method: "POST",
          body: data,
        }
      );

      if (res.ok) {
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus(null), 3000); // hidden after 3 seconds
      } else {
        throw new Error("Errore invio");
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  }

  return (
    <section id="contatti" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* map */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-white/10"
        >
          <iframe
            title="Mappa"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.3349985326063!2d9.224157576730118!3d45.534667330178936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c5ef2e10b5d3%3A0x18e9ff9d64b0f3b!2sVia%20Giacomo%20Puccini%2C%2060%2C%2020099%20Sesto%20San%20Giovanni%20MI%2C%20Italia!5e0!3m2!1sit!2sit!4v1724500000000!5m2!1sit!2sit"
          />
        </motion.div>

        {/*  contact + form */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-xl font-semibold">Contattaci</h3>
          <ul className="mt-4 space-y-2 text-neutral-300">
            <li>
              📞{" "}
              <a href="tel:+393296895007" className="underline">
                +39 329 689 5007
              </a>
            </li>
            <li>
              💬{" "}
              <a href="https://wa.me/393296895007" className="underline">
                WhatsApp
              </a>
            </li>
            <li>
              📧{" "}
              <a href="mailto:ayaddev99@gmail.com" className="underline">
                ayaddev99@gmail.com
              </a>
            </li>
            <li>📮 PEC: ilperfettoedilesrl@pec.it</li>
          </ul>

          {/* FormSubmit with AJAX */}
          <form onSubmit={onSubmit} className="mt-6 grid gap-3">
            <input
              name="name"
              required
              placeholder="Nome e Cognome"
              className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
            />
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Messaggio"
              className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
            />

            <button className="rounded-md bg-[var(--brand)] px-6 py-3 font-semibold text-black hover:opacity-90">
              Invia richiesta
            </button>
          </form>

          {/*  sucess or error /  */}
          {status === "success" && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-green-600 px-4 py-2 text-xl font-medium text-white shadow-lg">
              ✅ successo
            </div>
          )}
          {status === "error" && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-red-600 px-4 py-2 text-sm text-white shadow-lg">
              ❌ RIPROVA ANCORA
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
