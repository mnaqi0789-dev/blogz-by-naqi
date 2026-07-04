import Image from "next/image";
import Link from "next/link";
import banner from "@/assets/banner-v3.png";

export default function HomePage() {
  return (
    <section className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-32 lg:grid-cols-12 lg:gap-10 lg:pt-24">
      <div className="flex flex-col justify-center lg:col-span-7">
        <div className="inline-flex w-fit items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Blogz &middot; Read. Think. Write.
          </span>
        </div>

        <h1 className="mt-6 font-serif text-5xl font-normal leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
          Stories worth
          <br />
          your <span className="font-medium text-blue-600">quiet</span> mornings
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-500">
          A calm corner of the internet for essays on finance and technology
          — hand-picked, thoughtfully written, always ad-free.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/posts"
            className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-7 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Start reading
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-7 text-sm font-semibold tracking-wide text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Say hello
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-10 border-t border-slate-100 pt-7">
          <Stat value="120+" label="Essays" />
          <span className="h-9 w-px bg-slate-200" />
          <Stat value="2" label="Categories" />
          <span className="h-9 w-px bg-slate-200" />
          <Stat value="Weekly" label="New drops" accent />
        </div>
      </div>

      <div className="relative flex w-full justify-center lg:col-span-5 lg:justify-end">
        <div className="absolute inset-0 -z-10 m-auto h-[85%] w-[85%] rounded-full bg-blue-400/25 blur-[80px]" />

        <div className="relative w-full max-w-md">
          <Image
            src={banner}
            alt="A 3D statue of Lady Justice surrounded by books and flowers"
            width={520}
            height={520}
            priority
            sizes="(min-width: 1024px) 420px, 85vw"
            className="h-auto w-full object-contain drop-shadow-[0_25px_45px_rgba(30,64,175,0.25)] transition-transform duration-500 hover:scale-[1.03]"
          />
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
        className={`font-serif text-2xl font-light ${accent ? "text-blue-600" : "text-slate-900"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}