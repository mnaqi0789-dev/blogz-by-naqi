"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Posts", href: "/posts" },
    { label: "Admin", href: "/admin" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between",
          "rounded-full border border-neutral-200/80 bg-white/70 pl-2 pr-2",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]",
          "backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
        )}
      >
        {/* Left: logo + brand */}
        <Link
          href="/"
          className="flex items-center gap-3 pl-1 pr-3"
          aria-label="BLOGZ — Home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
            {/* Replace src with your logo file in /public */}
            <Image
              src="/logo.svg"
              alt=""
              width={20}
              height={20}
              className="invert"
              priority
            />
          </span>
          <span className="text-[15px] font-semibold tracking-[0.18em] text-neutral-900">
            BLOGZ
          </span>
        </Link>

        {/* Right: links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
