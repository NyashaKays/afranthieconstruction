import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import TitleBlock from "../components/TitleBlock";
import QuoteBanner from "../components/QuoteBanner";
import { SERVICES } from "../lib/site";
import { PHOTOS } from "../lib/photos";

export default function Home() {
  return (
    <div>
      {/* ── Sheet 01 · Hero board ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pt-6 lg:px-8 lg:pt-10">
        <div className="board-frame p-1.5 lg:p-2">
          <img
            src={PHOTOS.hero}
            alt="Structural steel roof framing against an open sky"
            width="1800"
            height="1013"
            className="h-[40vh] min-h-[280px] w-full object-cover object-center lg:h-[52vh]"
            fetchPriority="high"
          />
        </div>

        <Reveal className="relative z-10 -mt-6 bg-ink px-6 py-9 text-white sm:px-9 lg:-mt-12 lg:px-14 lg:py-14">
          <div className="grid gap-7 lg:grid-cols-[1.65fr_1fr] lg:items-end lg:gap-12">
            <div>
              <h1 className="text-[2.15rem] leading-[1.04] text-white sm:text-[2.9rem] lg:text-[3.35rem]">
                One team fabricates the steel and builds the house.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-sky-ink lg:text-[1.0625rem]">
                Afranthie Construction Engineers runs structural welding and full
                construction under one roof — from the frame to the final coat of
                paint, answering to one contractor.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:pb-1.5">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-signal px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-signal-deep"
              >
                Request a quote
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 border border-white/45 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                See the eight trades
              </Link>
            </div>
          </div>
        </Reveal>

        <TitleBlock
          sheet="01"
          page="Home"
          fields={[
            { label: "Location", value: "Harare, Zimbabwe" },
            { label: "Motto", value: "Production is our goal" },
          ]}
          className="mt-3"
        />
      </section>

      {/* ── The whole build, one team · schedule of works ─────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl">The whole build, one schedule</h2>
            <p className="mt-4 text-base leading-relaxed text-graphite">
              Eight trades, one contractor. Most jobs need more than one of
              these — and every line answers to the same team.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-signal hover:text-signal-deep"
          >
            Full services sheet
            <ArrowRight size={16} />
          </Link>
        </Reveal>

        <Reveal
          variant="rows"
          className="mt-10 border-t border-l-2 border-t-hair-strong border-l-ink pl-4 sm:pl-7"
        >
          {SERVICES.map((s) => (
            <Link
              key={s.ref}
              to="/services"
              className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b border-hair py-5 transition-colors hover:bg-mount sm:grid-cols-[4rem_18rem_1fr] sm:gap-x-6 sm:py-6"
            >
              <span className="font-mono text-sm font-medium text-signal">
                {s.ref}
              </span>
              <h3 className="col-start-2 text-lg font-bold text-ink-deep sm:text-xl">
                {s.title}
              </h3>
              <p className="col-span-2 col-start-2 mt-1.5 max-w-xl text-sm leading-relaxed text-graphite-soft sm:col-span-1 sm:col-start-3 sm:mt-0">
                {s.summary}
              </p>
              <ArrowUpRight
                size={16}
                className="col-start-2 mt-2 text-hair-strong transition-colors group-hover:text-signal sm:hidden"
              />
            </Link>
          ))}
        </Reveal>
      </section>

      {/* ── Approach ─────────────────────────────────────────── */}
      <section className="border-y border-hair-strong bg-mount">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
          <Reveal>
            <h2 className="max-w-xl text-2xl sm:text-3xl">
              Why the single-contractor build holds up
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-x-12 gap-y-9 sm:grid-cols-3">
            {APPROACH.map((a, i) => (
              <Reveal
                key={a.title}
                delay={(i + 1) as 1 | 2 | 3}
                className="border-t-2 border-ink pt-4"
              >
                <h3 className="text-lg font-bold text-ink-deep">{a.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-graphite">
                  {a.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two audiences ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <h2 className="max-w-2xl text-3xl sm:text-4xl">
            Built for the plot and for the portfolio
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {AUDIENCES.map((aud, i) => (
            <Reveal
              key={aud.title}
              variant="frame"
              delay={(i + 1) as 1 | 2}
              className="flex flex-col border border-hair-strong bg-mount"
            >
              <img
                src={aud.img}
                alt={aud.alt}
                width="900"
                height="600"
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <div className="flex grow flex-col p-6 sm:p-7">
                <h3 className="text-xl font-bold text-ink-deep">{aud.title}</h3>
                <p className="mt-2 grow text-sm leading-relaxed text-graphite">
                  {aud.body}
                </p>
                <Link
                  to={aud.to}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-signal-deep"
                >
                  {aud.cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <QuoteBanner />
    </div>
  );
}

const APPROACH = [
  {
    title: "One quotation, one invoice",
    body: "The steel and the building sit on the same itemised quote. No gap between trades for a cost to hide in.",
  },
  {
    title: "The frame and the finish agree",
    body: "Because the fabricators and the builders are the same team, the frame is set for the roof, the screens and the gates that follow.",
  },
  {
    title: "Checked stage by stage",
    body: "Each stage is signed off before the next starts, so a problem is found at the slab, not at handover.",
  },
];

const AUDIENCES = [
  {
    title: "For homeowners",
    img: PHOTOS.audienceHomeowner,
    alt: "A completed contemporary house at dusk",
    body: "A house from foundation to final coat, plus the gate, carport, wall and paving around it — quoted and built by one team you can call.",
    cta: "See residential trades",
    to: "/services",
  },
  {
    title: "For developers & businesses",
    img: PHOTOS.audienceDeveloper,
    alt: "Commercial towers under construction with tower cranes against a blue sky",
    body: "Structural steel fabrication and erection, larger builds and contract works, with structural checks at each stage and a written schedule you can hold us to.",
    cta: "Discuss a contract",
    to: "/contact",
  },
];
