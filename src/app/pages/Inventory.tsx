import { useState } from "react";
import { toast } from "sonner";
import { Search, Filter, Upload, Plus, Edit, Trash2, FileSpreadsheet } from "lucide-react";
import { PageHeader, PageShell } from "../components/PageShell";
import { Card } from "../components/ui/card";
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

const inventoryData = [
  {
    id: 1,
    nombre: "Leche Entera 1L",
    sku: "LEC-001",
    categoria: "Lácteos",
    costo: "$ 45",
    precio: "$ 65",
    stockActual: 150,
    stockMinimo: 50,
  },
  {
    id: 2,
    nombre: "Queso Fresco 500g",
    sku: "QUE-002",
    categoria: "Lácteos",
    costo: "$ 85",
    precio: "$ 120",
    stockActual: 45,
    stockMinimo: 30,
  },
  {
    id: 3,
    nombre: "Yogurt Natural 1L",
    sku: "YOG-003",
    categoria: "Lácteos",
    costo: "$ 28",
    precio: "$ 40",
    stockActual: 200,
    stockMinimo: 80,
  },
  {
    id: 4,
    nombre: "Mantequilla 250g",
    sku: "MAN-004",
    categoria: "Lácteos",
    costo: "$ 55",
    precio: "$ 75",
    stockActual: 80,
    stockMinimo: 40,
  },
  {
    id: 5,
    nombre: "Queso Mozzarella 1kg",
    sku: "QUE-005",
    categoria: "Lácteos",
    costo: "$ 140",
    precio: "$ 190",
    stockActual: 25,
    stockMinimo: 20,
  },
  {
    id: 6,
    nombre: "Crema de Leche 500ml",
    sku: "CRE-006",
    categoria: "Lácteos",
    costo: "$ 38",
    precio: "$ 55",
    stockActual: 120,
    stockMinimo: 60,
  },
  {
    id: 7,
    nombre: "Leche Descremada 1L",
    sku: "LEC-007",
    categoria: "Lácteos",
    costo: "$ 48",
    precio: "$ 68",
    stockActual: 15,
    stockMinimo: 50,
  },
  {
    id: 8,
    nombre: "Queso Parmesano 200g",
    sku: "QUE-008",
    categoria: "Lácteos",
    costo: "$ 95",
    precio: "$ 135",
    stockActual: 35,
    stockMinimo: 25,
  },
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [importOpen, setImportOpen] = useState(false);

  const handleImportMock = () => {
    toast.success(
      "Importación simulada: el archivo Excel se procesaría aquí. En producción se cargarían los productos.",
      { duration: 5000 }
    );
    setImportOpen(false);
  };

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageShell>
      <PageHeader
        title="Gestión de Inventario"
        description="Administra tus productos y materias primas"
      />

      <Card className="mb-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-0 flex-1 lg:min-w-[200px]">
            <Label htmlFor="inventory-search" className="sr-only">
              Buscar por nombre o SKU
            </Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <Input
                id="inventory-search"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              className="w-full lg:w-[200px]"
              aria-label="Filtrar por categoría"
            >
              <Filter className="mr-2 size-4 shrink-0" aria-hidden />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Categorías</SelectItem>
              <SelectItem value="Lácteos">Lácteos</SelectItem>
              <SelectItem value="Materia Prima">Materia Prima</SelectItem>
              <SelectItem value="Empaque">Empaque</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <Upload className="size-4 shrink-0" aria-hidden />
                <span className="truncate">Importación Masiva (Excel)</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importación Masiva desde Excel</DialogTitle>
                <DialogDescription>
                  Sube un archivo Excel (.xlsx) con columnas: Nombre, SKU, Categoría, Costo, Precio, Stock Actual, Stock Mínimo. En este prototipo la acción es simulada.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-3">
                <FileSpreadsheet className="w-16 h-16 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-400">
                  Formato soportado: .xlsx
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleImportMock}>
                  Simular Importación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="size-4 shrink-0" aria-hidden />
            Nuevo Producto
          </Button>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <Table className="min-w-[800px]">
          <caption className="sr-only">
            Listado de productos con stock, precios y acciones
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Nombre</TableHead>
              <TableHead scope="col">SKU</TableHead>
              <TableHead scope="col">Categoría</TableHead>
              <TableHead scope="col">Costo</TableHead>
              <TableHead scope="col">Precio</TableHead>
              <TableHead scope="col">Stock Actual</TableHead>
              <TableHead scope="col">Stock Mínimo</TableHead>
              <TableHead scope="col" className="text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
              const isLowStock = item.stockActual <= item.stockMinimo;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nombre}</TableCell>
                  <TableCell className="text-gray-600">{item.sku}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.categoria}</Badge>
                  </TableCell>
                  <TableCell>{item.costo}</TableCell>
                  <TableCell className="font-semibold">{item.precio}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={isLowStock ? "text-red-600 font-semibold" : ""}>
                        {item.stockActual}
                      </span>
                      {isLowStock && (
                        <Badge variant="destructive" className="text-xs">
                          Bajo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.stockMinimo}
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No se encontraron productos con los criterios seleccionados
            </p>
          </div>
        )}
      </Card>
    </PageShell>
  );
}
