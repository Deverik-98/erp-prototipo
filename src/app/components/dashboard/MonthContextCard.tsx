import { FileDown, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CompactPeriodKpis, type CompactKpiItem } from "./CompactPeriodKpis";

const MONTH_LABEL = "Marzo 2026";
const PREV_MONTH_LABEL = "febrero";
const GROWTH_PCT = 15;
const MONTH_SALES_DISPLAY = "$ 186.200";
const MONTH_ORDERS = 312;

type MonthContextCardProps = {
  kpiItems: CompactKpiItem[];
  embedded?: boolean;
};

export function MonthContextCard({
  kpiItems,
  embedded,
}: MonthContextCardProps) {
  function handleDownloadPdf() {
    toast.info("Vista previa", {
      description:
        "En producción se generaría el PDF con ventas, IVA y desglose por canal desde el servidor.",
    });
  }

  const monthBlock = (
    <div className="border-t border-emerald-100/90 bg-emerald-50/90 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800"
            aria-hidden
          >
            <Sparkles className="size-[1.1rem]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-900/75">
              Cierre del mes
            </p>
            <p className="text-sm font-bold text-gray-900">
              {MONTH_LABEL}
              <span className="font-normal text-gray-600"> · POS</span>
            </p>
            <p className="text-[11px] text-gray-600">
              Acumulado en POS · datos de demostración
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="flex gap-2">
            <div className="rounded-md border border-emerald-200/80 bg-white px-2.5 py-1.5 shadow-sm">
              <p className="text-[9px] font-semibold uppercase text-emerald-900/65">
                Facturación
              </p>
              <p className="text-sm font-bold tabular-nums text-gray-900">
                {MONTH_SALES_DISPLAY}
              </p>
            </div>
            <div className="rounded-md border border-emerald-200/80 bg-white px-2.5 py-1.5 shadow-sm">
              <p className="text-[9px] font-semibold uppercase text-emerald-900/65">
                Pedidos
              </p>
              <p className="text-sm font-bold tabular-nums text-gray-900">
                {MONTH_ORDERS}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900">
            <TrendingUp className="size-3.5" aria-hidden />
            +{GROWTH_PCT}% vs. {PREV_MONTH_LABEL}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 border-blue-200 bg-white text-blue-800 hover:bg-blue-50"
            onClick={handleDownloadPdf}
          >
            <FileDown className="size-4" aria-hidden />
            Reporte PDF
          </Button>
        </div>
      </div>
    </div>
  );

  const weekBlock = (
    <CompactPeriodKpis
      items={kpiItems}
      embedded
      layout="strip"
      sectionHeading="Esta semana"
      sectionSubheading="Mismo periodo de 7 días vs. la semana anterior."
    />
  );

  if (embedded) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1">{weekBlock}</div>
        <div className="shrink-0">{monthBlock}</div>
      </div>
    );
  }

  return (
    <Card className="w-full self-start overflow-hidden border-gray-200 p-0 shadow-sm">
      {weekBlock}
      {monthBlock}
    </Card>
  );
}
