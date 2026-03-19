import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Panel de Control" },
  { path: "/inventario", icon: Package, label: "Inventario" },
  { path: "/punto-venta", icon: ShoppingCart, label: "Punto de Venta" },
  { path: "/clientes", icon: Users, label: "Clientes" },
  { path: "/configuracion", icon: SettingsIcon, label: "Configuración" },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">ERP Business</h1>
          <p className="text-sm text-gray-500 mt-1">Sistema de Gestión</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-semibold">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@empresa.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
