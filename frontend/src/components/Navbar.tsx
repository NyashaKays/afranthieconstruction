import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Seal from "./Seal";
import { NAV } from "../lib/site";

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Afranthie Construction Engineers — home">
      <Seal size={26} className="text-ink shrink-0" />
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-black tracking-[0.06em] text-ink">
          AFRANTHIE
        </span>
        <span className="mt-0.5 block font-mono text-[0.5625rem] font-medium tracking-[0.22em] text-signal">
          CONSTRUCTION ENGINEERS
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-hair-strong bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:grid md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="md:justify-self-start">
          <Wordmark />
        </div>

        <nav className="hidden items-center gap-1 md:flex md:justify-self-center">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "group relative px-3 py-2 text-sm font-semibold transition-colors",
                  isActive ? "text-ink" : "text-graphite hover:text-ink",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span className="mr-1.5 font-mono text-[0.625rem] font-medium text-graphite-soft">
                    {item.sheet}
                  </span>
                  {item.name}
                  <span
                    className={[
                      "absolute inset-x-3 -bottom-px h-0.5 origin-left bg-signal transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    ].join(" ")}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden bg-signal px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-signal-deep md:inline-flex md:items-center md:justify-self-end"
        >
          Request a quote
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hair-strong bg-paper md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-baseline gap-3 border-b border-hair py-3.5 text-base font-semibold",
                    isActive ? "text-ink" : "text-graphite",
                  ].join(" ")
                }
              >
                <span className="font-mono text-xs text-graphite-soft">{item.sheet}</span>
                {item.name}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="mt-4 mb-2 inline-flex items-center justify-center bg-signal px-4 py-3 text-sm font-bold text-white"
            >
              Request a quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
