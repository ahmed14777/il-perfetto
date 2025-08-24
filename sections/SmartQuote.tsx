"use client";
import { useMemo, useState, useId } from "react";
import { adviseMaterial, computeQuote, type Inputs } from "@/lib/advisor";
import { generateQuotePDF } from "@/lib/pdf";

/** Tooltip بسيط: يظهر مع hover + focus-within (مفيد للموبايل) */
function Tooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const tid = useId();
  return (
    <div className="relative group" aria-describedby={tid}>
      {children}
      <span
        id={tid}
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </div>
  );
}

export default function SmartQuote() {
  const [form, setForm] = useState<Inputs>({
    room: "bagno",
    mq: 15,
    wetArea: true,
    traffic: "med",
    underfloorHeat: false,
    budget: "medio",
    distanzaKm: 15,
    removeOldFloor: false,
  });

  const advice = useMemo(() => adviseMaterial(form), [form]);
  const result = useMemo(() => computeQuote(form, advice), [form, advice]);

  const onPDF = () => {
    generateQuotePDF(
      {
        name: "IL PERFETTO • Impresa Edile SRL",
        piva: "13500800969",
        address: "Via Giacomo Puccini, 60 — 20099 Sesto San Giovanni (MI)",
        email: "info@ilperfetto.it",
        phone: "+39 329 689 5007",
        website: "ilperfetto.it",
      },
      { name: "Cliente", email: "", phone: "", city: "" },
      {
        material:
          advice.material === "parquet_laminato"
            ? ("parquet" as any)
            : (advice.material as any),
        finish: advice.finish,
        mq: form.mq,
        pricePerMq: result.pricePerMq,
        baseTotal: result.baseTotal,
        vat: result.vat,
        total: result.total,
      }
    );
  };

  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h2 className="text-center text-2xl font-bold md:text-3xl">
        Preventivo Intelligente
      </h2>

      {/* المدخلات */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* ambiente */}
        <Tooltip text="Scegli l'ambiente principale del lavoro">
          <select
            value={form.room}
            onChange={(e) => set("room", e.target.value as any)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
          >
            <option value="bagno">Bagno</option>
            <option value="cucina">Cucina</option>
            <option value="soggiorno">Soggiorno</option>
            <option value="scala">Scala</option>
            <option value="esterno">Esterno</option>
          </select>
        </Tooltip>

        {/* superficie */}
        <Tooltip text="Inserisci la superficie totale in metri quadri (es. 30)">
          <input
            type="number"
            min={1}
            value={form.mq}
            onChange={(e) => set("mq", Number(e.target.value))}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
            placeholder="Metri quadri (mq) — es. 30"
          />
        </Tooltip>

        {/* budget */}
        <Tooltip text="Indicativo: Basso, Medio, Alto per guidare il consiglio">
          <select
            value={form.budget}
            onChange={(e) => set("budget", e.target.value as any)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
          >
            <option value="basso">Budget Basso</option>
            <option value="medio">Budget Medio</option>
            <option value="alto">Budget Alto</option>
          </select>
        </Tooltip>

        {/* traffico/uso */}
        <Tooltip text="Livello di utilizzo previsto della superficie">
          <select
            value={form.traffic}
            onChange={(e) => set("traffic", e.target.value as any)}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
          >
            <option value="low">Uso Basso</option>
            <option value="med">Uso Medio</option>
            <option value="high">Uso Alto</option>
          </select>
        </Tooltip>

        {/* area umida */}
        <Tooltip text="Spunta se è presente acqua/umidità (doccia, bagno, esterno)">
          <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-3">
            <input
              type="checkbox"
              checked={form.wetArea}
              onChange={(e) => set("wetArea", e.target.checked)}
            />
            Area Umida?
          </label>
        </Tooltip>

        {/* riscaldamento */}
        <Tooltip text="Spunta se c'è riscaldamento a pavimento">
          <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-3">
            <input
              type="checkbox"
              checked={form.underfloorHeat}
              onChange={(e) => set("underfloorHeat", e.target.checked)}
            />
            Riscaldamento a Pavimento?
          </label>
        </Tooltip>

        {/* distanza */}
        <Tooltip text="Distanza del cantiere in km — incide sui costi di trasferta">
          <input
            type="number"
            min={0}
            value={form.distanzaKm ?? 0}
            onChange={(e) => set("distanzaKm", Number(e.target.value))}
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 outline-none"
            placeholder="Distanza (km) — es. 15"
          />
        </Tooltip>

        {/* rimozione pavimento */}
        <Tooltip text="Spunta se dobbiamo rimuovere la pavimentazione esistente">
          <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-3">
            <input
              type="checkbox"
              checked={form.removeOldFloor ?? false}
              onChange={(e) => set("removeOldFloor", e.target.checked)}
            />
            Rimozione pavimento esistente
          </label>
        </Tooltip>
      </div>

      {/* النتيجة */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-2 text-lg font-semibold">Consiglio Materiale</h3>
          <p className="text-neutral-300">
            Materiale suggerito:{" "}
            <span className="font-semibold capitalize">
              {advice.material.replace("_", " ")} — {advice.finish}
            </span>
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-400">
            {advice.notes.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-2 text-lg font-semibold">Riepilogo Costi</h3>
          <div className="space-y-2 text-sm text-neutral-300">
            <div className="flex justify-between">
              <span>Base (€/mq × {form.mq} mq)</span>
              <span>€ {Math.round(result.baseTotal)}</span>
            </div>

            {result.extras.map((e, i) => (
              <div className="flex justify-between" key={i}>
                <span>{e.label}</span>
                <span>€ {Math.round(e.amount)}</span>
              </div>
            ))}

            <div className="mt-2 h-px bg-white/10" />

            <div className="flex justify-between font-semibold">
              <span>Subtotale</span>
              <span>€ {Math.round(result.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (22%)</span>
              <span>€ {Math.round(result.vat)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[var(--brand)]">
              <span>Totale</span>
              <span>€ {Math.round(result.total)}</span>
            </div>
          </div>

          <button
            onClick={onPDF}
            className="mt-5 w-full rounded-md bg-[var(--brand)] px-5 py-3 font-semibold text-black hover:opacity-90"
          >
            Scarica PDF
          </button>
        </div>
      </div>
    </section>
  );
}
