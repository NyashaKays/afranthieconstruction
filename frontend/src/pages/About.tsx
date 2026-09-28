import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import TitleBlock from "../components/TitleBlock";
import QuoteBanner from "../components/QuoteBanner";
import { CONTACT, PROCESS } from "../lib/site";
import { PHOTOS } from "../lib/photos";

export default function About() {
  return (
    <div>
      <PageHeader
        sheet="02"
        page="About"
        title="A contracting firm built around the frame."
        lead="Afranthie Construction Engineers works across structural steel fabrication, house construction and property renovation from a base in Bluffhill, Harare. The point of difference is simple: the people who weld the steel are the people who run the build."
        fields={[{ label: "Base", value: "Bluffhill, Harare" }]}
      />

      {/* Who we are */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <Reveal variant="frame" className="flex flex-col">
            <div className="board-frame p-1.5 lg:p-2">
              <img
                src={PHOTOS.aboutSettingOut}
                alt="An engineer marking up a drawing with a scale rule"
                width="1100"
                height="825"
                className="h-80 w-full object-cover lg:h-[26rem]"
                loading="lazy"
              />
            </div>
            <p className="sheet-label mt-3 text-graphite-soft">
              Fig. 1 — Setting out from the drawing
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-2xl sm:text-3xl">Who we are</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-graphite">
              <p>
                We are a hands-on team of fabricators and builders. On one site
                that means portal frames, trusses and site welding; on the next
                it means foundations, brickwork, a roof and the finishes over it.
              </p>
              <p>
                Keeping both trades in one team is deliberate. The frame is set
                knowing what the roof, the gates and the veranda screens need
                from it, and the steelwork stays with the team that priced the
                job rather than being passed down the line.
              </p>
              <p>
                The office is in Bluffhill, Harare. The same people who quote the
                job are on site while it is built.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision — ink band */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-10 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-18">
          {[
            {
              k: "Mission",
              t: "Deliver construction and steelwork that stands up to the drawing and the deadline.",
              b: "Every job is quoted honestly, built to standard, and checked before it is handed over.",
            },
            {
              k: "Vision",
              t: "Be the contractor Zimbabwean clients trust with the whole build.",
              b: "Known for structural rigour on the big work and care on the small work, without changing teams between them.",
            },
          ].map((item, i) => (
            <Reveal
              key={item.k}
              delay={(i + 1) as 1 | 2}
              className="border-t-2 border-signal pt-5"
            >
              <span className="sheet-label text-sky-ink">{item.k}</span>
              <h3 className="mt-3 text-xl leading-snug text-white sm:text-2xl">
                {item.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-sky-ink">{item.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 lg:px-8 lg:pt-16 lg:pb-12">
        <Reveal className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl">How a job runs</h2>
          <p className="mt-4 text-base leading-relaxed text-graphite">
            Four stages, the same on a carport and on a contract build.
          </p>
        </Reveal>

        <Reveal
          variant="rows"
          className="mt-9 border-t border-l-2 border-t-hair-strong border-l-ink pl-4 sm:pl-7"
        >
          {PROCESS.map((step) => (
            <div
              key={step.ref}
              className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-hair py-6 sm:grid-cols-[5rem_1fr] sm:gap-x-8"
            >
              <span className="font-mono text-sm font-medium text-signal">
                {step.ref}
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink-deep">{step.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-graphite">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-6xl px-5 pb-2 lg:px-8">
        <Reveal>
          <TitleBlock sheet="02.1" page="Leadership" />
          <div className="flex flex-col gap-5 border border-t-0 border-hair-strong bg-mount p-6 sm:flex-row sm:items-center sm:gap-8 lg:p-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-ink font-display text-lg font-black tracking-widest text-white">
              AG
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-deep">
                {CONTACT.lead.name}
              </h2>
              <p className="mt-1 font-mono text-xs font-medium tracking-widest text-signal uppercase">
                {CONTACT.lead.role}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
                Your first point of contact for quotations, site visits and
                project updates — a person, not a queue.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <QuoteBanner
        heading="Talk to the team that does the whole build."
        body="Book a site visit and we will walk the ground with you before anything is priced."
      />
    </div>
  );
}
