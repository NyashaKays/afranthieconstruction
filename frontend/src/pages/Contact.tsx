import { useEffect, useRef, useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, Check, AlertTriangle, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { CONTACT, SERVICES } from "../lib/site";
import { primeCsrf, submitContact } from "../lib/api";

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "email" | "service" | "message", string>>;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Prime the CSRF cookie/token as soon as the page loads.
  useEffect(() => {
    void primeCsrf();
  }, []);

  useEffect(() => {
    if (status !== "sent") return;
    closeBtnRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setStatus("idle");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      service: String(data.get("service") || "").trim(),
      message: String(data.get("message") || "").trim(),
      company: String(data.get("company") || ""), // honeypot
    };

    setStatus("sending");
    setErrorMsg("");
    setFieldErrors({});

    const result = await submitContact(payload);

    if (result.ok) {
      setStatus("sent");
      form.reset();
      return;
    }

    if (result.errors) {
      const known = ["name", "phone", "email", "service", "message"] as const;
      const next: FieldErrors = {};
      for (const key of known) {
        const list = result.errors[key];
        if (list?.length) next[key] = list[0]?.message ?? "Please check this field.";
      }
      setFieldErrors(next);
    }
    setErrorMsg(
      result.detail ||
        "We couldn't send your request. Please check the form, or email us directly.",
    );
    setStatus("error");
  }

  const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hello Afranthie, I would like a quote for ",
  )}`;

  const fieldClass =
    "w-full border border-hair-strong bg-paper px-3.5 py-3 text-sm text-graphite transition-colors focus:border-ink focus:bg-mount [&:user-invalid]:border-signal [&:user-invalid]:bg-signal/5";
  const errorFieldClass = "border-signal bg-signal/5";
  // native select, chevron themed to the ink palette
  const selectClass = `${fieldClass} appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20stroke%3D%22%23123a7a%22%20stroke-width%3D%221.6%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22/%3E%3C/svg%3E')]`;

  return (
    <div>
      <PageHeader
        sheet="04"
        page="Contact"
        title="Request a quote."
        lead="Send the site, the scope and a rough timeline. Anthwell picks it up and comes back with an itemised quotation — or arranges a site visit first if the job needs one."
        fields={[{ label: "Reply by", value: "Phone / email" }]}
      />

      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-12">
          {/* Contact details — ink board */}
          <Reveal className="flex flex-col bg-ink p-6 text-white sm:p-8">
            <h2 className="text-xl font-bold text-white">Reach us directly</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-sky-ink" />
                <span className="text-sky-ink">
                  {CONTACT.addressLines.join(", ")}
                </span>
              </li>
              {CONTACT.phones.map((p) => (
                <li key={p} className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-sky-ink" />
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="text-white hover:text-signal"
                  >
                    {p}
                  </a>
                </li>
              ))}
              <li className="flex gap-3">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-sky-ink" />
                <a href={waHref} className="text-white hover:text-signal">
                  WhatsApp us
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-sky-ink" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-white hover:text-signal"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="sheet-label text-sky-ink">What happens next</p>
              <ol className="mt-3 space-y-2.5 text-sm text-sky-ink">
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-white">01</span>
                  We read the brief and call or email you back.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-white">02</span>
                  A site visit if the job needs one.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-white">03</span>
                  A written, itemised quotation.
                </li>
              </ol>
            </div>
            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="font-mono text-[0.6875rem] tracking-wide text-sky-ink">
                Your enquiry goes to
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {CONTACT.lead.name}
              </p>
              <p className="text-sm text-sky-ink">{CONTACT.lead.role}</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={1} className="border border-hair-strong bg-mount p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {status === "error" && errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-3 border border-signal bg-signal/5 px-4 py-3 text-sm text-graphite"
                >
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-signal" />
                  <span>
                    {errorMsg}{" "}
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="font-semibold text-signal hover:text-signal-deep"
                    >
                      Email us instead
                    </a>
                    .
                  </span>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="sheet-label text-graphite-soft">
                    Full name
                  </span>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={`mt-2 ${fieldClass} ${fieldErrors.name ? errorFieldClass : ""}`}
                    placeholder="Your name"
                  />
                  {fieldErrors.name && (
                    <span className="mt-1 block text-xs text-signal">{fieldErrors.name}</span>
                  )}
                </label>
                <label className="block">
                  <span className="sheet-label text-graphite-soft">Phone</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className={`mt-2 ${fieldClass} ${fieldErrors.phone ? errorFieldClass : ""}`}
                    placeholder="+263 …"
                  />
                  {fieldErrors.phone && (
                    <span className="mt-1 block text-xs text-signal">{fieldErrors.phone}</span>
                  )}
                </label>
              </div>

              <label className="block">
                <span className="sheet-label text-graphite-soft">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`mt-2 ${fieldClass} ${fieldErrors.email ? errorFieldClass : ""}`}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <span className="mt-1 block text-xs text-signal">{fieldErrors.email}</span>
                )}
              </label>

              <label className="block">
                <span className="sheet-label text-graphite-soft">
                  Service required
                </span>
                <select name="service" className={`mt-2 ${selectClass}`} defaultValue={SERVICES[0].title}>
                  {SERVICES.map((s) => (
                    <option key={s.ref}>{s.title}</option>
                  ))}
                  <option>Several of the above</option>
                  <option>Something else</option>
                </select>
                {fieldErrors.service && (
                  <span className="mt-1 block text-xs text-signal">{fieldErrors.service}</span>
                )}
              </label>

              <label className="block">
                <span className="sheet-label text-graphite-soft">
                  Project details
                </span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className={`mt-2 ${fieldClass} resize-y ${fieldErrors.message ? errorFieldClass : ""}`}
                  placeholder="Where the site is, what you want built, and a rough timeline."
                />
                {fieldErrors.message && (
                  <span className="mt-1 block text-xs text-signal">{fieldErrors.message}</span>
                )}
              </label>

              {/* Honeypot — hidden from users, catches bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company
                  <input name="company" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 bg-signal px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:bg-graphite-soft sm:w-auto"
              >
                <Send size={16} />
                {status === "sending" ? "Sending…" : "Send request"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {status === "sent" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-5 backdrop-blur-sm"
          onClick={() => setStatus("idle")}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md border border-hair-strong bg-mount p-6 shadow-xl sm:p-8"
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setStatus("idle")}
              aria-label="Close"
              className="absolute right-4 top-4 text-graphite-soft hover:text-ink"
            >
              <X size={20} />
            </button>
            <div className="flex h-12 w-12 items-center justify-center bg-ink text-white">
              <Check size={26} />
            </div>
            <h2 id="contact-success-title" className="mt-5 text-2xl">
              Request received
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-graphite">
              Thanks — your request is in and {CONTACT.lead.name.split(" ")[0]}{" "}
              will be in touch shortly. If it's urgent, call{" "}
              <a
                href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`}
                className="font-semibold text-signal"
              >
                {CONTACT.phones[0]}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 inline-flex items-center justify-center bg-signal px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-signal-deep"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
