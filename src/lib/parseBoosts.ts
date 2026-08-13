import type { BoostRow } from "@/lib/boostData";

const MARKERS: BoostRow["marker"][] = ["none", "flag", "pyramid", "medal"];

function num(cell: unknown): number | null {
  if (typeof cell === "number") return cell;
  if (typeof cell === "string") {
    const cleaned = cell.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    const parsed = Number(cleaned);
    return cleaned === "" || Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function marker(cell: unknown): BoostRow["marker"] {
  const value = String(cell ?? "").trim().toLowerCase();
  return MARKERS.includes(value as BoostRow["marker"]) ? (value as BoostRow["marker"]) : "none";
}

/** Skips the header row and maps columns A-E onto BoostRow. */
export function parseBattleBoostRows(values: unknown[][]): BoostRow[] {
  return values
    .slice(1)
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row) => ({
      marker: marker(row[0]),
      attAtk: num(row[1]),
      attDef: num(row[2]),
      defAtk: num(row[3]),
      defDef: num(row[4]),
    }));
}