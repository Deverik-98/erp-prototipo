import { useState } from "react";
import { toast } from "sonner";
import { Search, Filter, Upload, Plus, Edit, Trash2, FileSpreadsheet } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Inventario
        </h1>
        <p className="text-gray-500 mt-2">
          Administra tus productos y materias primas
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
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
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Importación Masiva (Excel)
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

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </Button>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock Actual</TableHead>
              <TableHead>Stock Mínimo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
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
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No se encontraron productos con los criterios seleccionados
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
