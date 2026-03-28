"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const PsrcatHomeChart = dynamic(
  () => import("./psrcat-home-chart").then((mod) => mod.PsrcatHomeChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-fd-border bg-fd-card shadow-sm">
        <div className="flex items-center gap-3 text-sm text-fd-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading PSRCAT data...</span>
        </div>
      </div>
    ),
  },
);

export function PsrcatHomeChartShell() {
  return <PsrcatHomeChart />;
}
