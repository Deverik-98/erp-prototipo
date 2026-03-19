import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
import { Card } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

const summaryCards = [
  {
    title: "Ventas del Día",
    value: "$ 12.450",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Gastos Totales",
    value: "$ 3.280",
    change: "-8.2%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "Alertas de Bajo Stock",
    value: "7",
    change: "Productos",
    trend: "alert",
    icon: AlertCircle,
  },
  {
    title: "Ganancia Neta",
    value: "$ 9.170",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
  },
];

const recentOrders = [
  {
    id: "#1247",
    cliente: "María García",
    fecha: "19 Mar 2026, 10:30",
    productos: "Leche entera x5, Queso fresco x2",
    total: "$ 450",
    estado: "Completado",
  },
  {
    id: "#1246",
    cliente: "Carlos López",
    fecha: "19 Mar 2026, 09:15",
    productos: "Yogurt natural x10",
    total: "$ 280",
    estado: "Completado",
  },
  {
    id: "#1245",
    cliente: "Ana Martínez",
    fecha: "19 Mar 2026, 08:45",
    productos: "Leche descremada x3, Mantequilla x1",
    total: "$ 320",
    estado: "Pendiente",
  },
  {
    id: "#1244",
    cliente: "José Rodríguez",
    fecha: "18 Mar 2026, 16:20",
    productos: "Queso mozzarella x4, Crema x2",
    total: "$ 680",
    estado: "Completado",
  },
  {
    id: "#1243",
    cliente: "Laura Fernández",
    fecha: "18 Mar 2026, 15:10",
    productos: "Leche entera x8",
    total: "$ 360",
    estado: "Completado",
  },
];

export function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-500 mt-2">
          Resumen de tu negocio al {new Date().toLocaleDateString("es-AR")}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-1">
                    {card.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                    {card.trend === "down" && (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    )}
                    {card.trend === "alert" && (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                    <span
                      className={`text-sm ${
                        card.trend === "alert"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Últimos Pedidos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Pedidos procesados recientemente
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.cliente}</TableCell>
                <TableCell className="text-gray-600">{order.fecha}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {order.productos}
                </TableCell>
                <TableCell className="font-semibold">{order.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.estado === "Completado" ? "default" : "secondary"
                    }
                  >
                    {order.estado}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
