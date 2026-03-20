import { Link } from "react-router";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

export type BusinessSummaryCardProps = {
  /** Texto legible para <time> (accesibilidad) */
  dateIso: string;
  /** Etiqueta visible de fecha / hora de corte */
  dateDisplay: string;
  ventas: string;
  ventasVsAyer: string;
  ventasSube: boolean;
  pedidosHoy: number;
  ticketPromedio: string;
  pendientes: number;
  alertasStock: number;
};

/**
 * Bloque principal del dashboard: métricas del día en rejilla densa,
 * tipografía tabular y jerarquía clara (etiqueta → valor → contexto).
 */
export function BusinessSummaryCard({
  dateIso,
  dateDisplay,
  ventas,
  ventasVsAyer,
  ventasSube,
  pedidosHoy,
  ticketPromedio,
  pendientes,
  alertasStock,
}: BusinessSummaryCardProps) {
  return (
    <Card
      className="overflow-hidden border-gray-200 shadow-sm"
      role="region"
      aria-labelledby="business-summary-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-gray-100 bg-slate-50/90 px-3 py-2">
        <h2
          id="business-summary-title"
          className="text-sm font-semibold tracking-tight text-gray-900"
        >
          Cómo va hoy
        </h2>
        <time
          dateTime={dateIso}
          className="text-xs font-medium text-gray-500 tabular-nums"
        >
          {dateDisplay}
        </time>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-y divide-gray-100 bg-white lg:grid-cols-4 lg:divide-y-0">
        <div className="p-2.5 sm:p-3 lg:py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Facturación hoy
          </dt>
          <dd className="mt-1 space-y-1">
            <p className="text-lg font-bold tabular-nums tracking-tight text-gray-900 sm:text-xl">
              {ventas}
            </p>
            <p
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
                ventasSube ? "text-green-700" : "text-red-700"
              )}
            >
              {ventasSube ? (
                <TrendingUp className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <TrendingDown className="size-3.5 shrink-0" aria-hidden />
              )}
              {ventasVsAyer}
            </p>
          </dd>
        </div>

        <div className="p-2.5 sm:p-3 lg:py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Pedidos registrados
          </dt>
          <dd className="mt-1 space-y-1">
            <p className="text-lg font-bold tabular-nums tracking-tight text-gray-900 sm:text-xl">
              {pedidosHoy}
            </p>
            <p className="text-xs text-gray-500">
              Ticket medio{" "}
              <span className="font-medium text-gray-700 tabular-nums">
                {ticketPromedio}
              </span>
            </p>
          </dd>
        </div>

        <div className="p-2.5 sm:p-3 lg:py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Por completar
          </dt>
          <dd className="mt-1 space-y-1">
            {pendientes > 0 ? (
              <>
                <Link
                  to="/punto-venta"
                  className="block text-lg font-bold tabular-nums tracking-tight text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm sm:text-xl"
                >
                  {pendientes}
                </Link>
                <p className="text-xs text-gray-500">Revisalos en punto de venta</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold tabular-nums tracking-tight text-gray-900 sm:text-xl">
                  0
                </p>
                <p className="text-xs text-gray-500">Nada pendiente en caja</p>
              </>
            )}
          </dd>
        </div>

        <div className="p-2.5 sm:p-3 lg:py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Stock bajo mínimo
          </dt>
          <dd className="mt-1 space-y-1">
            <Link
              to="/inventario"
              className={cn(
                "block text-lg font-bold tabular-nums tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm sm:text-xl",
                alertasStock > 0 ? "text-amber-800" : "text-gray-900"
              )}
            >
              {alertasStock}
            </Link>
            <p className="text-xs text-gray-500">Productos a reponer</p>
          </dd>
        </div>
      </dl>
    </Card>
  );
}
