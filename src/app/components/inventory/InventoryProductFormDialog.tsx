import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Layers, PackagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { cn } from "../ui/utils";
import type { InventoryProduct } from "./inventory.types";
import {
  VARIANT_DIMENSION_OPTIONS,
  type VariantDimensionValue,
  dimensionLabel,
} from "./variantDimensions";

type VariantDraft = {
  key: string;
  dimension: VariantDimensionValue;
  customDimension: string;
  valor: string;
  presentacion: string;
  skuSuffix: string;
  costo: string;
  precio: string;
  stock: string;
  minimo: string;
};

function newVariantRow(): VariantDraft {
  return {
    key: crypto.randomUUID(),
    dimension: "talla",
    customDimension: "",
    valor: "",
    presentacion: "",
    skuSuffix: "",
    costo: "",
    precio: "",
    stock: "0",
    minimo: "0",
  };
}

function parseMoney(s: string) {
  const t = s.trim().replace(/\$/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function parseIntLoose(s: string) {
  const n = parseInt(s.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

type InventoryProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextId: () => number;
  onCreate: (rows: InventoryProduct[]) => void;
};

/**
 * Alta de ítems con modelo general: una línea de producto + N variantes
 * (talla, color, peso, sabor, medida, etc.) o un solo SKU.
 */
export function InventoryProductFormDialog({
  open,
  onOpenChange,
  nextId,
  onCreate,
}: InventoryProductFormDialogProps) {
  const formId = useId();
  const [tab, setTab] = useState("general");

  const [nombreBase, setNombreBase] = useState("");
  const [familia, setFamilia] = useState("");
  const [categoria, setCategoria] = useState("Lácteos");
  const [skuPrefijo, setSkuPrefijo] = useState("");
  /** producción interna vs compra / distribución */
  const [origenProduccion, setOrigenProduccion] = useState(true);

  const [singleSku, setSingleSku] = useState(false);
  const [single, setSingle] = useState({
    presentacion: "",
    sku: "",
    costo: "",
    precio: "",
    stock: "0",
    minimo: "0",
  });

  const [variants, setVariants] = useState<VariantDraft[]>([newVariantRow()]);

  useEffect(() => {
    if (!open) return;
    setTab("general");
    setNombreBase("");
    setFamilia("");
    setCategoria("Lácteos");
    setSkuPrefijo("");
    setOrigenProduccion(true);
    setSingleSku(false);
    setSingle({
      presentacion: "",
      sku: "",
      costo: "",
      precio: "",
      stock: "0",
      minimo: "0",
    });
    setVariants([newVariantRow()]);
  }, [open]);

  const addVariant = () => setVariants((v) => [...v, newVariantRow()]);
  const removeVariant = (key: string) =>
    setVariants((v) => (v.length <= 1 ? v : v.filter((x) => x.key !== key)));

  const updateVariant = (key: string, patch: Partial<VariantDraft>) =>
    setVariants((v) => v.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nb = nombreBase.trim();
    const fam = familia.trim();
    if (!nb || !fam) {
      return;
    }
    const pref = skuPrefijo.trim().toUpperCase().replace(/\s+/g, "-");
    const produccionPropia = origenProduccion;

    const rows: InventoryProduct[] = [];

    if (singleSku) {
      const sku =
        single.sku.trim() ||
        (pref ? `${pref}-001` : `SKU-${nextId()}`);
      rows.push({
        id: nextId(),
        nombre: nb,
        sku,
        categoria,
        familia: fam,
        variante: null,
        presentacion: single.presentacion.trim() || "unidad",
        costoARS: parseMoney(single.costo),
        precioARS: parseMoney(single.precio),
        stockActual: parseIntLoose(single.stock),
        stockMinimo: parseIntLoose(single.minimo),
        produccionPropia,
      });
    } else {
      for (const v of variants) {
        const val = v.valor.trim();
        const suf = v.skuSuffix.trim().toUpperCase().replace(/\s+/g, "-");
        if (!val || !suf) continue;
        const dim = dimensionLabel(v.dimension, v.customDimension);
        const varianteStr = `${dim}: ${val}`;
        const sku = pref ? `${pref}-${suf}` : suf;
        rows.push({
          id: nextId(),
          nombre: nb,
          sku,
          categoria,
          familia: fam,
          variante: varianteStr,
          presentacion: v.presentacion.trim() || "—",
          costoARS: parseMoney(v.costo),
          precioARS: parseMoney(v.precio),
          stockActual: parseIntLoose(v.stock),
          stockMinimo: parseIntLoose(v.minimo),
          produccionPropia,
        });
      }
      if (rows.length === 0) {
        toast.error(
          "Agregá al menos una variante con valor y sufijo de SKU, o activá “Solo un SKU”."
        );
        return;
      }
    }

    onCreate(rows);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[min(92vh,800px)] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
        )}
      >
        <DialogHeader className="space-y-1 border-b border-gray-100 px-5 pb-4 pt-5 pr-14 text-left sm:px-6">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"
              aria-hidden
            >
              <PackagePlus className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle>Nuevo ítem de inventario</DialogTitle>
              <DialogDescription>
                Funciona para una tienda de ropa (talla/color), lácteos
                (sabor/peso), electrónica (modelo/capacidad) u otros rubros:
                definís la línea y luego cada variante con su propio SKU y
                stock.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <Tabs value={tab} onValueChange={setTab} className="gap-4">
              <TabsList className="grid h-auto w-full grid-cols-2 p-1 sm:w-full">
                <TabsTrigger value="general" className="gap-1.5 py-2">
                  <Layers className="size-4 opacity-70" aria-hidden />
                  Datos generales
                </TabsTrigger>
                <TabsTrigger value="variantes" className="gap-1.5 py-2">
                  Variantes y stock
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="inv-nombre">Nombre de la línea o producto</Label>
                    <Input
                      id="inv-nombre"
                      placeholder="Ej. Remera básica, Leche pasteurizada, Extensiones premium"
                      value={nombreBase}
                      onChange={(e) => setNombreBase(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inv-familia">Familia / línea comercial</Label>
                    <Input
                      id="inv-familia"
                      placeholder="Ej. Leche, Remeras, Cabello"
                      value={familia}
                      onChange={(e) => setFamilia(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría contable / interna</Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger aria-label="Categoría">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lácteos">Lácteos</SelectItem>
                        <SelectItem value="Textil">Textil</SelectItem>
                        <SelectItem value="Belleza">Belleza</SelectItem>
                        <SelectItem value="Electrónica">Electrónica</SelectItem>
                        <SelectItem value="Materia prima">Materia prima</SelectItem>
                        <SelectItem value="Empaque">Empaque</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="inv-sku-pref">Prefijo de SKU (opcional)</Label>
                    <Input
                      id="inv-sku-pref"
                      placeholder="Ej. REM, LEC, EXT — se concatena con el sufijo de cada variante"
                      value={skuPrefijo}
                      onChange={(e) => setSkuPrefijo(e.target.value)}
                      className="font-mono uppercase"
                    />
                    <p className="text-xs text-gray-500">
                      Si lo dejás vacío, cada variante puede usar un SKU completo en la siguiente pestaña.
                    </p>
                  </div>
                </div>

                <Separator />

                <fieldset className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4">
                  <legend className="px-1 text-sm font-semibold text-gray-900">
                    Origen del ítem
                  </legend>
                  <p className="text-xs text-gray-600">
                    <strong>Producción interna</strong> = elaborás o ensamblás en tu
                    local / planta. <strong>Compra · distribución</strong> = mercadería
                    que comprás terminada a un proveedor.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                    <label className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent p-2 has-[:checked]:border-blue-200 has-[:checked]:bg-white">
                      <input
                        type="radio"
                        name="origen"
                        className="mt-1"
                        checked={origenProduccion}
                        onChange={() => setOrigenProduccion(true)}
                      />
                      <span>
                        <span className="font-medium text-gray-900">
                          Producción interna
                        </span>
                        <span className="block text-xs text-gray-600">
                          Stock que generás o transformás vos.
                        </span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent p-2 has-[:checked]:border-blue-200 has-[:checked]:bg-white">
                      <input
                        type="radio"
                        name="origen"
                        className="mt-1"
                        checked={!origenProduccion}
                        onChange={() => setOrigenProduccion(false)}
                      />
                      <span>
                        <span className="font-medium text-gray-900">
                          Compra · distribución
                        </span>
                        <span className="block text-xs text-gray-600">
                          Ingreso por compra, consignación o mayorista.
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>
              </TabsContent>

              <TabsContent value="variantes" className="mt-0 space-y-4">
                <div className="flex flex-col gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ¿Un solo código o varias variantes?
                    </p>
                    <p className="text-xs text-gray-600">
                      Desactivá variantes si el artículo no tiene tallas, colores ni
                      formatos distintos.
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-gray-300"
                      checked={singleSku}
                      onChange={(e) => setSingleSku(e.target.checked)}
                    />
                    Solo un SKU (sin variantes)
                  </label>
                </div>

                {singleSku ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="inv-sku-1">SKU</Label>
                      <Input
                        id="inv-sku-1"
                        className="font-mono"
                        placeholder="Código único"
                        value={single.sku}
                        onChange={(e) =>
                          setSingle((s) => ({ ...s, sku: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="inv-pres-1">Presentación</Label>
                      <Input
                        id="inv-pres-1"
                        placeholder="Ej. 1 L, caja x6, unidad"
                        value={single.presentacion}
                        onChange={(e) =>
                          setSingle((s) => ({ ...s, presentacion: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-costo-1">Costo (ARS)</Label>
                      <Input
                        id="inv-costo-1"
                        inputMode="decimal"
                        placeholder="0"
                        value={single.costo}
                        onChange={(e) =>
                          setSingle((s) => ({ ...s, costo: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-precio-1">Precio venta (ARS)</Label>
                      <Input
                        id="inv-precio-1"
                        inputMode="decimal"
                        placeholder="0"
                        value={single.precio}
                        onChange={(e) =>
                          setSingle((s) => ({ ...s, precio: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-stock-1">Stock actual</Label>
                      <Input
                        id="inv-stock-1"
                        inputMode="numeric"
                        value={single.stock}
                        onChange={(e) =>
                          setSingle((s) => ({ ...s, stock: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-min-1">Stock mínimo</Label>
                      <Input
                        id="inv-min-1"
                        inputMode="numeric"
                        value={single.minimo}
                        onChange={(e) =>
                          setSingle((s) => ({ ...s, minimo: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Cada bloque es una variante con stock propio. Podés mezclar
                      dimensiones distintas (ej. una fila por talla y color si
                      preferís combinarlas en un solo valor &quot;M · Azul&quot;).
                    </p>
                    {variants.map((row, index) => (
                      <div
                        key={row.key}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Variante {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700"
                            onClick={() => removeVariant(row.key)}
                            disabled={variants.length <= 1}
                          >
                            <Trash2 className="size-4" aria-hidden />
                            Quitar
                          </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="space-y-2">
                            <Label>Tipo de atributo</Label>
                            <Select
                              value={row.dimension}
                              onValueChange={(v) =>
                                updateVariant(row.key, {
                                  dimension: v as VariantDimensionValue,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {VARIANT_DIMENSION_OPTIONS.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {row.dimension === "custom" ? (
                            <div className="space-y-2">
                              <Label htmlFor={`${row.key}-cd`}>Nombre del atributo</Label>
                              <Input
                                id={`${row.key}-cd`}
                                placeholder="Ej. Largo, Voltaje, Denier"
                                value={row.customDimension}
                                onChange={(e) =>
                                  updateVariant(row.key, {
                                    customDimension: e.target.value,
                                  })
                                }
                              />
                            </div>
                          ) : null}
                          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                            <Label htmlFor={`${row.key}-val`}>Valor</Label>
                            <Input
                              id={`${row.key}-val`}
                              placeholder="Ej. M, Azul, 500 ml, Vainilla"
                              value={row.valor}
                              onChange={(e) =>
                                updateVariant(row.key, { valor: e.target.value })
                              }
                              required={!singleSku}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${row.key}-pres`}>Presentación</Label>
                            <Input
                              id={`${row.key}-pres`}
                              placeholder="Unidad de venta"
                              value={row.presentacion}
                              onChange={(e) =>
                                updateVariant(row.key, {
                                  presentacion: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${row.key}-suf`}>Sufijo SKU</Label>
                            <Input
                              id={`${row.key}-suf`}
                              className="font-mono uppercase"
                              placeholder="M-AZUL"
                              value={row.skuSuffix}
                              onChange={(e) =>
                                updateVariant(row.key, {
                                  skuSuffix: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Costo ARS</Label>
                            <Input
                              inputMode="decimal"
                              value={row.costo}
                              onChange={(e) =>
                                updateVariant(row.key, { costo: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Precio ARS</Label>
                            <Input
                              inputMode="decimal"
                              value={row.precio}
                              onChange={(e) =>
                                updateVariant(row.key, { precio: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Stock</Label>
                            <Input
                              inputMode="numeric"
                              value={row.stock}
                              onChange={(e) =>
                                updateVariant(row.key, { stock: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Mínimo</Label>
                            <Input
                              inputMode="numeric"
                              value={row.minimo}
                              onChange={(e) =>
                                updateVariant(row.key, { minimo: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2 border-dashed"
                      onClick={addVariant}
                    >
                      <Plus className="size-4" aria-hidden />
                      Agregar otra variante
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={formId}>
              Guardar en inventario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
