export type BoostMode =
  | "great-buildings"
  | "battle-boosts"
  | "daily-production"
  | "insert-building";

export const MODES: { id: BoostMode; label: string }[] = [
  { id: "great-buildings", label: "Great Buildings" },
  { id: "battle-boosts", label: "Battle Boosts" },
  { id: "daily-production", label: "Daily Production" },
  { id: "insert-building", label: "Insert Building" },
];

/** Direct link to the linked workbook (Excel per il Web). */
export const WORKBOOK_URL =
  "https://collegiorotondi-my.sharepoint.com/personal/bufalo_francesco_collegiorotondi_it/_layouts/15/Doc.aspx?sourcedoc=%7B2501553D-FE1E-4506-8A6F-0BD1862580B4%7D&file=FOE%20Database.xlsx&action=default&mobileredirect=true";

export type BoostRow = {
  /** middle marker: none | flag | pyramid | medal */
  marker: "none" | "flag" | "pyramid" | "medal";
  attAtk: number | null;
  attDef: number | null;
  defAtk: number | null;
  defDef: number | null;
};

export type PlayerInfo = {
  name: string;
  age: string;
};

/** One resource / fragment line of the Daily Production screen. */
export type DailyItem = {
  label: string;
  amount: number | null;
  /** true when the item is a fragment (shown with the puzzle badge) */
  fragment: boolean;
};

/** One Great Building with its current level and production bonus. */
export type GreatBuilding = {
  name: string;
  level: number | null;
  /** production bonus in percent contributed by this building */
  bonus: number | null;
};

/** Worksheet names read from "FOE Database.xlsx". */
export const SHEETS = {
  battleBoosts: "BATTLE BOOST",
  dailyProduction: "DAILY PRODUCTION",
  greatBuildings: "GREAT BUILDINGS",
  database: "DATABASE",
} as const;

/**
 * One row of the "DATABASE" catalog sheet: a building plus every buff it grants.
 * Columns: A name, B level, C bonus %, D-G battle boosts, H item, I amount, J fragment.
 */
export type CatalogBuilding = {
  name: string;
  level: number | null;
  bonus: number | null;
  attAtk: number | null;
  attDef: number | null;
  defAtk: number | null;
  defDef: number | null;
  item: string;
  amount: number | null;
  fragment: boolean;
};

export function formatAmount(value: number | null): string {
  if (value === null) return "-";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (abs >= 10_000) return `${trim(value / 1000)}K`;
  return new Intl.NumberFormat("it-IT").format(value);
}

function trim(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

/**
 * Placeholder values. These are shaped exactly like the rows that will come
 * from the linked Excel (Microsoft 365) sheet, so swapping the source out is
 * a one-line change.
 */
export const player: PlayerInfo = {
  name: "Franci09Best",
  age: "Età Industriale",
};

export const battleBoostRows: BoostRow[] = [
  { marker: "none", attAtk: 981, attDef: 936, defAtk: 601, defDef: 562 },
  { marker: "flag", attAtk: 1742, attDef: 1721, defAtk: 1107, defDef: 1037 },
  { marker: "pyramid", attAtk: 1627, attDef: 1645, defAtk: 1122, defDef: 1083 },
  { marker: "medal", attAtk: 30, attDef: null, defAtk: 15, defDef: null },
];