import { Link } from "react-router";
import { ClipboardList } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export type CriticalStockItem = {
  id: string;
  name: string;
  current: number;
  minimum: number;
  unit: string;
};

const items: CriticalStockItem[] = [
  { id: "1", name: "Leche entera 1L", current: 12, minimum: 20, unit: "unidades" },
  { id: "2", name: "Queso fresco 500g", current: 5, minimum: 15, unit: "unidades" },
  { id: "3", name: "Yogurt natural", current: 8, minimum: 15, unit: "unidades" },
];

function severity(current: number, minimum: number) {
  const ratio = minimum > 0 ? current / minimum : 1;
  if (ratio < 0.35) return "critical" as const;
  if (ratio < 0.65) return "warning" as const;
  return "low" as const;
}

function StockRow({ item }: { item: CriticalStockItem }) {
  const level = severity(item.current, item.minimum);
  const fillPct = Math.min(100, Math.round((item.current / item.minimum) * 100));

  return (
    <li>
      <div
        className={cn(
          "rounded-lg border px-3 py-3 sm:px-4",
          level === "critical" && "border-red-200 bg-red-50/50",
          level === "warning" && "border-amber-200 bg-amber-50/40",
          level === "low" && "border-orange-100 bg-orange-50/30"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug text-gray-900">{item.name}</p>
            <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
              Quedan{" "}
              <span className="font-medium text-gray-800">
                {item.current} {item.unit}
              </span>
              <span className="text-gray-500">
                {" "}
                · mínimo sugerido {item.minimum}
              </span>
            </p>
            <div className="mt-2">
              <div
                className="flex h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-gray-200/80"
                role="progressbar"
                aria-valuenow={item.current}
                aria-valuemin={0}
                aria-valuemax={item.minimum}
                aria-label={`Nivel de stock de ${item.name}: ${item.current} de ${item.minimum} unidades mínimas`}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    level === "critical" && "bg-red-500",
                    level === "warning" && "bg-amber-500",
                    level === "low" && "bg-orange-400"
                  )}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                {fillPct}% del stock mínimo objetivo
              </p>
            </div>
          </div>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-lg font-bold",
              level === "critical" && "bg-red-100 text-red-700",
              level === "warning" && "bg-amber-100 text-amber-800",
              level === "low" && "bg-orange-100 text-orange-800"
            )}
            aria-hidden
          >
            !
          </span>
        </div>
      </div>
    </li>
  );
}

/**
 * Lista priorizada por urgencia visual (barra + color), CTA claro hacia inventario.
 */
export function CriticalStockCard() {
  return (
    <Card className="flex h-full flex-col p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700"
          aria-hidden
        >
          <ClipboardList className="size-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900">Stock crítico</h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            Los 3 más urgentes de 7 ítems bajo mínimo
          </p>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500 sm:text-sm">
        Mayor desvío frente al mínimo (3 de 7 ítems bajo mínimo).
      </p>

      <ul className="mt-3 flex flex-1 flex-col gap-2.5">
        {items.map((item) => (
          <StockRow key={item.id} item={item} />
        ))}
      </ul>

      <Button
        variant="outline"
        className="mt-4 w-full border-blue-600 text-blue-700 hover:bg-blue-50"
        asChild
      >
        <Link to="/inventario">Gestionar inventario</Link>
      </Button>
    </Card>
  );
}
