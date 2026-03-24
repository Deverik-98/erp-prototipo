import { useMemo } from "react";
import { Download, Printer, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { appToast } from "../lib/appToast";
import {
  buildInvoiceHtml,
  downloadInvoiceHtml,
  printInvoiceInNewWindow,
} from "./invoiceHtml";
import type { SaleRecord } from "./sales.types";

type InvoicePreviewDialogProps = {
  sale: SaleRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InvoicePreviewDialog({
  sale,
  open,
  onOpenChange,
}: InvoicePreviewDialogProps) {
  const srcDoc = useMemo(
    () => (sale ? buildInvoiceHtml(sale) : ""),
    [sale]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,880px)] w-[calc(100%-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 space-y-1 border-b border-gray-100 px-4 py-4 text-left sm:px-6">
          <DialogTitle className="pr-10 text-lg">Recibo de pago</DialogTitle>
          <DialogDescription className="text-sm">
            Vista previa del comprobante no fiscal (demo). Podés descargarlo como
            HTML o imprimir / guardar como PDF desde el navegador.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-hidden bg-gray-100">
          {sale ? (
            <iframe
              title="Vista previa del recibo"
              srcDoc={srcDoc}
              className="h-[min(60vh,520px)] w-full border-0 bg-white"
              sandbox="allow-modals allow-same-origin"
            />
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-gray-100 bg-white p-4 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" aria-hidden />
            Cerrar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            disabled={!sale}
            onClick={() => {
              if (!sale) return;
              if (!printInvoiceInNewWindow(sale)) {
                appToast.error("No se pudo abrir la impresión", {
                  description:
                    "El navegador bloqueó la ventana emergente. Permití ventanas para este sitio o usá “Descargar”.",
                });
              }
            }}
          >
            <Printer className="size-4" aria-hidden />
            Imprimir / PDF
          </Button>
          <Button
            type="button"
            className="w-full gap-2 sm:w-auto"
            disabled={!sale}
            onClick={() => {
              if (!sale) return;
              try {
                downloadInvoiceHtml(sale);
                appToast.success("Recibo descargado", {
                  description:
                    "Abrí el archivo .html y usá Imprimir → Guardar como PDF si lo necesitás.",
                });
              } catch {
                appToast.error("No se pudo descargar", {
                  description: "Intentá de nuevo o usá Imprimir / PDF.",
                });
              }
            }}
          >
            <Download className="size-4" aria-hidden />
            Descargar HTML
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
