"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search posts...",
  className = "w-56 focus:w-72",
}: Props) {
  return (
    <div className="relative flex items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-9 rounded-full border border-slate-200 bg-white/80 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 ${className}`}
      />
    </div>
  );
}