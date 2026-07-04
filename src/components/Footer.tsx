import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6 pt-16">
      <div className="flex flex-col items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/70 px-6 py-3 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-bold">
            B
          </span>
          <span className="text-[13px] font-semibold tracking-[0.18em] text-blue-600">
            BLOGZ
          </span>
        </Link>

        <p className="text-xs text-slate-500">
          © {year} Blogz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}