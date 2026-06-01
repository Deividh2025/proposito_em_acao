export * from "./types";
export * from "./persistence";

export const focusDurationOptions = [
  { label: "5 min", value: 5, mode: "destravar" },
  { label: "15 min", value: 15, mode: "baixa energia" },
  { label: "25 min", value: 25, mode: "foco padrao" },
  { label: "50 min", value: 50, mode: "foco profundo" }
] as const;

export function formatFocusTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}
