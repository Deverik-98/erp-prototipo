import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Upload,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  Download,
  ChevronDown,
  Info,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import { PageHeader, PageShell } from "../components/PageShell";
import { Card } from "../components/ui/card";
import { cn } from "../components/ui/utils";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { INVENTORY_MOCK } from "../components/inventory/inventory.mock";
import type { InventoryGroupMode, InventoryProduct } from "../components/inventory/inventory.types";
import {
  downloadInventoryCsv,
  formatARS,
  groupInventoryProducts,
  isCriticalStock,
  summarizeInventory,
  summarizeInventoryGroup,
} from "../components/inventory/inventory.logic";
import { InventorySummaryCards } from "../components/inventory/InventorySummaryCards";
import { InventoryProductFormDialog } from "../components/inventory/InventoryProductFormDialog";

type OrigenFilter = "all" | "produccion" | "externo";

const TABLE_HEAD = (
  <TableRow>
    <TableHead scope="col">Producto</TableHead>
    <TableHead scope="col">Presentación</TableHead>
    <TableHead scope="col">SKU</TableHead>
    <TableHead scope="col">Categoría</TableHead>
    <TableHead scope="col">Costo</TableHead>
    <TableHead scope="col">Precio</TableHead>
    <TableHead scope="col">Stock</TableHead>
    <TableHead scope="col">Mín.</TableHead>
    <TableHead scope="col">Origen</TableHead>
    <TableHead scope="col" className="text-right">
      Acciones
    </TableHead>
  </TableRow>
);

function ProductRowCells({ item }: { item: InventoryProduct }) {
  const low = isCriticalStock(item);
  return (
    <>
      <TableCell className="font-medium">
        <span className="block">{item.nombre}</span>
        {item.variante ? (
          <span className="text-xs font-normal text-gray-500">{item.variante}</span>
        ) : null}
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-600">
        {item.presentacion}
      </TableCell>
      <TableCell className="font-mono text-xs text-gray-600">{item.sku}</TableCell>
      <TableCell>
        <Badge variant="outline">{item.categoria}</Badge>
      </TableCell>
      <TableCell className="tabular-nums">{formatARS(item.costoARS)}</TableCell>
      <TableCell className="font-semibold tabular-nums">
        {item.precioARS > 0 ? formatARS(item.precioARS) : "—"}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          <span className={low ? "font-semibold text-red-600 tabular-nums" : "tabular-nums"}>
            {item.stockActual}
          </span>
          {low ? (
            <Badge variant="destructive" className="text-xs">
              Bajo mínimo
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="text-gray-600 tabular-nums">{item.stockMinimo}</TableCell>
      <TableCell>
        {item.produccionPropia ? (
          <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-900 hover:bg-emerald-50">
            Producción interna
          </Badge>
        ) : (
          <span className="text-xs text-gray-500">Compra · distribución</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            aria-label={`Editar ${item.nombre}`}
            type="button"
          >
            <Edit className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-red-600 hover:text-red-700"
            aria-label={`Eliminar ${item.nombre}`}
            type="button"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </TableCell>
    </>
  );
}

function MobileProductCard({ item }: { item: InventoryProduct }) {
  const low = isCriticalStock(item);
  return (
    <Card className="border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{item.nombre}</p>
          <p className="text-xs text-gray-500">
            {item.presentacion} · {item.sku}
            {item.variante ? ` · ${item.variante}` : ""}
          </p>
        </div>
        {low ? (
          <Badge variant="destructive" className="shrink-0 text-xs">
            Bajo mínimo
          </Badge>
        ) : null}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-gray-500">Categoría</dt>
          <dd className="mt-0.5">{item.categoria}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Stock / Mín.</dt>
          <dd className="mt-0.5 font-medium tabular-nums">
            {item.stockActual} / {item.stockMinimo}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Costo</dt>
          <dd className="mt-0.5 tabular-nums">{formatARS(item.costoARS)}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Precio</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">
            {item.precioARS > 0 ? formatARS(item.precioARS) : "—"}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-gray-500">Origen</dt>
          <dd className="mt-0.5">
            {item.produccionPropia ? (
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50">
                Producción interna
              </Badge>
            ) : (
              <span className="text-gray-600">Compra · distribución</span>
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 pt-3">
        <Button variant="ghost" size="sm" type="button" className="gap-1">
          <Edit className="size-4" aria-hidden />
          Editar
        </Button>
        <Button variant="ghost" size="sm" type="button" className="gap-1 text-red-600">
          <Trash2 className="size-4" aria-hidden />
          Quitar
        </Button>
      </div>
    </Card>
  );
}

export function Inventory() {
  const [products, setProducts] = useState<InventoryProduct[]>(() => [
    ...INVENTORY_MOCK,
  ]);
  const idRef = useRef(
    Math.max(0, ...INVENTORY_MOCK.map((p) => p.id)) + 1
  );
  const nextId = useCallback(() => {
    const n = idRef.current;
    idRef.current += 1;
    return n;
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [groupMode, setGroupMode] = useState<InventoryGroupMode>("none");
  const [origenFilter, setOrigenFilter] = useState<OrigenFilter>("all");
  const [importOpen, setImportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (groupMode === "none") {
      setOpenGroups({});
    }
  }, [groupMode]);

  const filteredData = useMemo(() => {
    return products.filter((item) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        (item.variante?.toLowerCase().includes(q) ?? false) ||
        item.familia.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || item.categoria === categoryFilter;
      const matchesOrigen =
        origenFilter === "all" ||
        (origenFilter === "produccion" && item.produccionPropia) ||
        (origenFilter === "externo" && !item.produccionPropia);
      return matchesSearch && matchesCategory && matchesOrigen;
    });
  }, [searchTerm, categoryFilter, origenFilter, products]);

  const { totalProductos, stockCritico, valorInventario } = useMemo(
    () => summarizeInventory(filteredData),
    [filteredData]
  );

  const groups = useMemo(
    () => groupInventoryProducts(filteredData, groupMode),
    [filteredData, groupMode]
  );

  const expandAllGroups = () => {
    const m: Record<string, boolean> = {};
    for (const g of groups) {
      if (g.key !== "_flat") m[g.key] = true;
    }
    setOpenGroups(m);
  };

  const collapseAllGroups = () => setOpenGroups({});

  const handleImportMock = () => {
    toast.success(
      "Importación simulada: el archivo Excel se procesaría aquí. En producción se cargarían los productos.",
      { duration: 5000 }
    );
    setImportOpen(false);
  };

  const handleExportCsv = () => {
    if (filteredData.length === 0) {
      toast.error("No hay filas para exportar con los filtros actuales.");
      return;
    }
    const d = new Date();
    const stamp = d.toISOString().slice(0, 10);
    downloadInventoryCsv(filteredData, `inventario-demoapp-${stamp}.csv`);
    toast.success(
      `Exportadas ${filteredData.length} fila(s). Archivo listo para abrir en Excel.`,
      { duration: 4000 }
    );
  };

  const handleCreate = (rows: InventoryProduct[]) => {
    setProducts((prev) => [...rows, ...prev]);
    toast.success(
      `${rows.length} ítem(es) agregados al inventario (solo en esta sesión demo).`
    );
  };

  return (
    <PageShell>
      <PageHeader
        title="Inventario"
        description={
          <>
            Stock, costos y variantes. Los KPIs reflejan{" "}
            <strong>lo filtrado</strong>. Con agrupación activa, cada grupo
            muestra totales y podés desplegar el detalle por variante.
          </>
        }
      />

      <InventorySummaryCards
        className="mb-5"
        totalProductos={totalProductos}
        stockCritico={stockCritico}
        valorInventarioFormatted={formatARS(valorInventario)}
      />

      <p className="mb-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs text-blue-900 sm:text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden />
        <span>
          <span className="font-semibold">Prototipo.</span> Exportación CSV;
          alta múltiple por variantes; datos nuevos viven en memoria hasta
          recargar la página.
        </span>
      </p>

      <InventoryProductFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        nextId={nextId}
        onCreate={handleCreate}
      />

      <Card className="mb-5 p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-3">
            <div className="lg:col-span-4">
              <Label htmlFor="inventory-search" className="sr-only">
                Buscar por nombre, SKU o familia
              </Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <Input
                  id="inventory-search"
                  placeholder="Buscar nombre, SKU, familia…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                Categoría
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger aria-label="Filtrar por categoría">
                  <Filter className="mr-2 size-4 shrink-0 text-gray-500" aria-hidden />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
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

            <div className="lg:col-span-3">
              <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                Agrupar vista
              </Label>
              <Select
                value={groupMode}
                onValueChange={(v) => setGroupMode(v as InventoryGroupMode)}
              >
                <SelectTrigger aria-label="Modo de agrupación">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Lista plana</SelectItem>
                  <SelectItem value="familia">Por familia</SelectItem>
                  <SelectItem value="variante">Por variante (atributo)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-3">
              <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                Origen del stock
              </Label>
              <Select
                value={origenFilter}
                onValueChange={(v) => setOrigenFilter(v as OrigenFilter)}
              >
                <SelectTrigger aria-label="Filtrar por origen producción o compra">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los orígenes</SelectItem>
                  <SelectItem value="produccion">Solo producción interna</SelectItem>
                  <SelectItem value="externo">Solo compra · distribución</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-[11px] text-gray-500">
                Producción = lo que elaborás; compra = mercadería de terceros.
              </p>
            </div>
          </div>

          {groupMode !== "none" ? (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={expandAllGroups}
              >
                <ChevronsDownUp className="size-4" aria-hidden />
                Expandir grupos
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={collapseAllGroups}
              >
                <ChevronsUpDown className="size-4" aria-hidden />
                Contraer grupos
              </Button>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              Mostrando{" "}
              <span className="font-semibold text-gray-800">
                {filteredData.length}
              </span>{" "}
              de {products.length} ítems en catálogo
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <Download className="size-4 shrink-0" aria-hidden />
                    Exportar
                    <ChevronDown className="size-4 opacity-70" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleExportCsv} className="gap-2">
                    <FileSpreadsheet className="size-4" aria-hidden />
                    CSV (compatible con Excel)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <Upload className="size-4 shrink-0" aria-hidden />
                    Importar Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Importación masiva</DialogTitle>
                    <DialogDescription>
                      Incluí columnas de variantes (talla, color, etc.) o filas
                      repetidas por SKU. En prototipo la carga es simulada.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-200 py-8">
                    <FileSpreadsheet className="size-14 text-gray-400" aria-hidden />
                    <p className="text-sm text-gray-500">
                      Arrastrá el archivo o elegilo desde tu equipo
                    </p>
                    <p className="text-xs text-gray-400">Formato: .xlsx</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setImportOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleImportMock}>Simular importación</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                type="button"
                className="w-full gap-2 sm:w-auto"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-4 shrink-0" aria-hidden />
                Nuevo producto
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="hidden md:block">
          {groupMode === "none" ? (
            <div className="overflow-x-auto">
              <Table>
                <caption className="sr-only">
                  Productos filtrados con stock y costos
                </caption>
                <TableHeader>{TABLE_HEAD}</TableHeader>
                <TableBody>
                  {groups[0]?.items.map((item) => (
                    <TableRow key={item.id}>
                      <ProductRowCells item={item} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {groups.map((group) => {
                const agg = summarizeInventoryGroup(group.items);
                const isOpen = openGroups[group.key] ?? false;
                return (
                  <Collapsible
                    key={group.key}
                    open={isOpen}
                    onOpenChange={(o) =>
                      setOpenGroups((m) => ({ ...m, [group.key]: o }))
                    }
                  >
                    <CollapsibleTrigger className="flex w-full items-center gap-3 bg-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-gray-100/90">
                      <ChevronDown
                        className={cn(
                          "size-5 shrink-0 text-gray-500 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-base font-bold text-gray-900">
                          {group.label}
                        </span>
                        <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
                          <span>
                            <span className="tabular-nums font-semibold text-gray-900">
                              {agg.lineas}
                            </span>{" "}
                            {agg.lineas === 1 ? "línea" : "líneas"}
                          </span>
                          <span>
                            Stock u.:{" "}
                            <span className="font-semibold tabular-nums text-gray-900">
                              {agg.stockTotal}
                            </span>
                          </span>
                          <span>
                            Valor estimado:{" "}
                            <span className="font-semibold tabular-nums text-gray-900">
                              {formatARS(agg.valorTotal)}
                            </span>
                          </span>
                          {agg.alertas > 0 ? (
                            <span className="font-medium text-amber-800">
                              {agg.alertas} bajo mínimo
                            </span>
                          ) : (
                            <span className="text-green-700">Sin alertas de mínimo</span>
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="overflow-x-auto border-t border-gray-100 bg-white">
                        <Table>
                          <TableHeader>{TABLE_HEAD}</TableHeader>
                          <TableBody>
                            {group.items.map((item) => (
                              <TableRow key={item.id}>
                                <ProductRowCells item={item} />
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {groupMode === "none" ? (
            <ul className="space-y-3">
              {filteredData.map((item) => (
                <li key={item.id}>
                  <MobileProductCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            groups.map((group) => {
              const agg = summarizeInventoryGroup(group.items);
              const isOpen = openGroups[group.key] ?? false;
              return (
                <Collapsible
                  key={`m-${group.key}`}
                  open={isOpen}
                  onOpenChange={(o) =>
                    setOpenGroups((m) => ({ ...m, [group.key]: o }))
                  }
                  className="rounded-xl border border-gray-200 bg-gray-50/50"
                >
                  <CollapsibleTrigger className="flex w-full items-start gap-2 rounded-t-xl px-3 py-3 text-left">
                    <ChevronDown
                      className={cn(
                        "mt-0.5 size-5 shrink-0 text-gray-500 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{group.label}</p>
                      <p className="mt-1 text-xs text-gray-600">
                        {agg.lineas} líneas · {agg.stockTotal} u. ·{" "}
                        {formatARS(agg.valorTotal)}
                        {agg.alertas ? ` · ${agg.alertas} alertas` : ""}
                      </p>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="space-y-3 border-t border-gray-200 bg-white p-3">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <MobileProductCard item={item} />
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </div>

        {filteredData.length === 0 ? (
          <div className="border-t border-gray-100 px-4 py-12 text-center">
            <p className="text-gray-600">
              No hay productos con estos criterios.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Probá limpiar la búsqueda o cambiar categoría / origen.
            </p>
          </div>
        ) : null}
      </Card>
    </PageShell>
  );
}
