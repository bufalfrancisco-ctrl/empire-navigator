import { useMemo, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import { EraScroller } from "@/components/EraScroller";
import { ERAS, type CatalogBuilding, type MyBuilding } from "@/lib/boostData";

export function InsertBuilding({
  catalog,
  owned,
  onAdd,
  pending,
  message,
}: {
  catalog: CatalogBuilding[];
  owned: MyBuilding[];
  onAdd: (name: string, era: string, quantity: number) => void;
  pending: boolean;
  message: string | null;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CatalogBuilding | null>(null);
  const [era, setEra] = useState<string>(ERAS[6]);
  const [quantity, setQuantity] = useState("1");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return catalog.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 12);
  }, [catalog, query]);

  return (
    <section className="space-y-3 pt-3">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-primary/50 bg-secondary/60 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-primary" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
          }}
          placeholder="Search building…"
          aria-label="Search building"
          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
        />
      </div>

      {catalog.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          Fill the "DATABASE" sheet of FOE Database.xlsx (row 1 = headers: building, era) to search
          buildings here.
        </p>
      ) : selected ? (
        <div className="space-y-3 rounded-lg border border-primary/50 bg-secondary/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-bold capitalize">{selected.name}</p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="shrink-0 text-xs font-semibold text-muted-foreground underline"
            >
              Change
            </button>
          </div>
          <EraScroller value={era} onChange={setEra} />
          <div className="flex items-center gap-2">
            <input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value.replace(/[^\d]/g, ""))}
              placeholder="Qty"
              aria-label="Quantity"
              className="w-16 rounded-lg border border-primary/50 bg-secondary/60 px-2 py-2 text-center text-sm font-bold tabular-nums outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => onAdd(selected.name, era, Number(quantity) || 1)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add building
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-1">
          {results.map((building) => (
            <li
              key={building.name}
              className="flex items-center justify-between gap-3 border-b border-def/40 px-1 pb-1"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold capitalize">{building.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(building);
                  setQuantity("1");
                }}
                className="flex shrink-0 items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground disabled:opacity-60"
              >
                Select
              </button>
            </li>
          ))}
          {query.trim() === "" ? (
            <li className="px-1 py-4 text-center text-sm text-muted-foreground">
              Type a building name to find it.
            </li>
          ) : results.length === 0 ? (
            <li className="px-1 py-4 text-center text-sm text-muted-foreground">
              No building matches "{query}".
            </li>
          ) : null}
        </ul>
      )}

      {message && <p className="text-center text-xs font-semibold text-primary">{message}</p>}

      <div className="space-y-1 pt-2">
        <p className="text-center text-xs font-bold uppercase tracking-wide text-primary">
          My buildings
        </p>
        {owned.length === 0 ? (
          <p className="px-4 py-3 text-center text-sm text-muted-foreground">
            Nothing added yet — pick a building, its era and a quantity.
          </p>
        ) : (
          <ul className="space-y-1 text-xs">
            {owned.map((building, index) => (
              <li
                key={`${building.name}-${building.era}-${index}`}
                className="flex items-center justify-between gap-3 border-b border-def/40 px-1 pb-1"
              >
                <span className="min-w-0 flex-1 truncate font-bold capitalize text-foreground">
                  {building.name}
                </span>
                <span className="shrink-0 text-muted-foreground">{building.era || "-"}</span>
                <span className="w-8 shrink-0 text-right font-bold tabular-nums text-primary">
                  ×{building.quantity ?? 1}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
