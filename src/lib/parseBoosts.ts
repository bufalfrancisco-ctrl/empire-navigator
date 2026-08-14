import type { BoostRow, DailyItem, GreatBuilding } from "@/lib/boostData";

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

function rows(values: unknown[][]) {
  return values
    .slice(1)
    .filter((row) => String(row[0] ?? "").trim() !== "");
}

/** Columns: A item name, B amount, C (optional) "fragment" / "yes" flag. */
export function parseDailyItems(values: unknown[][]): DailyItem[] {
  return rows(values).map((row) => {
    const label = String(row[0] ?? "").trim();
    const flag = String(row[2] ?? "").trim().toLowerCase();
    return {
      label,
      amount: num(row[1]),
      fragment:
        ["fragment", "frammento", "yes", "si", "sì", "true", "x", "1"].includes(flag) ||
        /fragment|frammento/i.test(label),
    };
  });
}

/** Columns: A building name, B level, C (optional) production bonus in %. */
export function parseGreatBuildings(values: unknown[][]): GreatBuilding[] {
  return rows(values).map((row) => ({
    name: String(row[0] ?? "").trim(),
    level: num(row[1]),
    bonus: num(row[2]),
  }));
}

/**
 * Overall production bonus applied to Daily Production.
 * Uses the bonus column when present, otherwise 1% per building level.
 */
export function productionBonus(buildings: GreatBuilding[]): number {
  return buildings.reduce(
    (total, b) => total + (b.bonus ?? (b.level ?? 0)),
    0,
  );
}