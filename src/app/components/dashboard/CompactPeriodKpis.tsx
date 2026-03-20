import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";

export type CompactKpiItem = {
  id: string;
  title: string;
  value: string;
  hint: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

type CompactPeriodKpisProps = {
  items: CompactKpiItem[];
};

/**
 * Tres métricas en rejilla densa (rellena columna junto a stock crítico).
 */
export function CompactPeriodKpis({ items }: CompactPeriodKpisProps) {
  return (
    <Card className="overflow-hidden border-gray-200 p-0 shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/80 px-3 py-2 sm:px-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Indicadores · últimos 7 días
        </h2>
      </div>
      <ul className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((card) => {
          const Icon = card.icon;
          return (
            <li
              key={card.id}
              className="flex gap-2.5 p-3 sm:flex-col sm:gap-1 sm:p-3.5"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:mb-1 sm:size-8">
                <Icon className="size-4 text-blue-600 sm:size-[0.95rem]" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase leading-tight text-gray-500 sm:text-[11px]">
                  {card.title}
                </p>
                <p className="mt-0.5 text-base font-bold tabular-nums text-gray-900 sm:text-lg">
                  {card.value}
                </p>
                <div className="mt-0.5 flex items-start gap-0.5">
                  {card.trend === "up" && (
                    <TrendingUp
                      className="mt-0.5 size-3 shrink-0 text-green-600"
                      aria-hidden
                    />
                  )}
                  {card.trend === "down" && (
                    <TrendingDown
                      className="mt-0.5 size-3 shrink-0 text-red-600"
                      aria-hidden
                    />
                  )}
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    {card.hint}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
