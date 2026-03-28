import Link from "next/link";
import { PsrcatHomeChart } from "@/components/psrcat-home-chart";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-(--fd-layout-width) flex-1 flex-col gap-8 px-4 pb-8 pt-6 md:px-6 md:pb-10">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-fd-muted-foreground">
            PSRCAT Catalogue Explorer
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-fd-foreground sm:text-5xl">
            Explore the pulsar P-Pdot landscape directly from the PSRUI docs
            homepage.
          </h1>
        </div>

        <div className="rounded-3xl border border-fd-border bg-fd-card p-5 shadow-sm">
          <p className="text-sm leading-7 text-fd-muted-foreground">
            Search by pulsar J-name or B-name, inspect the major source
            populations, then jump into the documentation for the processing
            workflow behind the data.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="rounded-full border border-fd-border bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
            >
              中文文档
            </Link>
            <Link
              href="/en/docs"
              className="rounded-full border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition hover:bg-fd-accent"
            >
              English Docs
            </Link>
          </div>
        </div>
      </section>

      <PsrcatHomeChart />
    </div>
  );
}
