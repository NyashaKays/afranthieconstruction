import type { ReactNode } from "react";
import TitleBlock from "./TitleBlock";

type PageHeaderProps = {
  sheet: string;
  page: string;
  title: string;
  lead: ReactNode;
  fields?: { label: string; value: string }[];
};


export default function PageHeader({
  sheet,
  page,
  title,
  lead,
  fields,
}: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-10 lg:px-8 lg:pt-14">
      <div className="max-w-3xl">
        <h1 className="text-[2.1rem] sm:text-[2.6rem] lg:text-[3.1rem]">{title}</h1>
        <div className="mt-5 h-0.5 w-16 bg-signal" />
        <p className="mt-6 text-lg leading-relaxed text-graphite">{lead}</p>
      </div>
      <TitleBlock sheet={sheet} page={page} fields={fields} className="mt-9" />
    </header>
  );
}
