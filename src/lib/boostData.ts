export type BoostMode = "great-buildings" | "battle-boosts" | "daily-production";

export const MODES: { id: BoostMode; label: string }[] = [
  { id: "great-buildings", label: "Great Buildings" },
  { id: "battle-boosts", label: "Battle Boosts" },
  { id: "daily-production", label: "Daily Production" },
];

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