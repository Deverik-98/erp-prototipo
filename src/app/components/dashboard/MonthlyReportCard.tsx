import { FileDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const MONTH_LABEL = "marzo 2026";
const PREV_MONTH_LABEL = "febrero 2026";
const GROWTH_PCT = 15;

/**
 * Resumen mensual motivador + CTA secundario (PDF).
 * UX: refuerzo positivo primero, acción de descarga sin competir con tareas operativas.
 */
export function MonthlyReportCard() {
  function handleDownloadPdf() {
    toast.info("Demostración", {
      description:
        "En producción aquí se generaría el PDF con ventas, IVA y detalle por canal desde el servidor.",
    });
  }

  return (
    <Card className="flex h-full flex-col border-emerald-100/80 bg-gradient-to-br from-emerald-50/70 via-white to-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"
          aria-hidden
        >
          <Sparkles className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
            Reporte mensual
          </p>
          <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
            Tu rendimiento en {MONTH_LABEL}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
            <span className="font-semibold text-emerald-800">
              Ha crecido un {GROWTH_PCT}%
            </span>{" "}
            respecto a {PREV_MONTH_LABEL}.{" "}
            <span className="text-gray-800">¡Buen trabajo!</span>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Comparativa de ventas facturadas (demo). Período cerrado al último día hábil.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 border-t border-emerald-100/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          Descarga un resumen para reuniones o contabilidad.
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 sm:w-auto"
          onClick={handleDownloadPdf}
        >
          <FileDown className="size-4" aria-hidden />
          Descargar PDF
        </Button>
      </div>
    </Card>
  );
}
