import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { PointOfSale } from "./pages/PointOfSale";
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
        { path: "punto-venta", Component: PointOfSale },
        { path: "clientes", Component: Customers },
        { path: "configuracion", Component: Settings },
      ],
    },
  ],
  { basename: '/erp-prototipo/' }
);
