import { Landmark } from "lucide-react";
import type { GreatBuilding } from "@/lib/boostData";

export function GreatBuildings({
  buildings,
  bonus,
}: {
  buildings: GreatBuilding[];
  bonus: number;
}) {
  if (buildings.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-muted-foreground">
        Add a "Great Buildings" sheet to FOE Database.xlsx (row 1 = headers; columns: building,
        level, bonus %) to see your buildings here.
      </p>
    );
  }

  return (
    <section className="space-y-3 pt-3">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
        {buildings.map((building) => (
          <div
            key={building.name}
            className="flex items-center gap-2 border-b border-def/60 px-1 pb-1"
            title={building.name}
          >
            <Landmark className="h-7 w-7 text-primary" strokeWidth={2} />
            <span className="font-bold tabular-nums text-foreground">
              {building.level ?? "-"}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs font-semibold text-primary">
        Overall production bonus: +{bonus.toFixed(0)}%
      </p>
      <ul className="space-y-1 px-2 text-xs text-muted-foreground">
        {buildings.map((building) => (
          <li key={`${building.name}-row`} className="flex justify-between gap-3">
            <span className="truncate">{building.name}</span>
            <span className="tabular-nums">
              Lv {building.level ?? "-"} · +{(building.bonus ?? building.level ?? 0).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
