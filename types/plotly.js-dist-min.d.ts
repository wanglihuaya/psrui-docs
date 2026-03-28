declare module "plotly.js-dist-min" {
  const Plotly: {
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

  export default Plotly;
  export const newPlot: typeof Plotly.newPlot;
  export const purge: typeof Plotly.purge;
  export const Plots: typeof Plotly.Plots;
}
