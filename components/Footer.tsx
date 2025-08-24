export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-br from-black/80 to-neutral-900/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-sm text-neutral-400 md:flex-row md:px-6">
        {/* Logo + Company */}
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-xs font-bold">
            P
          </div>
          <span className="font-medium text-neutral-200">
            IL PERFETTO • Impresa Edile SRL
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4">
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="/cookie" className="hover:text-white transition-colors">
            Cookie
          </a>
          <span className="hidden md:inline">•</span>
          <span>P.IVA 13500800969</span>
        </div>
      </div>
    </footer>
  );
}
