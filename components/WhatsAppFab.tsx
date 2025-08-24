"use client";
import { memo } from "react";

type Props = {
  phone?: string;
  message?: string;
  position?: "right" | "left";
  label?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
};

const SIZES = {
  sm: { btn: "h-12 w-12", icon: "h-6 w-6" },
  md: { btn: "h-14 w-14", icon: "h-8 w-8" },
  lg: { btn: "h-16 w-16", icon: "h-9 w-9" },
};

function encode(s?: string) {
  return s ? encodeURIComponent(s) : "";
}

function WhatsAppFabBase({
  phone = "393296895007",
  message = "Salve! Vorrei un preventivo per il mio pavimento.",
  position = "right",
  label = "Chat su WhatsApp",
  size = "md",
  pulse = true,
}: Props) {
  const dim = SIZES[size] ?? SIZES.md;
  const href = `https://wa.me/${phone}?text=${encode(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={[
        "fixed bottom-4 z-50 grid place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition",
        "hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/60",
        position === "right" ? "right-4" : "left-4",
        dim.btn,
      ].join(" ")}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`${dim.icon} overflow-visible shrink-0`}
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="11" fill="white" opacity="0.12" />
        <path
          fill="currentColor"
          d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0 11.93 11.93 0 0 0 2.1 17.6L0 24l6.58-2.07a12 12 0 0 0 5.48 1.39h.01A11.93 11.93 0 0 0 24 11.95a11.86 11.86 0 0 0-3.48-8.47Zm-8.46 19.02a9.5 9.5 0 0 1-4.85-1.33l-.35-.2-3.9 1.23 1.27-3.76-.23-.39a9.5 9.5 0 1 1 8.06 4.45Zm5.46-7.1c-.3-.16-1.77-.87-2.04-.97s-.47-.15-.66.15-.76.97-.93 1.17-.34.22-.63.08a7.73 7.73 0 0 1-2.27-1.4 8.51 8.51 0 0 1-1.58-1.96c-.17-.3 0-.46.13-.62.13-.15.3-.39.45-.58s.22-.33.34-.55.06-.41-.03-.58-.66-1.6-.9-2.2c-.24-.58-.48-.5-.66-.5h-.56a1.07 1.07 0 0 0-.77.36c-.26.28-1 1-1 2.42s1.03 2.8 1.17 2.99 2.03 3.1 4.91 4.34a16.79 16.79 0 0 0 1.66.61c.7.22 1.33.19 1.83.12.56-.08 1.77-.72 2.02-1.42s.25-1.3.17-1.43-.27-.22-.57-.38Z"
        />
      </svg>

      {pulse && (
        <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/30 motion-safe:animate-ping" />
      )}

      <span className="sr-only">{label}</span>
    </a>
  );
}

export default memo(WhatsAppFabBase);
