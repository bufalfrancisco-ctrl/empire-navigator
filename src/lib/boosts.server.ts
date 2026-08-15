import {
  SHEETS,
  type BoostRow,
  type CatalogBuilding,
  type DailyItem,
  type GreatBuilding,
  type MyBuilding,
} from "@/lib/boostData";
import {
  parseBattleBoostRows,
  parseCatalog,
  parseDailyItems,
  parseGreatBuildings,
  parseMyBuildings,
  productionBonus,
} from "@/lib/parseBoosts";
import {
  appendRow,
  ensureSheet,
  readSheetValues,
  resolveSheet,
  writeCell,
} from "@/lib/excel.server";

export type BoostData = {
  battleRows: BoostRow[];
  dailyItems: DailyItem[];
  greatBuildings: GreatBuilding[];
  productionBonus: number;
  catalog: CatalogBuilding[];
  myBuildings: MyBuilding[];
  error: string | null;
};

async function read(wanted: string, fallbackToFirst = false) {
  const sheet = await resolveSheet(wanted, fallbackToFirst);
  return sheet ? readSheetValues(sheet) : [];
}

export async function loadBoostData(): Promise<BoostData> {
  try {
    const [battle, daily, great, database, mine] = await Promise.all([
      read(SHEETS.battleBoosts, true),
      read(SHEETS.dailyProduction),
      read(SHEETS.greatBuildings),
      read(SHEETS.database),
      read(SHEETS.myBuildings),
    ]);
    const greatBuildings = parseGreatBuildings(great);
    return {
      battleRows: parseBattleBoostRows(battle),
      dailyItems: parseDailyItems(daily),
      greatBuildings,
      productionBonus: productionBonus(greatBuildings),
      catalog: parseCatalog(database),
      myBuildings: parseMyBuildings(mine),
      error: null,
    };
  } catch (error) {
    return {
      battleRows: [],
      dailyItems: [],
      greatBuildings: [],
      productionBonus: 0,
      catalog: [],
      myBuildings: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Registers a building the player owns (name + era + quantity) in the
 * "MY BUILDINGS" sheet and pushes its DATABASE buffs (×quantity) into the
 * BATTLE BOOST and DAILY PRODUCTION sheets.
 */
export async function addMyBuilding(name: string, era: string, quantity: number) {
  const catalog = parseCatalog(await read(SHEETS.database));
  const entry = catalog.find((b) => b.name.toLowerCase() === name.trim().toLowerCase());
  if (!entry) return { ok: false as const, error: `"${name}" is not in the DATABASE sheet` };

  const count = Math.max(1, Math.round(quantity || 1));
  const mineSheet = await ensureSheet(SHEETS.myBuildings, ["building", "era", "quantity"]);
  await appendRow(mineSheet, [entry.name, era, count]);

  const times = (value: number | null) => (value === null ? null : value * count);
  const battle = await resolveSheet(SHEETS.battleBoosts, true);
  const hasBattle = [entry.attAtk, entry.attDef, entry.defAtk, entry.defDef].some(
    (value) => value !== null,
  );
  if (hasBattle && battle) {
    await appendRow(battle, [
      "",
      times(entry.attAtk),
      times(entry.attDef),
      times(entry.defAtk),
      times(entry.defDef),
    ]);
  }

  const daily = await resolveSheet(SHEETS.dailyProduction);
  if (entry.item && daily) {
    await appendRow(daily, [
      entry.item,
      times(entry.amount),
      entry.fragment ? "fragment" : "",
    ]);
  }

  return { ok: true as const, error: null };
}

/** Updates (or creates) the level of one Great Building in the workbook. */
export async function setGreatBuildingLevel(name: string, level: number | null) {
  const sheet = await ensureSheet(SHEETS.greatBuildings, ["building", "level", "bonus %"]);
  const values = await readSheetValues(sheet);
  const index = values.findIndex(
    (row) => String(row[0] ?? "").trim().toLowerCase() === name.trim().toLowerCase(),
  );
  if (index > 0) {
    await writeCell(sheet, `B${index + 1}`, level);
    return { ok: true as const, error: null };
  }
  const catalog = parseCatalog(await read(SHEETS.database));
  const entry = catalog.find((b) => b.name.toLowerCase() === name.trim().toLowerCase());
  await appendRow(sheet, [entry?.name ?? name, level, entry?.bonus ?? level]);
  return { ok: true as const, error: null };
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
