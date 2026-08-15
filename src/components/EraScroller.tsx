import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ERAS } from "@/lib/boostData";

export function EraScroller({
  value,
  onChange,
}: {
  value: string;
  onChange: (era: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const index = ERAS.findIndex((era) => era === value);
    listRef.current?.scrollTo({ top: Math.max(0, index - 1) * 36, behavior: "auto" });
  }, [open, value]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Choose era"
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-primary/50 bg-secondary/60 px-3 py-2 text-sm font-semibold"
      >
        <span className="truncate">{value || "Choose era"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Eras"
          className="absolute z-30 mt-1 max-h-[180px] w-full overflow-y-auto rounded-lg border border-primary/50 bg-[oklch(0.12_0.04_268)] shadow-lg"
        >
          {ERAS.map((era) => (
            <button
              key={era}
              type="button"
              role="option"
              aria-selected={era === value}
              onClick={() => {
                onChange(era);
                setOpen(false);
              }}
              className={`flex h-9 w-full items-center px-3 text-left text-sm ${
                era === value ? "font-bold text-primary" : "text-foreground/85"
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
