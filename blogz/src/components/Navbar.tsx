"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4">
      <div className="flex items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/70 px-5 py-2.5 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            B
          </span>
          <span className="text-[15px] font-semibold tracking-[0.18em] text-blue-600">
            BLOGZ
          </span>
        </Link>

        {onPosts && (
          <div className="hidden items-center gap-2 md:flex">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter value={category} onChange={setCategory} />
          </div>
        )}

        <div className="flex items-center gap-1 text-sm font-medium">
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
      </div>
    </nav>
  );
}
