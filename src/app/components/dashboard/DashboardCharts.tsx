import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../ui/card";

const salesLast7Days = [
  { day: "Lun", ventas: 8.2 },
  { day: "Mar", ventas: 9.1 },
  { day: "Mié", ventas: 7.4 },
  { day: "Jue", ventas: 10.2 },
  { day: "Vie", ventas: 11.5 },
  { day: "Sáb", ventas: 14.8 },
  { day: "Dom", ventas: 6.3 },
];

const categoryMix = [
  { name: "Lácteos", value: 58, fill: "#2563eb" },
  { name: "Fiambres", value: 24, fill: "#7c3aed" },
  { name: "Bebidas", value: 12, fill: "#0d9488" },
  { name: "Otros", value: 6, fill: "#64748b" },
];

function formatThousands(v: number) {
  return `$${v.toFixed(1)}k`;
}

export function SalesTrendCard() {
  return (
    <Card className="p-5 shadow-sm sm:p-6">
      <div className="mb-1">
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          Ventas de la semana
        </h2>
        <p className="text-xs text-gray-500 sm:text-sm">
          Monto estimado por día (miles ARS, demo)
        </p>
      </div>
      <div
        className="mt-4 h-[220px] w-full min-w-0"
        role="img"
        aria-label="Gráfico de área: ventas diarias de los últimos siete días"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesLast7Days}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatThousands}
              width={44}
            />
            <Tooltip
              formatter={(value: number) => [`${formatThousands(value)}`, "Ventas"]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#fillVentas)"
              name="Ventas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CategoryMixCard() {
  return (
    <Card className="p-5 shadow-sm sm:p-6">
      <div className="mb-1">
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          Mix de ventas
        </h2>
        <p className="text-xs text-gray-500 sm:text-sm">
          Participación por categoría (últimos 30 días, demo)
        </p>
      </div>
      <div
        className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between"
        role="img"
        aria-label="Gráfico circular: porcentaje de ventas por categoría de producto"
      >
        <div className="h-[200px] w-full max-w-[220px] min-w-0 sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryMix}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
              >
                {categoryMix.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Participación"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="grid w-full max-w-xs grid-cols-2 gap-2 text-xs sm:block sm:space-y-2 sm:text-sm">
          {categoryMix.map((c) => (
            <li key={c.name} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: c.fill }}
                aria-hidden
              />
              <span className="text-gray-700">
                <span className="font-medium">{c.name}</span>{" "}
                <span className="text-gray-500">({c.value}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
