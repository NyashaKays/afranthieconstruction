import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import logo from "../assets/Afranthie-Logo.png";
import { CONTACT, NAV, SERVICES } from "../lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const waHref = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* Title-block header strip */}
        <div className="flex flex-col items-start gap-3 border-x border-b border-hair-strong bg-mount px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <img
            src={logo}
            alt="Afranthie Construction Engineers"
            width="300"
            height="194"
            className="h-16 w-auto"
          />
          <p className="font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-graphite-soft uppercase">
            Production is our goal
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-10 border-x border-hair-strong bg-mount px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="sheet-label text-graphite-soft">The firm</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-graphite">
              Structural steel welding and full house construction under one
              roof, in Harare, Zimbabwe.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="sheet-label text-graphite-soft">Pages</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold">
              {NAV.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex items-baseline gap-2 text-graphite hover:text-signal"
                  >
                    <span className="font-mono text-[0.625rem] text-graphite-soft">
                      {item.sheet}
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="sheet-label text-graphite-soft">Trades</h2>
            <ul className="mt-3 space-y-2 text-sm text-graphite">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.ref} className="flex gap-2">
                  <span className="font-mono text-[0.625rem] text-graphite-soft">
                    {s.ref}
                  </span>
                  <span>{s.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic">
            <h2 className="sheet-label text-graphite-soft">Contact</h2>
            <ul className="mt-3 space-y-3 text-sm text-graphite">
              <li className="flex gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-ink" />
                <span>{CONTACT.addressLines.join(", ")}</span>
              </li>
              {CONTACT.phones.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <Phone size={16} className="mt-0.5 shrink-0 text-ink" />
                  <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-signal">
                    {p}
                  </a>
                </li>
              ))}
              <li className="flex gap-2.5">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-ink" />
                <a href={waHref} className="hover:text-signal">
                  WhatsApp
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-ink" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-signal">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-x border-b border-hair-strong bg-mount px-4 py-4 font-mono text-[0.6875rem] text-graphite-soft">
          <span>
            © {year} Afranthie Construction Engineers
          </span>
          <span>
            {CONTACT.lead.role}: {CONTACT.lead.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
