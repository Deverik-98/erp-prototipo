import { useCallback, useEffect, useRef, useState } from "react";

export type MockRemoteState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

const DEFAULT_DELAY_MS = 480;

const DEFAULT_NETWORK_ERROR =
  "No pudimos obtener los datos. Revisá tu conexión o intentá de nuevo en un momento.";

type Options = {
  delayMs?: number;
  /**
   * Simula un fallo en el primer intento (útil en demo para probar “Reintentar”).
   * Desde el segundo intento la carga tiene éxito.
   */
  failFirstLoad?: boolean;
};

/**
 * Simula una carga remota con delay. Sustituir por fetch real manteniendo los mismos estados.
 */
export function useMockRemoteData<T>(
  loadData: () => T,
  options?: Options
): MockRemoteState<T> & { retry: () => void } {
  const loadRef = useRef(loadData);
  loadRef.current = loadData;

  const optsRef = useRef(options);
  optsRef.current = options;

  const attemptRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<MockRemoteState<T>>({
    status: "loading",
    data: null,
    error: null,
  });

  const run = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState({ status: "loading", data: null, error: null });

    const delay = optsRef.current?.delayMs ?? DEFAULT_DELAY_MS;
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      attemptRef.current += 1;
      const failFirst = optsRef.current?.failFirstLoad ?? false;
      if (failFirst && attemptRef.current === 1) {
        setState({
          status: "error",
          data: null,
          error: DEFAULT_NETWORK_ERROR,
        });
        return;
      }
      try {
        const data = loadRef.current();
        setState({ status: "success", data, error: null });
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Ocurrió un error inesperado. Si persiste, contactá a soporte.";
        setState({ status: "error", data: null, error: msg });
      }
    }, delay);
  }, []);

  useEffect(() => {
    run();
    return () => {
      if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
    };
  }, [run]);

  return { ...state, retry: run };
}
