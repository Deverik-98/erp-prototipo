# ZumaApp — ERP Argentina (prototipo)

Prototipo frontend (**ZumaApp**) de un ERP B2B SaaS para digitalizar PyMEs (productores lácteos, comercios minoristas) que operan con Excel y pedidos por WhatsApp.

## Descripción

Aplicación web interna con panel de control, inventario, punto de venta, directorio de clientes y configuración. Diseñada para dueños de negocio y personal administrativo con interfaces simples e intuitivas.

**Alcance:** Solo frontend. Sin backend. Datos mock/placeholder para demostración.

## Páginas

- **Inicio (dashboard):** Cabecera en dos columnas (contexto sucursal) → resumen del día → accesos → bloque 60/40 (stock crítico | reporte mensual + KPIs compactos) → gráficos colapsables → pedidos
- **Inventario:** Productos e insumos, búsqueda, filtros, importación masiva (simulada)
- **Punto de Venta:** Registro de pedidos tipo WhatsApp, carrito, descuentos, métodos de pago
- **Clientes:** Directorio con búsqueda, alta de nuevos clientes
- **Configuración:** Roles (Admin, Cajero), bitácora de actividad

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

Abre [http://localhost:5173/erp-prototipo/](http://localhost:5173/erp-prototipo/) en el navegador.

## Build para producción

```bash
npm run build
```

Los archivos se generan en `dist/`.

## Despliegue

El proyecto se despliega en **GitHub Pages** automáticamente al hacer push a la rama `main`.

**Demo online:** [https://deverik-98.github.io/erp-prototipo/](https://deverik-98.github.io/erp-prototipo/)

## Interfaz

- Diseño **responsive** (menú lateral con secciones Operación / Sistema, título + descripción por ítem; en móvil, drawer; tablas con scroll horizontal).
- Enlace **“Saltar al contenido principal”** visible al enfocar con teclado.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS
- Radix UI (shadcn/ui)
- React Router
- Sonner (toasts)

## Git Flow

- `main` — Código estable para demo
- `develop` — Integración de features
- `feature/*` — Nuevas funcionalidades

## Licencia

Proyecto privado. Uso interno y demostración.
