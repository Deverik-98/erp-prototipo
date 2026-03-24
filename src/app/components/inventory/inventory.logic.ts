import type { InventoryGroup, InventoryGroupMode, InventoryProduct } from "./inventory.types";

export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Stock en o por debajo del mínimo sugerido (alerta operativa). */
export function isCriticalStock(p: InventoryProduct) {
  return p.stockActual <= p.stockMinimo;
}

export function lineInventoryValue(p: InventoryProduct) {
  return p.stockActual * p.costoARS;
}

export function summarizeInventory(products: InventoryProduct[]) {
  const totalProductos = products.length;
  const stockCritico = products.filter(isCriticalStock).length;
  const valorInventario = products.reduce(
    (acc, p) => acc + lineInventoryValue(p),
    0
  );
  return { totalProductos, stockCritico, valorInventario };
}

/** Totales agregados para la cabecera de un grupo colapsable. */
export function summarizeInventoryGroup(items: InventoryProduct[]) {
  const lineas = items.length;
  const stockTotal = items.reduce((acc, p) => acc + p.stockActual, 0);
  const valorTotal = items.reduce((acc, p) => acc + lineInventoryValue(p), 0);
  const alertas = items.filter(isCriticalStock).length;
  return { lineas, stockTotal, valorTotal, alertas };
}

export function groupInventoryProducts(
  items: InventoryProduct[],
  mode: InventoryGroupMode
): InventoryGroup[] {
  if (mode === "none") {
    return [{ key: "_flat", label: "", items }];
  }
  const map = new Map<string, InventoryProduct[]>();
  for (const item of items) {
    const raw =
      mode === "familia"
        ? item.familia
        : (item.variante?.trim() || "Sin variante definida");
    const key = raw;
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "es"))
    .map(([key, groupItems]) => ({
      key,
      label: key,
      items: groupItems.sort((x, y) => x.nombre.localeCompare(y.nombre, "es")),
    }));
}

const CSV_SEP = ";";

function csvCell(v: string | number) {
  const s = String(v);
  if (/[;\r\n"]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Exporta lo visible (respeta filtros). UTF-8 con BOM para Excel en español. */
export function downloadInventoryCsv(
  rows: InventoryProduct[],
  filename = "inventario-demoapp.csv"
) {
  const headers = [
    "nombre",
    "sku",
    "categoria",
    "familia",
    "variante",
    "presentacion",
    "produccion_propia",
    "costo_ars",
    "precio_ars",
    "stock_actual",
    "stock_minimo",
    "valor_stock_ars",
    "alerta_stock",
  ];
  const lines = [
    headers.join(CSV_SEP),
    ...rows.map((r) =>
      [
        csvCell(r.nombre),
        csvCell(r.sku),
        csvCell(r.categoria),
        csvCell(r.familia),
        csvCell(r.variante ?? ""),
        csvCell(r.presentacion),
        csvCell(r.produccionPropia ? "si" : "no"),
        csvCell(r.costoARS),
        csvCell(r.precioARS),
        csvCell(r.stockActual),
        csvCell(r.stockMinimo),
        csvCell(lineInventoryValue(r)),
        csvCell(isCriticalStock(r) ? "bajo_minimo" : "ok"),
      ].join(CSV_SEP)
    ),
  ];
  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}
