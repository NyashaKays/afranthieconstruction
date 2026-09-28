import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: 0 | 1 | 2 | 3;

  variant?: "rise" | "frame" | "line" | "rows";
  className?: string;
  amount?: number;
};

export default function Reveal({
  children,
  as = "div",
  delay = 0,
  variant = "rise",
  className = "",
  amount = 0.18,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true);
            io.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // Failsafe: never leave content hidden if the observer never fires.
    const failsafe = window.setTimeout(() => setMounted(true), 1600);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [amount]);

  const Tag = as as string;
  const variantClass = variant === "rise" ? "" : ` mount-${variant}`;
  const delayClass = delay ? ` mount-delay-${delay}` : "";

  return (
    <Tag
      ref={ref as never}
      className={`mount${variantClass}${delayClass}${
        mounted ? " is-mounted" : ""
      } ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
