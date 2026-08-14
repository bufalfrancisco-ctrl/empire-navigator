import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { BattleBoosts } from "@/components/BattleBoosts";
import { DailyProduction } from "@/components/DailyProduction";
import { GreatBuildings } from "@/components/GreatBuildings";
import { ModeSelector } from "@/components/ModeSelector";
import { player, type BoostMode } from "@/lib/boostData";
import { getBoostData } from "@/lib/boosts.functions";
import battleBoostImg from "@/assets/mode-battle-boost.png";
import greatBuildingsImg from "@/assets/mode-great-buildings.png";
import dailyProductionImg from "@/assets/mode-daily-production.png";

const MODE_IMAGES: Record<BoostMode, { src: string; alt: string }> = {
  "great-buildings": { src: greatBuildingsImg, alt: "Great Buildings" },
  "battle-boosts": { src: battleBoostImg, alt: "Battle Boost" },
  "daily-production": { src: dailyProductionImg, alt: "Daily Boost" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Boost Tracker — Battle Boosts & Daily Production" },
      {
        name: "description",
        content:
          "Track your city's Battle Boosts, Great Buildings and Daily Production in one glass dashboard.",
      },
      { property: "og:title", content: "Boost Tracker — Battle Boosts & Daily Production" },
      {
        property: "og:description",
        content:
          "Track your city's Battle Boosts, Great Buildings and Daily Production in one glass dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mode, setMode] = useState<BoostMode>("battle-boosts");
  const image = MODE_IMAGES[mode];
  const fetchBoosts = useServerFn(getBoostData);
  const { data, isPending } = useQuery({
    queryKey: ["boost-data"],
    queryFn: () => fetchBoosts({}),
    staleTime: 60_000,
  });
  const bonus = data?.productionBonus ?? 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 p-4">
      <header className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-primary/70">
          <img
            key={mode}
            src={image.src}
            alt={image.alt}
            className="h-full w-full rounded-[8px] object-cover animate-in fade-in duration-300"
          />
        </div>
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 truncate text-2xl font-bold">
            {player.name}
            <ChevronDown className="h-5 w-5 shrink-0" strokeWidth={3} />
          </h1>
          <p className="mt-1 flex items-center gap-2 text-lg">
            {player.age}
            <ChevronDown className="h-5 w-5" strokeWidth={3} />
          </p>
        </div>
      </header>

      <ModeSelector value={mode} onChange={setMode} />

      {isPending ? (
        <p className="px-2 py-8 text-center text-sm text-muted-foreground">
          Loading your values…
        </p>
      ) : (
        <>
          {mode === "battle-boosts" &&
            (data && data.battleRows.length > 0 ? (
              <BattleBoosts rows={data.battleRows} />
            ) : (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No Battle Boost values found in FOE Database.xlsx (row 1 = headers; columns:
                marker, attack, defense, attack, defense).
              </p>
            ))}

          {mode === "daily-production" && (
            <DailyProduction items={data?.dailyItems ?? []} bonus={bonus} />
          )}

          {mode === "great-buildings" && (
            <GreatBuildings buildings={data?.greatBuildings ?? []} bonus={bonus} />
          )}

          {data?.error && (
            <p className="px-2 text-center text-xs text-destructive">{data.error}</p>
          )}
        </>
      )}
    </main>
  );
}
