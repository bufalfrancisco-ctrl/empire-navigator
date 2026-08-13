import { createServerFn } from "@tanstack/react-start";
import { parseBattleBoostRows } from "@/lib/parseBoosts";

export const getBattleBoosts = createServerFn({ method: "GET" }).handler(async () => {
  const { readSheetValues } = await import("@/lib/excel.server");
  try {
    const values = await readSheetValues("BattleBoosts");
    return { rows: parseBattleBoostRows(values), source: "excel" as const, error: null };
  } catch (error) {
    return {
      rows: [],
      source: "fallback" as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});