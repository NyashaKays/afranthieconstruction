import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { ContinentMark } from "./Seal";
import { CONTACT } from "../lib/site";

type QuoteBannerProps = {
  heading?: string;
  body?: string;
};


export default function QuoteBanner({
  heading = "Tell us about your project.",
  body = "Send the site, the scope and a rough timeline. You get back a written, itemised quotation — nothing hidden.",
}: QuoteBannerProps) {
  const primaryTel = CONTACT.phones[0].replace(/\s/g, "");

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      <Reveal className="relative overflow-hidden bg-ink px-6 py-12 text-white lg:px-14 lg:py-16">
        <div className="absolute inset-3 border border-white/15" aria-hidden />
        <div className="absolute left-0 top-0 h-full w-1 bg-signal" aria-hidden />
        <ContinentMark
          size={340}
          className="pointer-events-none absolute -right-10 -bottom-16 text-white/[0.06]"
        />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl text-white sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sky-ink">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-signal px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-signal-deep"
            >
              Request a quote
              <ArrowRight size={17} />
            </Link>
            <a
              href={`tel:${primaryTel}`}
              className="inline-flex items-center justify-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              <Phone size={16} />
              {CONTACT.phones[0]}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
