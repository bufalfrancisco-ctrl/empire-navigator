import {
  Coins,
  Medal,
  Hammer,
  Package,
  CircleDollarSign,
  Puzzle,
  Boxes,
} from "lucide-react";
import { formatAmount, type DailyItem } from "@/lib/boostData";

const ICONS: { match: RegExp; Icon: typeof Coins; tone: string }[] = [
  { match: /coin|moneta|oro|gold/i, Icon: Coins, tone: "text-primary" },
  { match: /medal|medagl/i, Icon: Medal, tone: "text-primary" },
  { match: /tool|attrezz|strumen/i, Icon: Hammer, tone: "text-foreground" },
  { match: /good|bene|merc/i, Icon: Package, tone: "text-foreground/90" },
  { match: /suppl|provvis|risors/i, Icon: Boxes, tone: "text-foreground/90" },
  { match: /diamond|diamant/i, Icon: CircleDollarSign, tone: "text-def" },
];

function itemIcon(label: string) {
  return ICONS.find((entry) => entry.match.test(label)) ?? { Icon: Puzzle, tone: "text-def" };
}

/** Applies the Great Buildings production bonus to a raw daily value. */
function boosted(amount: number | null, bonus: number) {
  if (amount === null) return null;
  return Math.round(amount * (1 + bonus / 100));
}

export function DailyProduction({
  items,
  bonus,
}: {
  items: DailyItem[];
  bonus: number;
}) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-muted-foreground">
        Add a "Daily Production" sheet to FOE Database.xlsx (row 1 = headers; columns: item,
        amount, fragment) to see your daily values here.
      </p>
    );
  }

  return (
    <section className="space-y-3 pt-3">
      {bonus > 0 && (
        <p className="text-center text-xs font-semibold text-primary">
          Great Buildings bonus applied: +{bonus.toFixed(0)}%
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
        {items.map((item) => {
          const { Icon, tone } = itemIcon(item.label);
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 border-b border-def/60 px-1 pb-1"
              title={item.label}
            >
              <span className="relative inline-flex h-8 w-8 items-center justify-center">
                <Icon className={`h-7 w-7 ${tone}`} strokeWidth={2} />
                {item.fragment && (
                  <Puzzle
                    className="absolute -bottom-1 -right-1 h-4 w-4 text-def"
                    strokeWidth={2.5}
                  />
                )}
              </span>
              <span className="font-bold tabular-nums text-foreground">
                {formatAmount(boosted(item.amount, bonus))}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
