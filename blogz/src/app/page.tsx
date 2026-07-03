import Image from "next/image";
import Link from "next/link";
import banner from "@/assets/real-banner.png";

export default function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-5xl grid-cols-1 items-center gap-12 px-6 py-8 lg:grid-cols-12 lg:gap-8">
      {/* Left column — copy */}
      <div className="flex flex-col justify-center lg:col-span-7">
        <div className="inline-flex w-fit items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-blue-600" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            Blogz &middot; Read. Think. Write.
          </span>
        </div>

        <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Stories worth
          <br />
          your <span className="font-medium text-blue-600">quiet</span> mornings
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500">
          A calm corner of the internet for essays on finance and technology
          — hand-picked, thoughtfully written, always ad-free.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/posts"
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-xs font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Start reading
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-6 text-xs font-semibold tracking-wide text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Say hello
          </Link>
        </div>

        <div className="mt-10 flex items-center gap-8 border-t border-slate-100 pt-6">
          <Stat value="120+" label="Essays" />
          <span className="h-8 w-px bg-slate-200" />
          <Stat value="2" label="Categories" />
          <span className="h-8 w-px bg-slate-200" />
          <Stat value="Weekly" label="New drops" accent />
        </div>
      </div>

      {/* Right column — banner image */}
      <div className="relative flex w-full justify-center lg:col-span-5 lg:justify-end">
        <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-blue-100/50 via-transparent to-transparent blur-2xl" />

        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-[0_20px_45px_-18px_rgba(37,99,235,0.2)]">
          <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-slate-50">
            <Image
              src={banner}
              alt="A reader's desk with books and blue flowers"
              fill
              priority
              sizes="(min-width: 1024px) 320px, 60vw"
              className="object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-serif text-xl font-light ${accent ? "text-blue-600" : "text-slate-900"}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}
