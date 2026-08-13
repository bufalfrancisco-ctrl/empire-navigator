import { useEffect, useRef } from "react";
import { MODES, type BoostMode } from "@/lib/boostData";

const ITEM_H = 40;

export function ModeSelector({
  value,
  onChange,
}: {
  value: BoostMode;
  onChange: (mode: BoostMode) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmatic = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const index = MODES.findIndex((m) => m.id === value);
    if (Math.round(el.scrollTop / ITEM_H) === index) return;
    programmatic.current = true;
    el.scrollTo({ top: index * ITEM_H, behavior: "smooth" });
    setTimeout(() => (programmatic.current = false), 400);
  }, [value]);

  const handleScroll = () => {
    if (programmatic.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const index = Math.min(
        MODES.length - 1,
        Math.max(0, Math.round(el.scrollTop / ITEM_H)),
      );
      const mode = MODES[index];
      if (mode && mode.id !== value) onChange(mode.id);
    }, 90);
  };

  return (
    <div className="relative select-none">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-10 -translate-y-1/2 glass-inset rounded-xl ring-1 ring-primary/30"
        aria-hidden
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        role="listbox"
        aria-label="Select section"
        tabIndex={0}
        className="relative h-[120px] snap-y snap-mandatory overflow-y-auto py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MODES.map((mode) => {
          const active = mode.id === value;
          return (
            <button
              key={mode.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onChange(mode.id)}
              className={`flex h-10 w-full snap-center items-center justify-center text-display text-lg font-bold transition-all duration-200 ${
                active
                  ? "scale-105 text-foreground drop-shadow-[0_0_12px_oklch(0.82_0.15_85_/_45%)]"
                  : "scale-95 text-muted-foreground/70"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}