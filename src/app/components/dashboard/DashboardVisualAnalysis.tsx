import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Card } from "../ui/card";
import { CategoryMixCard, SalesTrendCard } from "./DashboardCharts";

/**
 * Revelación progresiva: los gráficos son útiles pero secundarios frente a
 * alertas y acciones. Cerrado por defecto = menos ruido visual y scroll.
 */
export function DashboardVisualAnalysis() {
  return (
    <section
      aria-label="Análisis visual opcional"
      className="mb-6 sm:mb-8"
    >
      <Collapsible defaultOpen={false}>
        <Card className="overflow-hidden border-gray-200 p-0 shadow-sm">
          <CollapsibleTrigger className="group flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50 sm:items-center sm:gap-4 sm:px-5 sm:py-5 [&[data-state=open]]:bg-gray-50/80">
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Análisis visual
              </h2>
              <p className="mt-1 text-sm leading-snug text-gray-600">
                Tendencia de la semana y mix por categoría.{" "}
                <span className="text-gray-500">
                  Abrí cuando quieras profundizar; el inicio del panel prioriza
                  acciones y alertas.
                </span>
              </p>
            </div>
            <ChevronDown
              className="mt-0.5 size-5 shrink-0 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:mt-0"
              aria-hidden
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-4 sm:px-5 sm:py-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
                <SalesTrendCard variant="panel" />
                <CategoryMixCard variant="panel" />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </section>
  );
}
