import {
  APP_NAME,
  SESSION_DISPLAY_NAME,
} from "../../branding";

type DashboardHeroHeaderProps = {
  dateLong: string;
  syncStamp: string;
};

/**
 * Cabecera en dos columnas: título a la izquierda, contexto operativo a la derecha
 * (aprovecha ancho en desktop sin texto didáctico).
 */
export function DashboardHeroHeader({
  dateLong,
  syncStamp,
}: DashboardHeroHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6">
      <div className="min-w-0 flex-1 lg:py-0.5">
        <p className="text-sm text-gray-600">
          Hola,{" "}
          <span className="font-semibold text-gray-900">
            {SESSION_DISPLAY_NAME}
          </span>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Inicio
        </h1>
        <p className="mt-1 text-sm text-gray-600">{dateLong}</p>
      </div>
      <aside
        className="w-full shrink-0 rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50/95 to-white p-4 shadow-sm sm:p-4 lg:max-w-sm lg:self-start lg:text-right"
        aria-label="Contexto de operación"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {APP_NAME}
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          Sucursal principal
        </p>
        <p className="mt-1.5 text-xs leading-snug text-gray-600">
          Demo · lácteos y almacén
        </p>
        <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500 tabular-nums">
          Última actualización · {syncStamp}
        </p>
      </aside>
    </header>
  );
}
