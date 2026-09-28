import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import QuoteBanner from "../components/QuoteBanner";
import { SERVICES } from "../lib/site";

export default function Services() {
  return (
    <div>
      <PageHeader
        sheet="03"
        page="Services"
        title="Schedule of works."
        lead="The eight trades Afranthie covers, from heavy structural steel to the last coat of paint. Most projects draw on several — all quoted on one sheet, all run by one team."
        fields={[{ label: "Items", value: "S-01 – S-08" }]}
      />

      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="border-t border-l-2 border-t-hair-strong border-l-ink pl-4 sm:pl-8">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.ref}
              variant={i % 2 === 0 ? "rise" : "frame"}
              className="grid gap-6 border-b border-hair-strong py-8 md:grid-cols-2 md:items-center md:gap-10 lg:py-10"
            >
              <div
                className={`board-frame p-1.5 ${i % 2 === 1 ? "md:order-2" : ""}`}
              >
                <img
                  src={s.scene}
                  alt={s.sceneAlt}
                  width="900"
                  height="600"
                  className="h-56 w-full object-cover sm:h-64 md:h-72"
                  loading={i < 2 ? "eager" : "lazy"}
                />
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-sm font-medium text-signal">
                  {s.ref}
                </span>
                <h2 className="mt-2 text-2xl sm:text-[1.75rem]">{s.title}</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-graphite">
                  {s.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {s.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5 text-sm text-graphite">
                      <Check size={16} className="mt-0.5 shrink-0 text-signal" />
                      {inc}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-signal hover:text-signal-deep"
                >
                  Request a quote
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <QuoteBanner
        heading="Have a project that spans a few of these?"
        body="That is the usual case. Send the scope and we will price the whole schedule on one sheet."
      />
    </div>
  );
}
