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

const BELOW_MINIMUM_TOTAL = 7;

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

function levelLabel(level: "critical" | "warning" | "low") {
  if (level === "critical") return "Crítico";
  if (level === "warning") return "Urgente";
  return "Atención";
}

function StockRow({ item }: { item: CriticalStockItem }) {
  const level = severity(item.current, item.minimum);
  const fillPct = Math.min(100, Math.round((item.current / item.minimum) * 100));
  const deficit = Math.max(0, item.minimum - item.current);

  return (
    <li>
      <div
        className={cn(
          "rounded-lg border px-3 py-2.5 sm:flex sm:items-center sm:gap-4 sm:py-2",
          level === "critical" && "border-red-200 bg-red-50/50",
          level === "warning" && "border-amber-200 bg-amber-50/40",
          level === "low" && "border-orange-200 bg-orange-50/35"
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
              level === "critical" && "bg-red-100 text-red-800",
              level === "warning" && "bg-amber-100 text-amber-900",
              level === "low" && "bg-orange-100 text-orange-900"
            )}
          >
            {levelLabel(level)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-gray-900">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-600">
              <span className="font-semibold tabular-nums text-gray-800">
                {item.current}
              </span>
              <span className="text-gray-400">/</span>
              <span className="tabular-nums">{item.minimum}</span>
              <span className="text-gray-500"> {item.unit}</span>
              {deficit > 0 ? (
                <>
                  <span className="text-gray-300"> · </span>
                  <span className="text-gray-700">
                    faltan <span className="font-medium tabular-nums">+{deficit}</span>
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 sm:mt-0 sm:w-[min(100%,14rem)] sm:shrink-0">
          <div
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-gray-200/90"
            role="progressbar"
            aria-valuenow={item.current}
            aria-valuemin={0}
            aria-valuemax={item.minimum}
            aria-label={`Stock de ${item.name}: ${fillPct} por ciento del mínimo recomendado`}
          >
            <div
              className={cn(
                "h-full rounded-full",
                level === "critical" && "bg-red-500",
                level === "warning" && "bg-amber-500",
                level === "low" && "bg-orange-400"
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <span
            className={cn(
              "w-9 shrink-0 text-right text-sm font-bold tabular-nums",
              level === "critical" && "text-red-700",
              level === "warning" && "text-amber-800",
              level === "low" && "text-orange-800"
            )}
          >
            {fillPct}%
          </span>
        </div>
      </div>
    </li>
  );
}

function StockHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700"
          aria-hidden
        >
          <ClipboardList className="size-[1.15rem]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-gray-900">
            Lo más urgente en depósito
          </h2>
          <p className="text-xs text-gray-500">
            Top 3 por desvío ·{" "}
            <span className="font-medium text-gray-600">
              {BELOW_MINIMUM_TOTAL}
            </span>{" "}
            bajo mínimo en total
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0" asChild>
        <Link to="/inventario">Ver inventario</Link>
      </Button>
    </div>
  );
}

type CriticalStockCardProps = {
  /** Panel dentro de DashboardStockContextSection (sin Card propia). */
  embedded?: boolean;
};

export function CriticalStockCard({ embedded = false }: CriticalStockCardProps) {
  const list = (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <StockRow key={item.id} item={item} />
      ))}
    </ul>
  );

  const cta = (
    <Button
      variant="outline"
      className="w-full border-blue-600 text-blue-700 hover:bg-blue-50"
      asChild
    >
      <Link to="/inventario">Ajustar stock y pedidos</Link>
    </Button>
  );

  if (embedded) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <StockHeader />
        {list}
        {/* Espaciador flexible: si la columna derecha define la altura, el CTA queda abajo de forma deliberada */}
        <div className="min-h-3 flex-1" aria-hidden />
        <div className="pt-3">{cta}</div>
      </div>
    );
  }

  return (
    <Card className="flex w-full flex-col self-start p-4 shadow-sm sm:p-5">
      <StockHeader />
      {list}
      <div className="pt-4">{cta}</div>
    </Card>
  );
}
