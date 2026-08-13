import { Swords } from "lucide-react";
import type { BoostRow } from "@/lib/boostData";

function Marker({ marker }: { marker: BoostRow["marker"] }) {
  if (marker === "none") return <div className="h-7 w-7" />;
  const glyph = marker === "flag" ? "🎏" : marker === "pyramid" ? "🏛" : "🏅";
  return (
    <div className="flex h-7 w-7 items-center justify-center text-xl leading-none">
      <span aria-hidden>{glyph}</span>
    </div>
  );
}

/** Crossed swords laid over a colored shield, as in the game UI. */
function BoostIcon({ tone }: { tone: "atk" | "def" }) {
  const fill = tone === "atk" ? "var(--atk)" : "var(--def)";
  return (
    <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path
          d="M12 2.5 20 5v7.2c0 4.4-3.2 7.7-8 9.3-4.8-1.6-8-4.9-8-9.3V5l8-2.5Z"
          fill={fill}
        />
      </svg>
      <Swords
        className="absolute h-4 w-4 text-foreground"
        style={{ transform: "translate(-2px,-1px)" }}
        strokeWidth={2.5}
      />
    </span>
  );
}

function Value({ value, align }: { value: number | null; align: "left" | "right" }) {
  return (
    <span
      className={`w-14 font-bold tabular-nums text-foreground ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {value === null ? "-" : value}
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
  return (
    <div className="flex items-center gap-2">
      <Value value={atk} align="right" />
      <BoostIcon tone={tone} />
      <Value value={def} align="left" />
    </div>
  );
}

export function BattleBoosts({ rows }: { rows: BoostRow[] }) {
  return (
    <section className="space-y-2 pt-3">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center justify-center gap-6">
          <Pair atk={row.attAtk} def={row.attDef} tone="atk" />
          <Marker marker={row.marker} />
          <Pair atk={row.defAtk} def={row.defDef} tone="def" />
        </div>
      ))}
    </section>
  );
}