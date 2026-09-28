
type SealProps = {
  size?: number;
  ring?: boolean;
  className?: string;
  title?: string;
};

export default function Seal({
  size = 20,
  ring = false,
  className,
  title = "Afranthie",
}: SealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {ring && <circle cx="12" cy="12" r="11" strokeWidth={1} opacity={0.5} />}
      {/* front roof */}
      <path d="M3 14 L12 6 L21 14" />
      {/* eaves */}
      <path d="M5.5 14 V17 M18.5 14 V17" opacity={0.9} />
      {/* rear ridge */}
      <path d="M9.5 11.5 L15.5 6 L21 10.5" opacity={0.55} />
      {/* chimney */}
      <path d="M6.5 10 V6 H8.5 V7.7" opacity={0.9} />
    </svg>
  );
}


export function ContinentMark({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        strokeWidth={3}
        d="M31 11c-6.6 0-10.6 6.2-8.7 12.5l1.9 6.3c-3.1 3-3.6 7.8-1 11.6l6.2 9c2 7 6.3 14.6 12.7 21.3 3.5 3.8 9.4 1.8 9.8-3.5l.4-6.7c.1-5.1 2.9-10.2 6-14.9l6.6-9.4c2.8-4 2.4-9.4-1.1-12.6l-7.4-4.3c-4-2.3-6.5-6.6-6.5-11.3C56.4 12.9 51.5 10.6 31 11Z"
      />
      <path strokeWidth={3.4} d="M29 42 L47 27 L65 42" />
      <path strokeWidth={2.6} d="M35 40v9M59 40v9" opacity={0.8} />
      <circle cx="45" cy="62" r="5.5" strokeWidth={2.6} />
    </svg>
  );
}
