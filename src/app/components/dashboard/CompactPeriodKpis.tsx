import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

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
  embedded?: boolean;
  sectionHeading?: string;
  sectionSubheading?: string;
  density?: "compact" | "featured";
  /**
   * strip = una franja densa (valor prominente, icono pequeño); mejor para columnas angostas.
   * columns = rejilla clásica 3 columnas.
   */
  layout?: "columns" | "strip";
};

function KpiHeader({
  title,
  subheading,
  compact,
}: {
  title: string;
  subheading?: string;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        "border-b border-gray-100 bg-gray-50/90",
        compact ? "px-3 py-2 sm:px-3.5" : "px-3 py-2.5 sm:px-4 sm:py-3"
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h2>
      </div>
      {subheading ? (
        <p className="mt-1 text-xs leading-snug text-gray-600">{subheading}</p>
      ) : null}
    </div>
  );
}

function KpiListStrip({ items }: { items: CompactKpiItem[] }) {
  return (
    <ul className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:items-start">
      {items.map((card) => {
        const Icon = card.icon;
        return (
          <li key={card.id} className="flex gap-2.5 p-3 sm:p-3.5">
            <Icon
              className="mt-0.5 size-4 shrink-0 text-blue-600"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-lg font-bold tabular-nums leading-none text-gray-900 sm:text-xl">
                {card.value}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                {card.title}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                {card.trend === "up" && (
                  <TrendingUp className="size-3 shrink-0 text-green-600" aria-hidden />
                )}
                {card.trend === "down" && (
                  <TrendingDown className="size-3 shrink-0 text-red-600" aria-hidden />
                )}
                <span className="leading-snug">{card.hint}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function KpiListColumns({
  items,
  featured,
}: {
  items: CompactKpiItem[];
  featured: boolean;
}) {
  return (
    <ul className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:items-start">
      {items.map((card) => {
        const Icon = card.icon;
        return (
          <li
            key={card.id}
            className={cn(
              "flex gap-3",
              featured
                ? "p-4 sm:flex-col sm:items-start sm:gap-2 sm:p-4 md:p-5"
                : "gap-2.5 p-3 sm:flex-col sm:gap-1 sm:p-3.5"
            )}
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600",
                featured ? "size-11 sm:mb-0" : "size-9 sm:mb-1 sm:size-8"
              )}
            >
              <Icon
                className={
                  featured ? "size-[1.35rem]" : "size-4 sm:size-[0.95rem]"
                }
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-semibold uppercase leading-tight text-gray-500",
                  featured ? "text-xs tracking-wide" : "text-[10px] sm:text-[11px]"
                )}
              >
                {card.title}
              </p>
              <p
                className={cn(
                  "mt-1 font-bold tabular-nums tracking-tight text-gray-900",
                  featured ? "text-xl sm:text-2xl" : "mt-0.5 text-base sm:text-lg"
                )}
              >
                {card.value}
              </p>
              <div className="mt-1 flex items-start gap-1">
                {card.trend === "up" && (
                  <TrendingUp
                    className={cn(
                      "mt-0.5 shrink-0 text-green-600",
                      featured ? "size-4" : "size-3"
                    )}
                    aria-hidden
                  />
                )}
                {card.trend === "down" && (
                  <TrendingDown
                    className={cn(
                      "mt-0.5 shrink-0 text-red-600",
                      featured ? "size-4" : "size-3"
                    )}
                    aria-hidden
                  />
                )}
                <p
                  className={cn(
                    "leading-snug text-gray-600",
                    featured ? "text-sm" : "text-[10px] sm:text-xs"
                  )}
                >
                  {card.hint}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CompactPeriodKpis({
  items,
  embedded,
  sectionHeading = "Últimos 7 días",
  sectionSubheading,
  density = "compact",
  layout = "columns",
}: CompactPeriodKpisProps) {
  const featured = density === "featured";
  const strip = layout === "strip";

  const body = strip ? (
    <KpiListStrip items={items} />
  ) : (
    <KpiListColumns items={items} featured={featured} />
  );

  if (embedded) {
    return (
      <div className="bg-white">
        <KpiHeader
          title={sectionHeading}
          subheading={sectionSubheading}
          compact={strip}
        />
        {body}
      </div>
    );
  }
  return (
    <Card className="overflow-hidden border-gray-200 p-0 shadow-sm">
      <KpiHeader
        title={sectionHeading}
        subheading={sectionSubheading}
        compact={strip}
      />
      {body}
    </Card>
  );
}
