import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-fd-muted-foreground">
        PSRUI Documentation
      </p>
      <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Pulsar data workflows, documented in Chinese and English.</h1>
      <p className="mx-auto mb-6 max-w-2xl text-fd-muted-foreground">
        The docs site covers PSRUI usage, pulsar-processing concepts, and the surrounding PSRCHIVE,
        tempo2, and dspsr toolchain.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-full border border-fd-border bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground"
        >
          打开中文文档
        </Link>
        <Link
          href="/en/docs"
          className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium hover:bg-fd-accent"
        >
          Open English Docs
        </Link>
      </div>
    </div>
  );
}
