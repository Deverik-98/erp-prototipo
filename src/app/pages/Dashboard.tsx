import { Link } from "react-router";
import {
  AlertCircle,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  CalendarDays,
  ArrowRight,
  Info,
} from "lucide-react";
import { PageShell } from "../components/PageShell";
import { Card } from "../components/ui/card";
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
import { MonthlyReportCard } from "../components/dashboard/MonthlyReportCard";
import { CriticalStockCard } from "../components/dashboard/CriticalStockCard";
import { BusinessSummaryCard } from "../components/dashboard/BusinessSummaryCard";
import { DashboardVisualAnalysis } from "../components/dashboard/DashboardVisualAnalysis";
import { DashboardHeroHeader } from "../components/dashboard/DashboardHeroHeader";
import { CompactPeriodKpis } from "../components/dashboard/CompactPeriodKpis";

const LOW_STOCK_COUNT = 7;
const PEDIDOS_HOY = 8;
const TICKET_PROMEDIO = "$ 382";

const secondaryKpis = [
  {
    id: "ticket",
    title: "Ticket promedio",
    value: TICKET_PROMEDIO,
    hint: "Últimos 7 días",
    trend: "neutral" as const,
    icon: Receipt,
  },
  {
    id: "clientes",
    title: "Clientes activos",
    value: "24",
    hint: "Compraron en los últimos 7 días",
    trend: "neutral" as const,
    icon: Users,
  },
  {
    id: "pedidos-7d",
    title: "Pedidos (7 días)",
    value: "47",
    hint: "+14% vs. semana anterior",
    trend: "up" as const,
    icon: CalendarDays,
  },
];

const recentOrders = [
  {
    id: "#1247",
    cliente: "María García",
    fecha: "19 Mar 2026, 10:30",
    productos: "Leche entera x5, Queso fresco x2",
    total: "$ 450",
    estado: "Completado" as const,
  },
  {
    id: "#1246",
    cliente: "Carlos López",
    fecha: "19 Mar 2026, 09:15",
    productos: "Yogurt natural x10",
    total: "$ 280",
    estado: "Completado" as const,
  },
  {
    id: "#1245",
    cliente: "Ana Martínez",
    fecha: "19 Mar 2026, 08:45",
    productos: "Leche descremada x3, Mantequilla x1",
    total: "$ 320",
    estado: "Pendiente" as const,
  },
  {
    id: "#1244",
    cliente: "José Rodríguez",
    fecha: "18 Mar 2026, 16:20",
    productos: "Queso mozzarella x4, Crema x2",
    total: "$ 680",
    estado: "Completado" as const,
  },
  {
    id: "#1243",
    cliente: "Laura Fernández",
    fecha: "18 Mar 2026, 15:10",
    productos: "Leche entera x8",
    total: "$ 360",
    estado: "Completado" as const,
  },
];

function OrderStatusBadge({ estado }: { estado: "Completado" | "Pendiente" }) {
  if (estado === "Completado") {
    return (
      <Badge
        variant="outline"
        className="border-green-200 bg-green-50 font-medium text-green-800 hover:bg-green-50"
      >
        {estado}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-amber-300 bg-amber-50 font-medium text-amber-900 hover:bg-amber-50"
    >
      {estado}
    </Badge>
  );
}

const quickActions = [
  {
    to: "/punto-venta",
    label: "Nuevo pedido",
    icon: ShoppingCart,
    description: "POS",
  },
  {
    to: "/inventario",
    label: "Inventario",
    icon: Package,
    description: "Stock",
  },
  {
    to: "/clientes",
    label: "Clientes",
    icon: Users,
    description: "Directorio",
  },
  {
    to: "/inventario",
    label: "Bajo stock",
    icon: AlertCircle,
    description: `${LOW_STOCK_COUNT} ítems`,
  },
] as const;

export function Dashboard() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const summaryStamp = now.toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const pendingCount = recentOrders.filter((o) => o.estado === "Pendiente").length;

  return (
    <PageShell>
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-gray-400" aria-hidden />
        <span>
          <span className="font-medium text-gray-700">Demostración.</span>{" "}
          Datos de ejemplo para validar flujos; en producción vendrían del servidor.
        </span>
      </p>

      <DashboardHeroHeader dateLong={dateStr} syncStamp={summaryStamp} />

      <section aria-labelledby="dash-summary" className="mb-6 sm:mb-8">
        <h2 id="dash-summary" className="sr-only">
          Resumen del día y accesos
        </h2>
        <BusinessSummaryCard
          dateIso={now.toISOString()}
          dateDisplay={summaryStamp}
          ventas="$ 12.450"
          ventasVsAyer="+12,5% vs. ayer mismo día"
          ventasSube
          pedidosHoy={PEDIDOS_HOY}
          ticketPromedio={TICKET_PROMEDIO}
          pendientes={pendingCount}
          alertasStock={LOW_STOCK_COUNT}
        />
        <nav
          aria-label="Accesos rápidos"
          className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:flex-nowrap sm:gap-2 sm:overflow-x-auto sm:pb-0.5"
        >
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="h-9 shrink-0 gap-2 border-gray-200 bg-white px-3 shadow-sm hover:bg-gray-50"
                asChild
              >
                <Link to={action.to}>
                  <Icon className="size-4 text-blue-600" aria-hidden />
                  <span className="font-medium">{action.label}</span>
                  <span className="hidden text-xs font-normal text-gray-500 sm:inline">
                    · {action.description}
                  </span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </section>

      <section aria-labelledby="dash-inventory-month" className="mb-6 sm:mb-8">
        <h2
          id="dash-inventory-month"
          className="mb-3 text-sm font-semibold text-gray-900"
        >
          Inventario y contexto del mes
        </h2>
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5 lg:gap-5">
          <div className="lg:col-span-3">
            <CriticalStockCard />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-2">
            <MonthlyReportCard />
            <CompactPeriodKpis items={secondaryKpis} />
          </div>
        </div>
      </section>

      <DashboardVisualAnalysis />

      <section aria-labelledby="dash-orders">
        <h2
          id="dash-orders"
          className="mb-3 text-sm font-semibold text-gray-900 sm:mb-4"
        >
          Últimos pedidos
        </h2>
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Registrados en punto de venta (ejemplo).
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full shrink-0 sm:w-auto"
              asChild
            >
              <Link to="/punto-venta" className="gap-2">
                Ver en POS
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <ul
            className="space-y-3 md:hidden"
            aria-label="Últimos pedidos en vista compacta"
          >
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Card className="border-gray-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/punto-venta"
                      className="rounded-sm text-sm font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {order.id}
                    </Link>
                    <OrderStatusBadge estado={order.estado} />
                  </div>
                  <p className="mt-2 font-medium text-gray-900">{order.cliente}</p>
                  <p className="mt-1 text-xs text-gray-500">{order.fecha}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {order.productos}
                  </p>
                  <p className="mt-3 text-base font-semibold text-gray-900">
                    {order.total}
                  </p>
                </Card>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto md:block">
            <Table className="min-w-[640px]">
              <caption className="sr-only">
                Tabla de los últimos pedidos con cliente, fecha, productos y total
              </caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID pedido</TableHead>
                  <TableHead scope="col">Cliente</TableHead>
                  <TableHead scope="col">Fecha y hora</TableHead>
                  <TableHead scope="col">Productos</TableHead>
                  <TableHead scope="col">Total</TableHead>
                  <TableHead scope="col">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link
                        to="/punto-venta"
                        className="rounded-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      >
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.cliente}</TableCell>
                    <TableCell className="whitespace-nowrap text-gray-600">
                      {order.fecha}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate sm:max-w-xs">
                      {order.productos}
                    </TableCell>
                    <TableCell className="font-semibold">{order.total}</TableCell>
                    <TableCell>
                      <OrderStatusBadge estado={order.estado} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
