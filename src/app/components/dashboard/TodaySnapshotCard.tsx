import { Link } from "react-router";
import { DollarSign, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";

type TodaySnapshotCardProps = {
  ventasValue: string;
  changeLabel: string;
  pendingCount: number;
};

/**
 * Resumen compacto del día: ventas + enlace a pendientes.
 * Stock crítico vive aparte para no duplicar foco.
 */
export function TodaySnapshotCard({
  ventasValue,
  changeLabel,
  pendingCount,
}: TodaySnapshotCardProps) {
  return (
    <Card className="flex h-full flex-col border-blue-100 bg-gradient-to-br from-blue-50/90 to-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-900/80">
            Hoy · ventas
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {ventasValue}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-green-700">
            <TrendingUp className="size-4 shrink-0" aria-hidden />
            {changeLabel}
          </p>
        </div>
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100/90 text-blue-700"
          aria-hidden
        >
          <DollarSign className="size-6" />
        </div>
      </div>

      <div className="mt-5 border-t border-blue-100/80 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Cola operativa
        </p>
        {pendingCount > 0 ? (
          <p className="mt-2 text-sm text-gray-800">
            <Link
              to="/punto-venta"
              className="font-semibold text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
            >
              {pendingCount}{" "}
              {pendingCount === 1 ? "pedido pendiente" : "pedidos pendientes"}
            </Link>
            <span className="text-gray-600">
              {" "}
              — completá o facturá en Punto de venta.
            </span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Sin pedidos pendientes en cola.
          </p>
        )}
      </div>
    </Card>
  );
}
