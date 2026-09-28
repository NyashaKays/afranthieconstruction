import Seal from "./Seal";

type Field = { label: string; value: string };

type TitleBlockProps = {
  sheet: string;
  page: string;
  
  fields?: Field[];
  tone?: "paper" | "ink";
  className?: string;
};

export default function TitleBlock({
  sheet,
  page,
  fields = [],
  tone = "ink",
  className = "",
}: TitleBlockProps) {
  const cells: Field[] = [
    { label: "Project", value: "Afranthie Construction Engineers" },
    { label: "Sheet", value: `${sheet} · ${page}` },
    ...fields,
    { label: "Rev", value: "2026" },
  ];

  const onInk = tone === "ink";

  return (
    <div
      className={[
        "relative flex flex-wrap items-stretch border",
        onInk
          ? "border-white/25 bg-ink text-white"
          : "border-hair-strong bg-mount text-graphite",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-2 px-3 py-2",
          onInk ? "text-white" : "text-ink",
        ].join(" ")}
      >
        <Seal size={18} ring />
        <span className="sheet-label">Afranthie</span>
      </div>

      {cells.map((c, i) => (
        <div
          key={c.label + i}
          className={[
            "flex min-w-0 flex-col justify-center border-l px-3 py-2",
            onInk ? "border-white/20" : "border-hair",
            // let the two identifying cells take the slack
            i === 0 ? "grow" : "",
          ].join(" ")}
        >
          <span
            className={[
              "sheet-label",
              onInk ? "text-sky-ink" : "text-graphite-soft",
            ].join(" ")}
          >
            {c.label}
          </span>
          <span className="truncate font-mono text-[0.78rem] font-medium">
            {c.value}
          </span>
        </div>
      ))}
    </div>
  );
}
