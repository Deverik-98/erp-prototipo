import { useState } from "react";
import { Search, Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

const customersData = [
  {
    id: 1,
    cliente: "María García",
    telefono: "+52 555 1234 5678",
    correo: "maria.garcia@email.com",
    comprasTotales: "$12,450",
    ultimaCompra: "19 Mar 2026",
    pedidos: 24,
  },
  {
    id: 2,
    cliente: "Carlos López",
    telefono: "+52 555 8765 4321",
    correo: "carlos.lopez@email.com",
    comprasTotales: "$8,920",
    ultimaCompra: "18 Mar 2026",
    pedidos: 18,
  },
  {
    id: 3,
    cliente: "Ana Martínez",
    telefono: "+52 555 2468 1357",
    correo: "ana.martinez@email.com",
    comprasTotales: "$15,680",
    ultimaCompra: "17 Mar 2026",
    pedidos: 31,
  },
  {
    id: 4,
    cliente: "José Rodríguez",
    telefono: "+52 555 9753 8642",
    correo: "jose.rodriguez@email.com",
    comprasTotales: "$6,340",
    ultimaCompra: "16 Mar 2026",
    pedidos: 12,
  },
  {
    id: 5,
    cliente: "Laura Fernández",
    telefono: "+52 555 3691 2580",
    correo: "laura.fernandez@email.com",
    comprasTotales: "$19,230",
    ultimaCompra: "19 Mar 2026",
    pedidos: 42,
  },
  {
    id: 6,
    cliente: "Miguel Sánchez",
    telefono: "+52 555 7412 9630",
    correo: "miguel.sanchez@email.com",
    comprasTotales: "$4,580",
    ultimaCompra: "15 Mar 2026",
    pedidos: 9,
  },
  {
    id: 7,
    cliente: "Patricia Díaz",
    telefono: "+52 555 8520 7413",
    correo: "patricia.diaz@email.com",
    comprasTotales: "$11,750",
    ultimaCompra: "18 Mar 2026",
    pedidos: 22,
  },
  {
    id: 8,
    cliente: "Roberto Jiménez",
    telefono: "+52 555 9517 5328",
    correo: "roberto.jimenez@email.com",
    comprasTotales: "$7,890",
    ultimaCompra: "17 Mar 2026",
    pedidos: 15,
  },
];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefono.includes(searchTerm) ||
      customer.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Directorio de Clientes
        </h1>
        <p className="text-gray-500 mt-2">
          Gestiona tu base de datos de clientes
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre, teléfono o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Cliente
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
          <p className="text-3xl font-bold text-gray-900">
            {customersData.length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Clientes Activos (30d)</p>
          <p className="text-3xl font-bold text-green-600">
            {customersData.filter((c) => c.pedidos > 10).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Valor Total Ventas</p>
          <p className="text-3xl font-bold text-blue-600">$86,840</p>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Teléfono (WhatsApp)</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Compras Totales</TableHead>
              <TableHead>Última Compra</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
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
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{customer.telefono}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{customer.correo}</span>
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
            ))}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No se encontraron clientes con los criterios de búsqueda
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
