"use client";

import {
  Activity,
  AlertCircle,
  Binary,
  Database,
  Loader2,
  Search,
  Zap,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  type PsrcatClass,
  type PsrcatPulsarPoint,
  type PsrcatStats,
  psrcatClasses,
} from "@/lib/psrcat";

type PlotlyModule = {
  newPlot: (
    element: HTMLDivElement,
    data: unknown[],
    layout: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) => Promise<unknown>;
  purge: (element: HTMLDivElement) => void;
  Plots: {
    resize: (element: HTMLDivElement) => void;
  };
};

const colors: Record<PsrcatClass, string> = {
  Normal: "#4f7cff",
  MSP: "#16a34a",
  Binary: "#0891b2",
  Magnetar: "#dc2626",
};

const surfaceLine = "rgba(148, 163, 184, 0.28)";
const plotBackground = "rgba(15, 23, 42, 0.04)";

function formatCount(count?: number) {
  return (count ?? 0).toLocaleString("en-US");
}

function getHoverText(pulsar: PsrcatPulsarPoint) {
  return [
    pulsar.PSRJ,
    pulsar.PSRB ? `PSRB: ${pulsar.PSRB}` : null,
    pulsar.P0 ? `P0: ${pulsar.P0.toExponential(3)} s` : "P0: N/A",
    pulsar.P1 ? `P1: ${pulsar.P1.toExponential(3)}` : "P1: N/A",
    pulsar.DM ? `DM: ${pulsar.DM.toFixed(2)}` : "DM: N/A",
    `Class: ${pulsar.class}`,
  ]
    .filter(Boolean)
    .join("<br>");
}

async function loadJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function PsrcatHomeChart() {
  const plotRef = useRef<HTMLDivElement>(null);
  const [pulsars, setPulsars] = useState<PsrcatPulsarPoint[]>([]);
  const [stats, setStats] = useState<PsrcatStats | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [pulsarData, statsData] = await Promise.all([
          loadJson<PsrcatPulsarPoint[]>("/psrcat/pulsars.json"),
          loadJson<PsrcatStats>("/psrcat/stats.json"),
        ]);

        if (cancelled) return;

        setPulsars(pulsarData);
        setStats(statsData);
      } catch (fetchError) {
        if (cancelled) return;

        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unknown PSRCAT fetch error";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPulsars = useMemo(() => {
    const normalized = deferredSearch.trim().toLowerCase();
    if (!normalized) return pulsars;

    return pulsars.filter((pulsar) => {
      return (
        pulsar.PSRJ.toLowerCase().includes(normalized) ||
        pulsar.PSRB?.toLowerCase().includes(normalized)
      );
    });
  }, [deferredSearch, pulsars]);

  const highlighted = useMemo(() => {
    const normalized = deferredSearch.trim().toUpperCase();
    if (!normalized) return null;

    const match = pulsars.find((pulsar) => {
      return (
        pulsar.PSRJ === normalized ||
        pulsar.PSRB === normalized ||
        pulsar.PSRJ.startsWith(normalized) ||
        pulsar.PSRB?.startsWith(normalized)
      );
    });

    return match?.PSRJ ?? null;
  }, [deferredSearch, pulsars]);

  useEffect(() => {
    if (!plotRef.current || loading || error) return;

    const validPulsars = filteredPulsars.filter(
      (pulsar) =>
        typeof pulsar.P0 === "number" &&
        pulsar.P0 > 0 &&
        typeof pulsar.P1 === "number" &&
        pulsar.P1 > 0,
    );

    if (validPulsars.length === 0) return;

    let resizeObserver: ResizeObserver | null = null;
    let mounted = true;

    async function renderPlot() {
      const Plotly = (await import("plotly.js-dist-min")) as PlotlyModule;
      if (!plotRef.current || !mounted) return;

      const traces: unknown[] = psrcatClasses.map((className) => {
        const group = validPulsars.filter(
          (pulsar) => pulsar.class === className,
        );

        return {
          x: group.map((pulsar) => pulsar.P0),
          y: group.map((pulsar) => pulsar.P1),
          name: className,
          mode: "markers",
          type: "scattergl",
          marker: {
            size: 7,
            color: colors[className],
            opacity: 0.78,
            line: {
              width: 0.75,
              color: "rgba(15, 23, 42, 0.5)",
            },
          },
          text: group.map(getHoverText),
          hoverinfo: "text",
        };
      });

      if (highlighted) {
        const active = validPulsars.find(
          (pulsar) => pulsar.PSRJ === highlighted,
        );

        if (active) {
          traces.push({
            x: [active.P0],
            y: [active.P1],
            name: "Selected",
            mode: "markers",
            type: "scattergl",
            marker: {
              size: 16,
              color: "#f8fafc",
              symbol: "star",
              line: {
                width: 2,
                color: colors[active.class],
              },
            },
            text: [`${active.PSRJ} (Selected)`],
            hoverinfo: "text",
            showlegend: false,
          });
        }
      }

      const p0Range = [1e-3, 30];
      const bFields = [1e8, 1e10, 1e12, 1e14];
      const ages = [1e3, 1e5, 1e7, 1e9, 1e11];
      const edots = [1e30, 1e33, 1e36, 1e39];
      const secondsPerYear = 3.15576e7;

      for (const bField of bFields) {
        traces.push({
          x: p0Range,
          y: p0Range.map((p0) => (bField / 3.2e19) ** 2 / p0),
          mode: "lines",
          line: {
            color: surfaceLine,
            width: 1,
            dash: "dash",
          },
          hoverinfo: "none",
          showlegend: false,
        });
      }

      for (const age of ages) {
        traces.push({
          x: p0Range,
          y: p0Range.map((p0) => p0 / (2 * age * secondsPerYear)),
          mode: "lines",
          line: {
            color: surfaceLine,
            width: 1,
            dash: "dot",
          },
          hoverinfo: "none",
          showlegend: false,
        });
      }

      for (const edot of edots) {
        traces.push({
          x: p0Range,
          y: p0Range.map((p0) => (edot * p0 ** 3) / 3.95e46),
          mode: "lines",
          line: {
            color: surfaceLine,
            width: 1,
          },
          hoverinfo: "none",
          showlegend: false,
        });
      }

      await Plotly.newPlot(
        plotRef.current,
        traces,
        {
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: plotBackground,
          margin: { t: 28, r: 24, b: 56, l: 72 },
          font: {
            color: "#475569",
            family: "ui-sans-serif, system-ui, sans-serif",
          },
          legend: {
            x: 0,
            y: 1,
            bgcolor: "rgba(255,255,255,0.82)",
            bordercolor: "rgba(148, 163, 184, 0.24)",
            borderwidth: 1,
          },
          xaxis: {
            title: { text: "Period P0 (s)" },
            type: "log",
            gridcolor: surfaceLine,
            zeroline: false,
            range: [-3.2, 1.5],
          },
          yaxis: {
            title: { text: "Period Derivative Pdot" },
            type: "log",
            gridcolor: surfaceLine,
            zeroline: false,
            range: [-22, -8],
          },
        },
        {
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["select2d", "lasso2d"],
        },
      );

      resizeObserver = new ResizeObserver(() => {
        if (plotRef.current) {
          Plotly.Plots.resize(plotRef.current);
        }
      });
      resizeObserver.observe(plotRef.current);
    }

    renderPlot().catch((plotError) => {
      const message =
        plotError instanceof Error
          ? plotError.message
          : "Failed to render chart";
      setError(message);
    });

    return () => {
      mounted = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (plotRef.current) {
        void import("plotly.js-dist-min").then((Plotly) => {
          Plotly.purge(plotRef.current as HTMLDivElement);
        });
      }
    };
  }, [error, filteredPulsars, highlighted, loading]);

  if (loading) {
    return (
      <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-fd-border bg-fd-card shadow-sm">
        <div className="flex items-center gap-3 text-sm text-fd-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading PSRCAT data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-6 text-center text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        <AlertCircle className="mb-3 size-8" />
        <p className="text-base font-semibold">
          PSRCAT data is temporarily unavailable.
        </p>
        <p className="mt-2 max-w-xl text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (!stats || pulsars.length === 0) {
    return (
      <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-fd-border bg-fd-card px-6 text-center text-sm text-fd-muted-foreground shadow-sm">
        No PSRCAT entries were found in the current data snapshot.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-fd-border bg-fd-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fd-border px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <StatBadge
            icon={<Database className="size-3.5" />}
            label={stats.catalogue}
            tone="neutral"
          />
          <StatBadge
            icon={<Activity className="size-3.5" />}
            label={`Total ${formatCount(stats.total)}`}
            tone="neutral"
          />
          <StatBadge
            icon={<Activity className="size-3.5" />}
            label={`Normal ${formatCount(stats.classes.Normal)}`}
            tone="normal"
          />
          <StatBadge
            icon={<Activity className="size-3.5" />}
            label={`MSP ${formatCount(stats.classes.MSP)}`}
            tone="msp"
          />
          <StatBadge
            icon={<Binary className="size-3.5" />}
            label={`Binary ${formatCount(stats.classes.Binary)}`}
            tone="binary"
          />
          <StatBadge
            icon={<Zap className="size-3.5" />}
            label={`Magnetar ${formatCount(stats.classes.Magnetar)}`}
            tone="magnetar"
          />
        </div>

        <label className="relative block w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pulsar by J-name or B-name"
            className="w-full rounded-full border border-fd-border bg-fd-background px-10 py-2 text-sm outline-none ring-0 transition focus:border-fd-primary"
          />
        </label>
      </div>

      <div className="grid gap-4 px-5 pb-5 pt-5 md:px-6 md:pb-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-fd-border bg-fd-background/60 p-2">
          <div ref={plotRef} className="h-[520px] w-full md:h-[640px]" />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl border border-fd-border bg-fd-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Parameters
            </p>
            <div className="mt-4 space-y-3 text-sm text-fd-muted-foreground">
              <LegendLine dash="dashed" label="B-field (Gauss)" />
              <LegendLine dash="dotted" label="Age tau (years)" />
              <LegendLine dash="solid" label="Spin-down Edot (erg/s)" />
            </div>
          </div>

          <div className="rounded-3xl border border-fd-border bg-fd-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Snapshot
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-fd-muted-foreground">Generated</dt>
                <dd className="font-medium text-fd-foreground">
                  {new Date(stats.generatedAt).toLocaleDateString("en-CA")}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-fd-muted-foreground">Visible points</dt>
                <dd className="font-medium text-fd-foreground">
                  {formatCount(filteredPulsars.length)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-fd-muted-foreground">Highlighted</dt>
                <dd className="font-medium text-fd-foreground">
                  {highlighted ?? "None"}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}

function LegendLine({
  dash,
  label,
}: {
  dash: "dashed" | "dotted" | "solid";
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn("block h-px w-8 border-t border-slate-400", {
          "border-dashed": dash === "dashed",
          "border-dotted": dash === "dotted",
          "border-solid": dash === "solid",
        })}
      />
      <span>{label}</span>
    </div>
  );
}

function StatBadge({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "neutral" | "normal" | "msp" | "binary" | "magnetar";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
        {
          "border-fd-border bg-fd-background text-fd-foreground":
            tone === "neutral",
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200":
            tone === "normal",
          "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200":
            tone === "msp",
          "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-200":
            tone === "binary",
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200":
            tone === "magnetar",
        },
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
