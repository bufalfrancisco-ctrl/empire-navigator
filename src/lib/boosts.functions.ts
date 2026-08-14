import { createServerFn } from "@tanstack/react-start";

export const getBoostData = createServerFn({ method: "GET" }).handler(async () => {
  const { loadBoostData } = await import("@/lib/boosts.server");
  return loadBoostData();
});

export const addBuilding = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; level: number | null }) => input)
  .handler(async ({ data }) => {
    const { addBuildingToWorkbook } = await import("@/lib/boosts.server");
    return addBuildingToWorkbook(data.name, data.level);
  });