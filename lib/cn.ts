import { twMerge } from "tailwind-merge";

type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassValue =
  | ClassDictionary
  | ClassValue[]
  | false
  | null
  | number
  | string
  | undefined;

function flattenValue(value: ClassValue): string[] {
  if (!value) return [];
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenValue);
  }

  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className);
}

export function cn(...values: ClassValue[]) {
  return twMerge(values.flatMap(flattenValue).join(" "));
}
