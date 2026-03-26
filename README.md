# DemoApp — ERP Argentina (prototipo)

Prototipo frontend (**DemoApp**) de un ERP B2B SaaS para digitalizar PyMEs (productores lácteos, comercios minoristas) que operan con Excel y pedidos por WhatsApp.

## Descripción

Aplicación web interna con panel de control, inventario, ventas (POS + historial y recibos), directorio de clientes y configuración. Diseñada para dueños de negocio y personal administrativo con interfaces simples e intuitivas.

**Alcance:** Solo frontend. Sin backend. Datos mock/placeholder para demostración.

## Páginas

- **Inicio (dashboard):** Saludo + sucursal → “Cómo va hoy” → atajos → **un solo card** “Stock y contexto” (`DashboardStockContextSection`): izquierda lista compacta de alertas (sin grid 3× que estira filas) + CTA; derecha KPIs **layout strip** + **Cierre del mes** → gráficos → movimiento reciente
- **Inventario:** KPIs según filtros; **agrupación** con **colapsables** (totales por grupo: líneas, stock u., valor, alertas) y detalle al expandir; filtro **Origen** (producción interna vs. compra · distribución); **export CSV**; **modal de alta** en 2 pestañas (datos generales + variantes con tipos de atributo reutilizables o SKU único); catálogo en estado local (demo). *MVP:* sin MRP/BOM; variantes como filas de inventario independientes (escalable a matriz talla×color en backend).
- **Ventas:** Nueva venta (pedido tipo WhatsApp, carrito, descuentos, medios de pago); **historial** con búsqueda; **recibo** con vista previa en pantalla y **descarga PDF simulada** (prototipo, sin archivo). Ruta: `/ventas` (antes `/punto-venta` redirige).
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

En desarrollo, Vite usa la raíz del sitio: abrí [http://localhost:5173/](http://localhost:5173/) (por ejemplo [http://localhost:5173/ventas](http://localhost:5173/ventas)). La demo publicada en GitHub Pages sigue bajo `/erp-prototipo/`.

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

- **`feature/*`** — Toda nueva funcionalidad nace aquí (commit y push del feature).
- **`develop`** — Se integra solo con **merge `--no-ff`** desde `feature/*` (o PR equivalente). No commitear features directo en `develop`.
- **`main`** — Código estable para demo; se actualiza con **merge `--no-ff`** desde `develop` cuando el integrador decide publicar.

Si omitís `--no-ff`, Git puede hacer *fast-forward* y el historial deja de mostrar el merge de la feature como rama integrada; **usar siempre** `--no-ff` en esos dos pasos.

Orden típico: `feature/mi-tarea` → `develop` → `main`. Tras integrar, eliminar la rama `feature` en local y remoto.

## Licencia

Proyecto privado. Uso interno y demostración.
