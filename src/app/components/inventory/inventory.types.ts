/** Fila de inventario (demo; en producción vendría de API). */
export type InventoryProduct = {
  id: number;
  nombre: string;
  sku: string;
  categoria: string;
  /** Para agrupar ítems relacionados (ej. todas las leches). */
  familia: string;
  /** Sabor, tipo o formato comercial (tallas/colores en retail). */
  variante: string | null;
  /** Unidad de venta legible. */
  presentacion: string;
  costoARS: number;
  precioARS: number;
  stockActual: number;
  stockMinimo: number;
  /** Producción interna (elaboración propia) vs. compra / distribución. */
  produccionPropia: boolean;
};

export type InventoryGroupMode = "none" | "familia" | "variante";

export type InventoryGroup = {
  key: string;
  label: string;
  items: InventoryProduct[];
};
