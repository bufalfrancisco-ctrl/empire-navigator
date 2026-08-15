import { Swords } from "lucide-react";
import type { BoostRow } from "@/lib/boostData";

/** Which battle context each workbook marker stands for. */
const CONTEXT: Record<BoostRow["marker"], string> = {
  none: "Normal",
  flag: "GbG",
  pyramid: "GE",
  medal: "QI",
};

function Marker({ marker }: { marker: BoostRow["marker"] }) {
  return (
    <div className="flex h-7 w-7 items-center justify-center" aria-hidden>
      {marker === "flag" && (
        <svg viewBox="0 0 24 24" className="h-7 w-7">
          <rect x="8" y="2" width="8" height="3" rx="1" fill="oklch(0.75 0.16 145)" />
          <rect x="7" y="5" width="10" height="14" rx="1.5" fill="oklch(0.68 0.2 145)" />
          <rect x="7" y="9" width="10" height="1.6" fill="oklch(0.85 0.14 145)" />
          <rect x="7" y="13" width="10" height="1.6" fill="oklch(0.85 0.14 145)" />
          <rect x="10" y="19" width="4" height="3" fill="oklch(0.5 0.12 145)" />
        </svg>
      )}
      {marker === "pyramid" && (
        <svg viewBox="0 0 24 24" className="h-7 w-7">
          <polygon points="12,3 17,8 7,8" fill="oklch(0.82 0.14 75)" />
          <rect x="6" y="9" width="12" height="3.5" fill="oklch(0.76 0.14 70)" />
          <rect x="4.5" y="13.5" width="15" height="3.5" fill="oklch(0.7 0.13 65)" />
          <rect x="3" y="18" width="18" height="3.5" fill="oklch(0.64 0.12 62)" />
        </svg>
      )}
      {marker === "medal" && (
        <svg viewBox="0 0 24 24" className="h-7 w-7">
          <circle cx="12" cy="12" r="9.5" fill="oklch(0.82 0.15 85)" />
          <circle cx="12" cy="12" r="7" fill="oklch(0.72 0.14 78)" />
          <path
            d="M8.5 11.5h7v4.5a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4.5Z"
            fill="oklch(0.9 0.09 85)"
          />
          <rect x="9" y="8.5" width="6" height="3" rx="1.5" fill="oklch(0.9 0.09 85)" />
        </svg>
      )}
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
    <section className="space-y-3 pt-3">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
            {CONTEXT[row.marker]}
          </span>
          <div className="flex items-center justify-center gap-4">
            <Pair atk={row.attAtk} def={row.attDef} tone="atk" />
            <Marker marker={row.marker} />
            <Pair atk={row.defAtk} def={row.defDef} tone="def" />
          </div>
        </div>
      ))}
    </section>
  );
}