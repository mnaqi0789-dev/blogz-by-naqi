"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { useFilterStore } from "@/store/filterStore";

const navLinks = [
  { href: "/posts", label: "Posts" },
  { href: "/admin", label: "Admin" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const onPosts = pathname === "/posts" || pathname.startsWith("/posts/");
  const search = useFilterStore((state) => state.search);
  const setSearch = useFilterStore((state) => state.setSearch);
  const category = useFilterStore((state) => state.activeCategory);
  const setCategory = useFilterStore((state) => state.setCategory);
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4">
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl md:rounded-full">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              B
            </span>
            <span className="text-[15px] font-semibold tracking-[0.18em] text-blue-600">
              BLOGZ
            </span>
          </Link>

          {onPosts && (
            <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
              <SearchBar value={search} onChange={setSearch} />
              <CategoryFilter value={category} onChange={setCategory} />
            </div>
          )}

          <div className="hidden items-center gap-1 text-sm font-medium md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-4 pb-4 pt-4 md:hidden">
            {onPosts && (
              <div className="flex flex-col gap-2">
                <SearchBar value={search} onChange={setSearch} className="w-full focus:w-full" />
                <CategoryFilter value={category} onChange={setCategory} fullWidth />
              </div>
            )}

            <div className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-2.5 transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}