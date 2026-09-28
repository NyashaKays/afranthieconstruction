import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { NAV } from "../lib/site";

export default function NotFound() {
  return (
    <div>
      <PageHeader
        sheet="404"
        page="Not found"
        title="Sheet not found."
        lead="The page you asked for isn't on the drawing. It may have moved, or the link was mistyped."
        fields={[{ label: "Status", value: "404" }]}
      />

      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-signal px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-signal-deep"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>

        <ul className="mt-10 border-t border-l-2 border-t-hair-strong border-l-ink pl-4 sm:pl-7">
          {NAV.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-baseline gap-3 border-b border-hair py-4 text-base font-semibold text-graphite hover:text-signal"
              >
                <span className="font-mono text-xs text-graphite-soft">{item.sheet}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
