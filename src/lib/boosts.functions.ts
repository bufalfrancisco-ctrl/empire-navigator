import { createServerFn } from "@tanstack/react-start";

export const getBoostData = createServerFn({ method: "GET" }).handler(async () => {
  const { loadBoostData } = await import("@/lib/boosts.server");
  return loadBoostData();
});