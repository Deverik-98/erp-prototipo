import { APP_NAME, SESSION_DISPLAY_NAME } from "../../branding";

type DashboardTopBarProps = {
  dateLong: string;
  syncStamp: string;
};

/**
 * Cabecera densa: una sola franja con contexto alineado (sin tarjetas flotantes).
 */
export function DashboardTopBar({ dateLong, syncStamp }: DashboardTopBarProps) {
  return (
    <header className="mb-4 border-b border-gray-200 pb-4 sm:mb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-gray-600 sm:text-sm">
            Hola,{" "}
            <span className="font-semibold text-gray-900">
              {SESSION_DISPLAY_NAME}
            </span>
            <span className="mx-1.5 text-gray-300" aria-hidden>
              ·
            </span>
            <span className="text-gray-500">{dateLong}</span>
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Inicio
          </h1>
          <p className="mt-1 hidden text-xs text-gray-500 sm:block">
            Resumen operativo del día y accesos frecuentes.
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5 text-left text-xs text-gray-600 sm:items-end sm:text-right sm:text-sm">
          <p>
            <span className="font-semibold text-gray-900">{APP_NAME}</span>
            <span className="text-gray-400"> · </span>
            Sucursal principal
          </p>
          <p className="tabular-nums text-gray-500">
            Demostración · actualizado {syncStamp}
          </p>
        </div>
      </div>
    </header>
  );
}
