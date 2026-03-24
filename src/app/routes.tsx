import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Sales } from "./pages/Sales";
import { Customers } from "./pages/Customers";
import { Settings } from "./pages/Settings";

/** Alineado con `vite.config` `base` (local `/`, producción `/erp-prototipo/`). Sin barra final. */
function routerBasename(): string | undefined {
  const raw = import.meta.env.BASE_URL;
  if (!raw || raw === "/") return undefined;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

const basename = routerBasename();

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: Dashboard },
        { path: "inventario", Component: Inventory },
        { path: "ventas", Component: Sales },
        {
          path: "punto-venta",
          element: <Navigate to="/ventas" replace />,
        },
        { path: "clientes", Component: Customers },
        { path: "configuracion", Component: Settings },
      ],
    },
  ],
  basename ? { basename } : undefined
);
