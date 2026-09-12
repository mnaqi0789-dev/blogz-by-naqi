"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type Category = "all" | "finance" | "compsci";

const options: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "finance", label: "Finance" },
  { value: "compsci", label: "Computer Science" },
];

type Props = {
  value: Category;
  onChange: (v: Category) => void;
  fullWidth?: boolean;
};

export default function CategoryFilter({ value, onChange, fullWidth = false }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value)?.label ?? "All";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-600 hover:text-blue-600 ${
          fullWidth ? "w-full justify-between" : ""
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-slate-400">Category:</span>
          <span>{current}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-11 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-[0_12px_40px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl ${
            fullWidth ? "left-0 right-0" : "right-0 w-48"
          }`}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {opt.label}
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}