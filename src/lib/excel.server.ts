const GATEWAY_URL = "https://connector-gateway.lovable.dev/microsoft_excel";

/** Workbook that holds the boost values, stored in the connected OneDrive root. */
export const WORKBOOK_PATH = "FOE Database.xlsx";

async function graph(path: string, init?: { method?: string; body?: unknown }) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["MICROSOFT_EXCEL_API_KEY"];
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!connectionKey) throw new Error("MICROSOFT_EXCEL_API_KEY is not configured");

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    ...(init?.body === undefined ? {} : { body: JSON.stringify(init.body) }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Excel gateway request failed [${response.status}]: ${body}`);
    throw new Error(`Excel request failed [${response.status}]: ${body}`);
  }
  return response.json() as Promise<{
    values?: unknown[][];
    value?: { name: string }[];
    address?: string;
    rowCount?: number;
    columnCount?: number;
  }>;
}

export async function sheetNames() {
  const data = await graph(`/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets?$select=name`);
  const names = (data.value ?? []).map((sheet) => sheet.name);
  if (names.length === 0) throw new Error(`No worksheets found in "${WORKBOOK_PATH}"`);
  return names;
}

/** Creates the worksheet (with optional header row) when it does not exist yet. */
export async function ensureSheet(wanted: string, headers?: string[]) {
  const existing = await resolveSheet(wanted);
  if (existing) return existing;
  await graph(`/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets/add`, {
    method: "POST",
    body: { name: wanted },
  });
  if (headers?.length) {
    const end = String.fromCharCode(65 + headers.length - 1);
    await graph(
      `/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets('${wanted}')/range(address='A1:${end}1')`,
      { method: "PATCH", body: { values: [headers] } },
    );
  }
  return wanted;
}

/** Writes one cell of a worksheet. */
export async function writeCell(
  sheetName: string,
  address: string,
  value: string | number | null,
) {
  await graph(
    `/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets('${sheetName}')/range(address='${address}')`,
    { method: "PATCH", body: { values: [[value]] } },
  );
}

/**
 * Resolves a wanted sheet name case-insensitively; falls back to the first
 * sheet only when `fallbackToFirst` is set.
 */
export async function resolveSheet(wanted: string, fallbackToFirst = false) {
  const names = await sheetNames();
  const match = names.find((n) => n.trim().toLowerCase() === wanted.trim().toLowerCase());
  if (match) return match;
  return fallbackToFirst ? names[0]! : null;
}

/**
 * Reads the used range of one worksheet and returns its raw cell values.
 * When `sheetName` is omitted the workbook's first sheet is used.
 * Expected sheet layout (row 1 = headers):
 *   A: marker (none | flag | pyramid | medal)
 *   B: attacking attack, C: attacking defense
 *   D: defending attack, E: defending defense
 */
export async function readSheetValues(sheetName: string) {
  const data = await graph(
    `/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets('${sheetName}')/usedRange(valuesOnly=true)?$select=values`,
  );
  return data.values ?? [];
}

/** Appends one row of values below the used range of a worksheet. */
export async function appendRow(sheetName: string, values: (string | number | null)[]) {
  const used = await graph(
    `/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets('${sheetName}')/usedRange(valuesOnly=true)?$select=address,values`,
  );
  const address = used.address ?? "";
  const lastPart = address.split("!")[1]?.split(":").pop() ?? "A1";
  const lastRow = Number(lastPart.replace(/[^\d]/g, "")) || 1;
  const isEmpty = (used.values ?? []).every((row) =>
    row.every((cell) => String(cell ?? "").trim() === ""),
  );
  const row = isEmpty ? lastRow : lastRow + 1;
  const endColumn = String.fromCharCode(65 + Math.max(values.length - 1, 0));
  await graph(
    `/me/drive/root:/${WORKBOOK_PATH}:/workbook/worksheets('${sheetName}')/range(address='A${row}:${endColumn}${row}')`,
    { method: "PATCH", body: { values: [values] } },
  );
  return row;
}