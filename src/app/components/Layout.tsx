import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import type { LucideIcon } from "lucide-react";
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

type NavItem = {
  path: string;
  icon: LucideIcon;
  /** Título corto y escaneable */
  label: string;
  /** Una línea: qué vas a hacer o qué verás al entrar */
  hint: string;
};

type NavSection = {
  id: string;
  title: string;
  items: NavItem[];
};

/** Orden operativo típico PyME; hints orientados a tarea (no jerga interna). */
const navSections: NavSection[] = [
  {
    id: "operacion",
    title: "Operación",
    items: [
      {
        path: "/",
        icon: LayoutDashboard,
        label: "Inicio",
        hint: "Resumen, métricas y pedidos recientes",
      },
      {
        path: "/inventario",
        icon: Package,
        label: "Inventario",
        hint: "Stock, exportación CSV, valor y agrupación",
      },
      {
        path: "/ventas",
        icon: ShoppingCart,
        label: "Ventas",
        hint: "Nueva venta, historial y recibos",
      },
      {
        path: "/clientes",
        icon: Users,
        label: "Clientes",
        hint: "Directorio, datos de contacto y compras",
      },
    ],
  },
  {
    id: "sistema",
    title: "Sistema",
    items: [
      {
        path: "/configuracion",
        icon: SettingsIcon,
        label: "Configuración",
        hint: "Usuarios, roles, políticas y bitácora",
      },
    ],
  },
];

function isNavActive(pathname: string, itemPath: string) {
  if (itemPath === "/") return pathname === "/";
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const location = useLocation();

  return (
    <nav className={className} aria-label="Navegación principal">
      <ul className="space-y-5">
        {navSections.map((section, sectionIndex) => (
          <li key={section.id} className="list-none">
            <p
              id={`nav-section-${section.id}`}
              className={cn(
                "px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400",
                sectionIndex === 0 ? "pt-0" : "pt-1"
              )}
            >
              {section.title}
            </p>
            <ul className="mt-2 space-y-1" aria-labelledby={`nav-section-${section.id}`}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = isNavActive(location.pathname, item.path);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onNavigate}
                      className={cn(
                        "flex min-h-[3.25rem] gap-3 rounded-lg px-3 py-2.5 text-left transition-colors sm:min-h-12",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                        isActive
                          ? "bg-blue-50 text-blue-800 ring-1 ring-blue-100/80"
                          : "text-gray-800 hover:bg-gray-100"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                        aria-hidden
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1 py-0.5">
                        <span
                          className={cn(
                            "block text-sm font-semibold leading-tight",
                            isActive ? "text-blue-900" : "text-gray-900"
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-xs font-normal leading-snug",
                            isActive ? "text-blue-700/90" : "text-gray-500"
                          )}
                        >
                          {item.hint}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 lg:h-screen lg:max-h-screen lg:overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Barra superior móvil: marca centrada (espaciador = ancho del botón menú) */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-gray-200 bg-white px-3 sm:px-4 lg:hidden">
        <div className="flex w-10 shrink-0 items-center justify-start">
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
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center px-1">
          <BrandTitle className="min-w-0 [&>div]:text-center" />
        </div>
        <div className="w-10 shrink-0" aria-hidden="true" />
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

      {/* Sidebar escritorio: alto fijo al viewport; sin scroll de página en el lateral */}
      <aside
        className="hidden h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white lg:flex"
        aria-label="Barra lateral"
      >
        <div className="shrink-0 border-b border-gray-200 p-6">
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
        className="min-h-screen min-w-0 flex-1 overflow-x-hidden pt-14 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain lg:pt-0"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
}
