import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
import { PageHeader, PageShell } from "../components/PageShell";
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
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Gastos Totales",
    value: "$ 3.280",
    change: "-8.2%",
    trend: "down" as const,
    icon: TrendingDown,
  },
  {
    title: "Alertas de Bajo Stock",
    value: "7",
    change: "Productos",
    trend: "alert" as const,
    icon: AlertCircle,
  },
  {
    title: "Ganancia Neta",
    value: "$ 9.170",
    change: "+15.3%",
    trend: "up" as const,
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
    <PageShell>
      <PageHeader
        title="Panel de Control"
        description={`Resumen de tu negocio al ${new Date().toLocaleDateString("es-AR")}`}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                    {card.value}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    {card.trend === "up" && (
                      <TrendingUp className="size-4 shrink-0 text-green-600" aria-hidden />
                    )}
                    {card.trend === "down" && (
                      <TrendingDown className="size-4 shrink-0 text-green-600" aria-hidden />
                    )}
                    {card.trend === "alert" && (
                      <AlertCircle className="size-4 shrink-0 text-orange-600" aria-hidden />
                    )}
                    <span
                      className={
                        card.trend === "alert"
                          ? "text-sm text-orange-600"
                          : "text-sm text-green-600"
                      }
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:size-12">
                  <Icon className="size-5 text-blue-600 sm:size-6" aria-hidden />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Últimos Pedidos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Pedidos procesados recientemente
          </p>
        </div>

        <Table className="min-w-[640px]">
          <caption className="sr-only">
            Tabla de los últimos pedidos con cliente, fecha, productos y total
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">ID Pedido</TableHead>
              <TableHead scope="col">Cliente</TableHead>
              <TableHead scope="col">Fecha y Hora</TableHead>
              <TableHead scope="col">Productos</TableHead>
              <TableHead scope="col">Total</TableHead>
              <TableHead scope="col">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.cliente}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">
                  {order.fecha}
                </TableCell>
                <TableCell className="max-w-[200px] truncate sm:max-w-xs">
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
    </PageShell>
  );
}
