import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import {
  APP_NAME,
  APP_TAGLINE,
  logoUrl,
  SESSION_DISPLAY_NAME,
  SESSION_EMAIL,
  SESSION_INITIALS,
} from "../branding";

function BrandTitle({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <img
        src={logoUrl()}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-lg"
      />
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-gray-900">{APP_NAME}</p>
        <p className="truncate text-xs text-gray-500">{APP_TAGLINE}</p>
      </div>
    </div>
  );
}

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Panel de Control" },
  { path: "/inventario", icon: Package, label: "Inventario" },
  { path: "/punto-venta", icon: ShoppingCart, label: "Punto de Venta" },
  { path: "/clientes", icon: Users, label: "Clientes" },
  { path: "/configuracion", icon: SettingsIcon, label: "Configuración" },
];

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const location = useLocation();

  return (
    <nav
      className={className}
      aria-label="Navegación principal"
    >
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Barra superior móvil */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
        <BrandTitle className="flex-1" />
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          id="mobile-navigation"
          className="flex h-full max-h-screen w-[min(100vw-2rem,20rem)] flex-col gap-0 p-0 sm:max-w-xs"
        >
          <SheetHeader className="border-b border-gray-200 p-4 text-left">
            <SheetTitle className="sr-only">{APP_NAME}</SheetTitle>
            <SheetDescription className="sr-only">
              Menú de navegación del panel
            </SheetDescription>
            <BrandTitle />
          </SheetHeader>
          <NavLinks
            className="flex-1 overflow-y-auto p-3"
            onNavigate={() => setMobileOpen(false)}
          />
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-semibold text-blue-700">
                  {SESSION_INITIALS}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {SESSION_DISPLAY_NAME}
                </p>
                <p className="truncate text-xs text-gray-500">{SESSION_EMAIL}</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar escritorio */}
      <aside
        className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex"
        aria-label="Barra lateral"
      >
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl()}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{APP_NAME}</h1>
              <p className="mt-0.5 text-sm text-gray-500">{APP_TAGLINE}</p>
            </div>
          </div>
        </div>
        <NavLinks className="flex-1 overflow-y-auto p-4" />
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-700">
                {SESSION_INITIALS}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {SESSION_DISPLAY_NAME}
              </p>
              <p className="truncate text-xs text-gray-500">{SESSION_EMAIL}</p>
            </div>
          </div>
        </div>
      </aside>

      <main
        id="main-content"
        className="min-h-screen flex-1 overflow-x-hidden overflow-y-auto pt-14 lg:pt-0"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
}
