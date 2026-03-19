import { useState } from "react";
import { Search, Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { PageHeader, PageShell } from "../components/PageShell";
import { PLACEHOLDER_EMAIL, PLACEHOLDER_FULL_NAME } from "../branding";
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

const initialCustomersData = [
  {
    id: 1,
    cliente: "María García",
    telefono: "+54 11 1234-5678",
    correo: "maria.garcia@email.com",
    comprasTotales: "$ 12.450",
    ultimaCompra: "19 Mar 2026",
    pedidos: 24,
  },
  {
    id: 2,
    cliente: "Carlos López",
    telefono: "+54 11 8765-4321",
    correo: "carlos.lopez@email.com",
    comprasTotales: "$ 8.920",
    ultimaCompra: "18 Mar 2026",
    pedidos: 18,
  },
  {
    id: 3,
    cliente: "Ana Martínez",
    telefono: "+54 11 2468-1357",
    correo: "ana.martinez@email.com",
    comprasTotales: "$ 15.680",
    ultimaCompra: "17 Mar 2026",
    pedidos: 31,
  },
  {
    id: 4,
    cliente: "José Rodríguez",
    telefono: "+54 11 9753-8642",
    correo: "jose.rodriguez@email.com",
    comprasTotales: "$ 6.340",
    ultimaCompra: "16 Mar 2026",
    pedidos: 12,
  },
  {
    id: 5,
    cliente: "Laura Fernández",
    telefono: "+54 11 3691-2580",
    correo: "laura.fernandez@email.com",
    comprasTotales: "$ 19.230",
    ultimaCompra: "19 Mar 2026",
    pedidos: 42,
  },
  {
    id: 6,
    cliente: "Miguel Sánchez",
    telefono: "+54 11 7412-9630",
    correo: "miguel.sanchez@email.com",
    comprasTotales: "$ 4.580",
    ultimaCompra: "15 Mar 2026",
    pedidos: 9,
  },
  {
    id: 7,
    cliente: "Patricia Díaz",
    telefono: "+54 11 8520-7413",
    correo: "patricia.diaz@email.com",
    comprasTotales: "$ 11.750",
    ultimaCompra: "18 Mar 2026",
    pedidos: 22,
  },
  {
    id: 8,
    cliente: "Roberto Jiménez",
    telefono: "+54 11 9517-5328",
    correo: "roberto.jimenez@email.com",
    comprasTotales: "$ 7.890",
    ultimaCompra: "17 Mar 2026",
    pedidos: 15,
  },
];

type CustomerRow = (typeof initialCustomersData)[0];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customersData, setCustomersData] = useState(initialCustomersData);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    cliente: "",
    telefono: "",
    correo: "",
  });

  const handleAddClient = () => {
    if (!newClient.cliente.trim() || !newClient.telefono.trim()) return;
    const id = Math.max(...customersData.map((c) => c.id), 0) + 1;
    setCustomersData([
      ...customersData,
      {
        id,
        ...newClient,
        comprasTotales: "$ 0",
        ultimaCompra: "-",
        pedidos: 0,
      },
    ]);
    setNewClient({ cliente: "", telefono: "", correo: "" });
    setNewClientOpen(false);
  };

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefono.includes(searchTerm) ||
      customer.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageShell>
      <PageHeader
        title="Directorio de Clientes"
        description="Gestiona tu base de datos de clientes"
      />

      <Card className="mb-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Label htmlFor="customers-search" className="sr-only">
              Buscar clientes
            </Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <Input
                id="customers-search"
                placeholder="Buscar por nombre, teléfono o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2 sm:w-auto">
                <Plus className="size-4 shrink-0" aria-hidden />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Agregar un cliente a la base de datos
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cliente">Nombre</Label>
                  <Input
                    id="cliente"
                    placeholder="Ej: Juan Pérez"
                    value={newClient.cliente}
                    onChange={(e) =>
                      setNewClient((p) => ({ ...p, cliente: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
                  <Input
                    id="telefono"
                    placeholder="+54 11 1234-5678"
                    value={newClient.telefono}
                    onChange={(e) =>
                      setNewClient((p) => ({ ...p, telefono: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    placeholder={PLACEHOLDER_EMAIL}
                    value={newClient.correo}
                    onChange={(e) =>
                      setNewClient((p) => ({ ...p, correo: e.target.value }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewClientOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddClient}
                  disabled={!newClient.cliente.trim() || !newClient.telefono.trim()}
                >
                  Guardar Cliente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        <Card className="p-4 sm:p-6">
          <p className="text-sm text-gray-600">Total Clientes</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            {customersData.length}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-sm text-gray-600">Clientes Activos (30d)</p>
          <p className="mt-1 text-2xl font-bold text-green-600 sm:text-3xl">
            {customersData.filter((c) => c.pedidos > 10).length}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-sm text-gray-600">Valor Total Ventas</p>
          <p className="mt-1 text-2xl font-bold text-blue-600 sm:text-3xl">
            $ 86.840
          </p>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <Table className="min-w-[720px]">
          <caption className="sr-only">
            Directorio de clientes con contacto y compras
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Cliente</TableHead>
              <TableHead scope="col">Teléfono (WhatsApp)</TableHead>
              <TableHead scope="col">Correo</TableHead>
              <TableHead scope="col">Pedidos</TableHead>
              <TableHead scope="col">Compras Totales</TableHead>
              <TableHead scope="col">Última Compra</TableHead>
              <TableHead scope="col" className="text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">
                        {customer.cliente.charAt(0)}
                      </span>
                    </div>
                    <span>{customer.cliente}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-green-600" aria-hidden />
                    <span className="break-all text-gray-700">
                      {customer.telefono}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-gray-400" aria-hidden />
                    <span className="break-all text-gray-700">
                      {customer.correo}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{customer.pedidos}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-green-700">
                  {customer.comprasTotales}
                </TableCell>
                <TableCell className="text-gray-600">
                  {customer.ultimaCompra}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0"
                      type="button"
                      aria-label={`Editar cliente ${customer.cliente}`}
                    >
                      <Edit className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 text-red-600 hover:text-red-700"
                      type="button"
                      aria-label={`Eliminar cliente ${customer.cliente}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No se encontraron clientes con los criterios de búsqueda
            </p>
          </div>
        )}
      </Card>
    </PageShell>
  );
}
