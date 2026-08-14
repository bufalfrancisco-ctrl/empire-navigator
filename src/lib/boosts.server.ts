import { SHEETS, type BoostRow, type DailyItem, type GreatBuilding } from "@/lib/boostData";
import {
  parseBattleBoostRows,
  parseDailyItems,
  parseGreatBuildings,
  productionBonus,
} from "@/lib/parseBoosts";
import { readSheetValues, resolveSheet } from "@/lib/excel.server";

export type BoostData = {
  battleRows: BoostRow[];
  dailyItems: DailyItem[];
  greatBuildings: GreatBuilding[];
  productionBonus: number;
  error: string | null;
};

async function read(wanted: string, fallbackToFirst = false) {
  const sheet = await resolveSheet(wanted, fallbackToFirst);
  return sheet ? readSheetValues(sheet) : [];
}

export async function loadBoostData(): Promise<BoostData> {
  try {
    const [battle, daily, great] = await Promise.all([
      read(SHEETS.battleBoosts, true),
      read(SHEETS.dailyProduction),
      read(SHEETS.greatBuildings),
    ]);
    const greatBuildings = parseGreatBuildings(great);
    return {
      battleRows: parseBattleBoostRows(battle),
      dailyItems: parseDailyItems(daily),
      greatBuildings,
      productionBonus: productionBonus(greatBuildings),
      error: null,
    };
  } catch (error) {
    return {
      battleRows: [],
      dailyItems: [],
      greatBuildings: [],
      productionBonus: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
