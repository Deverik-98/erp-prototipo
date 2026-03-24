import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Sales } from "./pages/Sales";
import { Customers } from "./pages/Customers";
import { Settings } from "./pages/Settings";

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
  { basename: "/erp-prototipo/" }
);
