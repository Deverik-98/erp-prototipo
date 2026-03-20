import { Card } from "../ui/card";
import { CriticalStockCard } from "./CriticalStockCard";
import { MonthContextCard } from "./MonthContextCard";
import type { CompactKpiItem } from "./CompactPeriodKpis";

type DashboardStockContextSectionProps = {
  kpiItems: CompactKpiItem[];
};

/**
 * Un solo marco visual: alinea márgenes, evita doble sombra y permite
 * repartir altura con intención (CTA de stock anclado abajo si la derecha es más alta).
 */
export function DashboardStockContextSection({
  kpiItems,
}: DashboardStockContextSectionProps) {
  return (
    <Card className="overflow-hidden border-gray-200 p-0 shadow-sm">
      <div className="grid lg:grid-cols-12 lg:items-stretch">
        <div className="flex min-h-0 flex-col border-b border-gray-100 p-4 sm:p-5 lg:col-span-7 lg:border-b-0 lg:border-r lg:border-gray-100">
          <CriticalStockCard embedded />
        </div>
        <div className="flex min-h-0 flex-col lg:col-span-5 lg:h-full">
          <MonthContextCard kpiItems={kpiItems} embedded />
        </div>
      </div>
    </Card>
  );
}
