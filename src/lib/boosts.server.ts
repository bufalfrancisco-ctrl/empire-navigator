import {
  SHEETS,
  type BoostRow,
  type CatalogBuilding,
  type DailyItem,
  type GreatBuilding,
} from "@/lib/boostData";
import {
  parseBattleBoostRows,
  parseCatalog,
  parseDailyItems,
  parseGreatBuildings,
  productionBonus,
} from "@/lib/parseBoosts";
import { appendRow, readSheetValues, resolveSheet } from "@/lib/excel.server";

export type BoostData = {
  battleRows: BoostRow[];
  dailyItems: DailyItem[];
  greatBuildings: GreatBuilding[];
  productionBonus: number;
  catalog: CatalogBuilding[];
  error: string | null;
};

async function read(wanted: string, fallbackToFirst = false) {
  const sheet = await resolveSheet(wanted, fallbackToFirst);
  return sheet ? readSheetValues(sheet) : [];
}

export async function loadBoostData(): Promise<BoostData> {
  try {
    const [battle, daily, great, database] = await Promise.all([
      read(SHEETS.battleBoosts, true),
      read(SHEETS.dailyProduction),
      read(SHEETS.greatBuildings),
      read(SHEETS.database),
    ]);
    const greatBuildings = parseGreatBuildings(great);
    return {
      battleRows: parseBattleBoostRows(battle),
      dailyItems: parseDailyItems(daily),
      greatBuildings,
      productionBonus: productionBonus(greatBuildings),
      catalog: parseCatalog(database),
      error: null,
    };
  } catch (error) {
    return {
      battleRows: [],
      dailyItems: [],
      greatBuildings: [],
      productionBonus: 0,
      catalog: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Adds a catalog building to the workbook: its level/bonus go to GREAT BUILDINGS,
 * its battle values to BATTLE BOOST and its produced item to DAILY PRODUCTION.
 */
export async function addBuildingToWorkbook(name: string, level: number | null) {
  const catalog = parseCatalog(await read(SHEETS.database));
  const entry = catalog.find((b) => b.name.toLowerCase() === name.trim().toLowerCase());
  if (!entry) return { ok: false as const, error: `"${name}" is not in the DATABASE sheet` };

  const chosenLevel = level ?? entry.level ?? null;
  const sheets = {
    great: await resolveSheet(SHEETS.greatBuildings),
    battle: await resolveSheet(SHEETS.battleBoosts, true),
    daily: await resolveSheet(SHEETS.dailyProduction),
  };

  if (sheets.great) await appendRow(sheets.great, [entry.name, chosenLevel, entry.bonus]);

  const hasBattle = [entry.attAtk, entry.attDef, entry.defAtk, entry.defDef].some(
    (value) => value !== null,
  );
  if (hasBattle && sheets.battle) {
    await appendRow(sheets.battle, [
      "",
      entry.attAtk,
      entry.attDef,
      entry.defAtk,
      entry.defDef,
    ]);
  }

  if (entry.item && sheets.daily) {
    await appendRow(sheets.daily, [entry.item, entry.amount, entry.fragment ? "fragment" : ""]);
  }

  return { ok: true as const, error: null };
}
