import { FileDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const MONTH_LABEL = "Marzo 2026";
const PREV_MONTH_LABEL = "feb. 2026";
const GROWTH_PCT = 15;

/**
 * Variante compacta: una frase de resultado + CTA; evita altura despareja junto a stock crítico.
 */
export function MonthlyReportCard() {
  function handleDownloadPdf() {
    toast.info("Demostración", {
      description:
        "En producción aquí se generaría el PDF con ventas, IVA y detalle por canal desde el servidor.",
    });
  }

  return (
    <Card className="border-emerald-100/90 bg-gradient-to-r from-emerald-50/95 to-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 sm:size-10"
            aria-hidden
          >
            <Sparkles className="size-[1.15rem] sm:size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/90 sm:text-xs">
              Reporte mensual
            </p>
            <p className="mt-0.5 text-sm font-bold leading-snug text-gray-900 sm:text-base">
              <span className="text-emerald-800">+{GROWTH_PCT}%</span> vs.{" "}
              {PREV_MONTH_LABEL}
              <span className="font-normal text-gray-600">
                {" "}
                · ventas facturadas ({MONTH_LABEL.toLowerCase()})
              </span>
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
              Cierre al último día hábil · datos de ejemplo
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-full shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 sm:w-auto sm:self-center"
          onClick={handleDownloadPdf}
        >
          <FileDown className="size-4" aria-hidden />
          Descargar PDF
        </Button>
      </div>
    </Card>
  );
}
