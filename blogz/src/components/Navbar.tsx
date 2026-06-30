"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/posts", label: "Posts" },
  { href: "/admin", label: "Admin" },
  { href: "/contact", label: "Contact" },
];

function Logo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
      <span className="font-serif text-xl font-bold text-blue-700">B</span>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4">
      <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/85 px-5 py-3 shadow-sm backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <Logo />

          <span className="text-sm font-semibold tracking-[0.22em] text-blue-800">
            BLOGZ
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
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
