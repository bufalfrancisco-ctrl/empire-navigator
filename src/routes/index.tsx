import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { BattleBoosts } from "@/components/BattleBoosts";
import { ModeSelector } from "@/components/ModeSelector";
import { battleBoostRows, player, type BoostMode } from "@/lib/boostData";
import { getBattleBoosts } from "@/lib/boosts.functions";
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
  const fetchBoosts = useServerFn(getBattleBoosts);
  const { data } = useQuery({
    queryKey: ["battle-boosts"],
    queryFn: () => fetchBoosts({}),
    staleTime: 60_000,
  });

  const liveRows = data?.rows ?? [];
  const rows = liveRows.length > 0 ? liveRows : battleBoostRows;
  const usingFallback = liveRows.length === 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 p-4">
      <header className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl glass-panel p-0.5">
          <img
            key={mode}
            src={image.src}
            alt={image.alt}
            className="h-full w-full rounded-[10px] object-cover animate-in fade-in duration-300"
          />
        </div>
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 truncate text-display text-2xl font-bold">
            {player.name}
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {player.age}
            <ChevronDown className="h-4 w-4" />
          </p>
        </div>
      </header>

      <ModeSelector value={mode} onChange={setMode} />

      {mode === "battle-boosts" && (
        <>
          <BattleBoosts rows={rows} />
          {usingFallback && (
            <p className="px-2 text-center text-xs text-muted-foreground">
              Showing example values — add a "BattleBoosts" sheet to "Book 4.xlsx" in your
              OneDrive (columns: marker, attack, defense, attack, defense) to go live.
            </p>
          )}
        </>
      )}

      {mode !== "battle-boosts" && (
        <section className="glass-panel rounded-2xl p-6 text-center text-sm text-muted-foreground">
          {image.alt} section coming next.
        </section>
      )}
    </main>
  );
}
