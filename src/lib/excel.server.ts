const GATEWAY_URL = "https://connector-gateway.lovable.dev/microsoft_excel";

/** Workbook that holds the boost values, stored in the connected OneDrive root. */
export const WORKBOOK_PATH = "Book 4.xlsx";

async function graph(path: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["MICROSOFT_EXCEL_API_KEY"];
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!connectionKey) throw new Error("MICROSOFT_EXCEL_API_KEY is not configured");

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Excel gateway request failed [${response.status}]: ${body}`);
    throw new Error(`Excel request failed [${response.status}]: ${body}`);
  }
  return response.json() as Promise<{ values?: unknown[][] }>;
}

/**
 * Reads the used range of one worksheet and returns its raw cell values.
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