export const psrcatClasses = ["Normal", "MSP", "Binary", "Magnetar"] as const;

export type PsrcatClass = (typeof psrcatClasses)[number];

export interface PsrcatPulsarPoint {
  PSRJ: string;
  PSRB: string | null;
  P0: number | null;
  P1: number | null;
  DM: number | null;
  class: PsrcatClass;
}

export interface PsrcatStats {
  catalogue: string;
  generatedAt: string;
  total: number;
  classes: Record<PsrcatClass, number>;
}
