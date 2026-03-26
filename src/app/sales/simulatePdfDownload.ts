import { appToast } from "../lib/appToast";
import type { SaleRecord } from "./sales.types";

const SIM_MS = 750;

/**
 * Simula la descarga de PDF del recibo (prototipo: sin archivo, sin ventanas nuevas).
 */
export function simulatePdfDownload(sale: SaleRecord) {
  window.setTimeout(() => {
    appToast.success("PDF descargado (simulación)", {
      description: `Recibo N.º ${sale.receiptNumber}. En producción se generaría el archivo aquí; en este prototipo no se descarga nada.`,
      duration: 5000,
    });
  }, SIM_MS);
}
