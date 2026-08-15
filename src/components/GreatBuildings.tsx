import { useState } from "react";
import { Check, Landmark, Loader2, Plus } from "lucide-react";
import type { CatalogBuilding, GreatBuilding } from "@/lib/boostData";

export function GreatBuildings({
  buildings,
  bonus,
  catalog,
  onSetLevel,
  pending,
}: {
  buildings: GreatBuilding[];
  bonus: number;
  catalog: CatalogBuilding[];
  onSetLevel: (name: string, level: number | null) => void;
  pending: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [picking, setPicking] = useState(false);

  const startEdit = (building: GreatBuilding) => {
    setEditing(building.name);
    setDraft(building.level === null ? "" : String(building.level));
  };

  const commit = (name: string) => {
    onSetLevel(name, draft === "" ? null : Number(draft));
    setEditing(null);
  };

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
            {editing === building.name ? (
              <span className="flex items-center gap-1">
                <input
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ""))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commit(building.name);
                    if (event.key === "Escape") setEditing(null);
                  }}
                  aria-label={`Level of ${building.name}`}
                  className="w-12 rounded border border-primary/60 bg-secondary/60 px-1 text-center font-bold tabular-nums outline-none"
                />
                <button
                  type="button"
                  onClick={() => commit(building.name)}
                  aria-label="Save level"
                  className="text-primary"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => startEdit(building)}
                aria-label={`Change level of ${building.name}`}
                className="font-bold tabular-nums text-foreground"
              >
                {building.level ?? "-"}
              </button>
            )}
          </div>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setPicking((prev) => !prev)}
            aria-expanded={picking}
            aria-label="Add a Great Building"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/60 bg-secondary/60 text-primary"
          >
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={3} />
            )}
          </button>
          {picking && (
            <div
              role="listbox"
              aria-label="Great Buildings"
              className="absolute right-0 z-30 mt-1 max-h-[200px] w-56 overflow-y-auto rounded-lg border border-primary/50 bg-[oklch(0.12_0.04_268)] shadow-lg"
            >
              {catalog.length === 0 ? (
                <p className="px-3 py-3 text-xs text-muted-foreground">
                  Fill the DATABASE sheet to list Great Buildings here.
                </p>
              ) : (
                catalog.map((entry) => (
                  <button
                    key={entry.name}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => {
                      setPicking(false);
                      onSetLevel(entry.name, entry.level ?? 1);
                    }}
                    className="flex w-full flex-col items-start px-3 py-2 text-left"
                  >
                    <span className="truncate text-sm font-bold capitalize">{entry.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      +{(entry.bonus ?? 0).toFixed(0)}% production
                      {entry.item ? ` · ${entry.item}` : ""}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs font-semibold text-primary">
        Overall production bonus: +{bonus.toFixed(0)}%
      </p>

      {buildings.length === 0 ? (
        <p className="px-4 py-3 text-center text-sm text-muted-foreground">
          No Great Buildings yet — use "+" to add one from the database.
        </p>
      ) : (
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
      )}
    </section>
  );
}
