import { Link } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  ArrowRight,
  Info,
} from "lucide-react";
import { PageHeader, PageShell } from "../components/PageShell";
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
import { SESSION_DISPLAY_NAME } from "../branding";
import { MonthlyReportCard } from "../components/dashboard/MonthlyReportCard";
import { CriticalStockCard } from "../components/dashboard/CriticalStockCard";
import { TodaySnapshotCard } from "../components/dashboard/TodaySnapshotCard";
import { DashboardVisualAnalysis } from "../components/dashboard/DashboardVisualAnalysis";

const LOW_STOCK_COUNT = 7;

const heroMetric = {
  value: "$ 12.450",
  changeLabel: "+12.5% vs. ayer",
};

/** KPIs secundarios: sin duplicar “bajo stock” (ya en widget + acceso rápido). */
const secondaryKpis = [
  {
    id: "pedidos-hoy",
    title: "Pedidos hoy",
    value: "8",
    hint: "Incluye 1 pendiente de armar",
    trend: "neutral" as const,
    icon: Receipt,
  },
  {
    id: "ticket",
    title: "Ticket promedio",
    value: "$ 382",
    hint: "Últimos 7 días (demo)",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    id: "clientes",
    title: "Clientes activos",
    value: "24",
    hint: "Con compra en los últimos 7 días",
    trend: "neutral" as const,
    icon: Users,
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
    description: "Punto de venta",
  },
  {
    to: "/inventario",
    label: "Inventario",
    icon: Package,
    description: "Stock y productos",
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
  const dateStr = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const pendingCount = recentOrders.filter((o) => o.estado === "Pendiente").length;

  return (
    <PageShell>
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-gray-400" aria-hidden />
        <span>
          <span className="font-medium text-gray-700">Datos de demostración.</span>{" "}
          Cifras y pedidos de ejemplo; sin backend real.
        </span>
      </p>

      <p className="mb-1 text-sm text-gray-600">
        Hola,{" "}
        <span className="font-semibold text-gray-900">{SESSION_DISPLAY_NAME}</span>
      </p>

      <PageHeader
        title="Panel de Control"
        description={
          <>
            <p className="leading-relaxed">
              Orden pensado para PyME:{" "}
              <strong className="font-semibold text-gray-800">
                acciones y alertas primero
              </strong>
              , contexto del mes después, gráficos bajo demanda al final de esta
              página.
            </p>
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              Actualizado al {dateStr}
            </p>
          </>
        }
      />

      {/* 1 · Máxima accionabilidad */}
      <section aria-labelledby="dash-quick" className="mb-6 sm:mb-8">
        <h2 id="dash-quick" className="mb-3 text-sm font-semibold text-gray-900">
          Empezá por aquí
        </h2>
        <p className="mb-3 text-xs text-gray-500 sm:text-sm">
          Atajos a lo que más usás en el día (ventas, stock, clientes).
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-1.5 py-4 text-center shadow-sm"
                asChild
              >
                <Link to={action.to}>
                  <Icon className="size-5 text-blue-600" aria-hidden />
                  <span className="text-sm font-medium leading-tight">
                    {action.label}
                  </span>
                  <span className="text-xs font-normal text-gray-500">
                    {action.description}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </section>

      {/* 2 · Urgencia operativa + snapshot del día */}
      <section aria-labelledby="dash-attention" className="mb-6 sm:mb-8">
        <h2 id="dash-attention" className="mb-3 text-sm font-semibold text-gray-900">
          Requiere tu atención
        </h2>
        <p className="mb-4 text-xs text-gray-500 sm:text-sm">
          Stock crítico primero; al lado, ventas de hoy y la cola de pedidos
          pendientes.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <CriticalStockCard />
          <TodaySnapshotCard
            ventasValue={heroMetric.value}
            changeLabel={heroMetric.changeLabel}
            pendingCount={pendingCount}
          />
        </div>
      </section>

      {/* 3 · Contexto de negocio (refuerzo, no bloqueo) */}
      <section aria-labelledby="dash-monthly" className="mb-6 sm:mb-8">
        <h2 id="dash-monthly" className="sr-only">
          Reporte mensual
        </h2>
        <MonthlyReportCard />
      </section>

      {/* 4 · Lectura de acompañamiento */}
      <section aria-labelledby="dash-kpis" className="mb-6 sm:mb-8">
        <h2 id="dash-kpis" className="mb-3 text-sm font-semibold text-gray-900">
          Indicadores del período
        </h2>
        <p className="mb-4 text-xs text-gray-500 sm:text-sm">
          Complementan el resumen de hoy; no repiten el detalle de stock crítico.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {secondaryKpis.map((card) => {
            const Icon = card.icon;
            const regionId = `kpi-${card.id}`;
            return (
              <Card
                key={card.id}
                role="region"
                aria-labelledby={regionId}
                className="flex flex-col p-4 sm:p-6"
              >
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p id={regionId} className="text-sm text-gray-600">
                      {card.title}
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                      {card.value}
                    </p>
                    <div className="mt-2 flex items-start gap-1">
                      {card.trend === "up" && (
                        <TrendingUp
                          className="mt-0.5 size-4 shrink-0 text-green-600"
                          aria-hidden
                        />
                      )}
                      {card.trend === "down" && (
                        <TrendingDown
                          className="mt-0.5 size-4 shrink-0 text-green-600"
                          aria-hidden
                        />
                      )}
                      <span className="text-sm leading-snug text-gray-600">
                        {card.hint}
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
      </section>

      {/* 5 · Análisis bajo demanda (revelación progresiva) */}
      <DashboardVisualAnalysis />

      {/* 6 · Historial operativo */}
      <section aria-labelledby="dash-orders">
        <h2 id="dash-orders" className="sr-only">
          Últimos pedidos
        </h2>
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                Últimos pedidos
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Movimiento reciente (demostración)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full shrink-0 sm:w-auto"
              asChild
            >
              <Link to="/punto-venta" className="gap-2">
                Ver todos
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
