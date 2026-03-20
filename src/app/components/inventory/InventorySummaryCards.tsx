import { AlertTriangle, Boxes, Wallet } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

type InventorySummaryCardsProps = {
  totalProductos: number;
  stockCritico: number;
  valorInventarioFormatted: string;
  className?: string;
};

/**
 * KPIs sobre el conjunto filtrado: totales coherentes con la tabla.
 */
export function InventorySummaryCards({
  totalProductos,
  stockCritico,
  valorInventarioFormatted,
  className,
}: InventorySummaryCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4",
        className
      )}
    >
      <Card className="border-gray-200 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700"
            aria-hidden
          >
            <Boxes className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total productos
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
              {totalProductos}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Según filtros y búsqueda actuales
            </p>
          </div>
        </div>
      </Card>

      <Card
        className={cn(
          "border p-4 shadow-sm",
          stockCritico > 0
            ? "border-amber-200 bg-amber-50/40"
            : "border-gray-200"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              stockCritico > 0 ? "bg-amber-100 text-amber-800" : "bg-green-50 text-green-700"
            )}
            aria-hidden
          >
            <AlertTriangle className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Stock crítico
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
              {stockCritico}
            </p>
            <p className="mt-0.5 text-xs text-gray-600">
              En o bajo el mínimo sugerido
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-gray-200 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"
            aria-hidden
          >
            <Wallet className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Valor de inventario
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-2xl">
              {valorInventarioFormatted}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Stock × costo (estimado)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
