import { Flag, Landmark, Medal, Shield, Swords } from "lucide-react";
import type { BoostRow } from "@/lib/boostData";

function Marker({ marker }: { marker: BoostRow["marker"] }) {
  if (marker === "none") return <div className="h-8 w-8" />;
  const Icon = marker === "flag" ? Flag : marker === "pyramid" ? Landmark : Medal;
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg glass-inset">
      <Icon className="h-4 w-4 text-primary" />
    </div>
  );
}

function Value({ value }: { value: number | null }) {
  return (
    <span className="w-12 text-right font-semibold tabular-nums text-foreground">
      {value === null ? "-" : value.toLocaleString("it-IT")}
    </span>
  );
}

function Pair({
  atk,
  def,
  tone,
}: {
  atk: number | null;
  def: number | null;
  tone: "atk" | "def";
}) {
  const color = tone === "atk" ? "text-atk" : "text-def";
  return (
    <div className="flex items-center gap-1.5">
      <Value value={atk} />
      <Swords className={`h-4 w-4 ${color}`} />
      <Shield className={`h-4 w-4 ${color}`} />
      <span className="w-12 text-left font-semibold tabular-nums text-foreground">
        {def === null ? "-" : def.toLocaleString("it-IT")}
      </span>
    </div>
  );
}

export function BattleBoosts({ rows }: { rows: BoostRow[] }) {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span>Attacking army</span>
        <span>Defending army</span>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-accent/30"
          >
            <Pair atk={row.attAtk} def={row.attDef} tone="atk" />
            <Marker marker={row.marker} />
            <Pair atk={row.defAtk} def={row.defDef} tone="def" />
          </div>
        ))}
      </div>
    </section>
  );
}