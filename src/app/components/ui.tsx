"use client";

import { useState } from "react";
import type { ComponentProps } from "react";

/** Concatenador sencillo de clases */
export function cn(...a: Array<string | undefined | null | false>) {
  return a.filter(Boolean).join(" ");
}

/* ---------- INPUT ---------- */
type BaseProps = {
  label?: string;
  error?: string;
  className?: string;
};

export function Input({
  label,
  error,
  className,
  ...props
}: BaseProps & ComponentProps<"input">) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      )}
      <input
        {...props}
        className={cn(
          "h-11 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 text-white outline-none transition focus:border-neutral-500",
          "placeholder:text-neutral-500",
          className
        )}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

/* ---------- PASSWORD INPUT ---------- */
export function PasswordInput({
  label,
  error,
  className,
  ...props
}: BaseProps & ComponentProps<"input">) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      )}
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={cn(
            "h-11 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 pr-24 text-white outline-none transition focus:border-neutral-500",
            "placeholder:text-neutral-500",
            className
          )}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-1 top-1.5 h-8 rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-sm text-neutral-200 hover:bg-neutral-700"
        >
          {show ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

/* ---------- BUTTON ---------- */
export function Button({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white px-4 font-semibold text-black",
        "transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    />
  );
}
