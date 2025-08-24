"use client";
import { useState } from "react";
import { generateQuotePDF } from "@/lib/pdf";
import {
  computeQuote,
  PRICES,
  type MaterialKey,
  type FinishKey,
} from "@/lib/pricing";

export default function Quote() {
  const [material, setMaterial] = useState<MaterialKey>("piastrella");
  const [finish, setFinish] = useState<FinishKey>("standard");
  const [mq, setMq] = useState<number>(20);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { pricePerMq, baseTotal, vat, total } = computeQuote({
      material,
      finish,
      mq,
      client: { name, email, phone, city },
    });

    generateQuotePDF(
      {
        name: "IL PERFETTO • Impresa Edile SRL",
        piva: "13500800969",
        address: "Via Giacomo Puccini, 60 — 20099 Sesto San Giovanni (MI)",
        email: "ayaddev99@gmail.com",
        phone: "+39 329 689 5007",
      },
      { name, email, phone, city },
      { material, finish, mq, pricePerMq, baseTotal, vat, total }
    );
  }

  return (
    <section id="preventivo" className="mx-auto max-w-3xl px-4 py-14">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Richiedi Preventivo
      </h2>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        {/* نوع الأرضية */}
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value as MaterialKey)}
          className="sm:col-span-2 rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        >
          <option value="piastrella">
            Piastrelle — {PRICES.piastrella.standard}/
            {PRICES.piastrella.premium} €/mq
          </option>
          <option value="ceramica">
            Ceramica — {PRICES.ceramica.standard}/{PRICES.ceramica.premium} €/mq
          </option>
          <option value="parquet">
            Parquet — {PRICES.parquet.standard}/{PRICES.parquet.premium} €/mq
          </option>
        </select>

        {/* الفئة */}
        <select
          value={finish}
          onChange={(e) => setFinish(e.target.value as FinishKey)}
          className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        >
          <option value="standard">
            Standard — {PRICES[material].standard} €/mq
          </option>
          <option value="premium">
            Premium — {PRICES[material].premium} €/mq
          </option>
        </select>

        <input
          type="number"
          min={1}
          value={mq}
          onChange={(e) => setMq(Math.max(1, Number(e.target.value)))}
          placeholder="Metri quadri (mq)"
          className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        />
        <input
          placeholder="Nome e Cognome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        />
        <input
          placeholder="Telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        />
        <input
          placeholder="Città"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-md bg-[var(--brand)] px-6 py-3 font-semibold text-black hover:opacity-90"
        >
          Scarica PDF Preventivo
        </button>
      </form>
    </section>
  );
}
