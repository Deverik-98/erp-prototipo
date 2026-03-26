import { useMemo } from "react";
import { Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { buildInvoiceHtml } from "./invoiceHtml";
import { simulatePdfDownload } from "./simulatePdfDownload";
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
      <DialogContent className="flex max-h-[min(92vh,900px)] min-h-0 w-[calc(100%-1rem)] max-w-[min(100vw-1rem,28rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(100vw-2rem,28rem)]">
        <DialogHeader className="shrink-0 space-y-1 border-b border-gray-100 px-4 py-4 text-left sm:px-6">
          <DialogTitle className="pr-10 text-lg">Recibo de pago</DialogTitle>
          <DialogDescription className="text-sm">
            Vista previa del comprobante no fiscal (demo). La descarga en PDF se simula
            desde el botón inferior; no se abre otra pestaña ni se sale de esta página.
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#e8e8ea]"
          style={{ minHeight: "min(50vh, 360px)" }}
        >
          {sale ? (
            <iframe
              title="Vista previa del recibo"
              srcDoc={srcDoc}
              className="h-full min-h-0 w-full flex-1 border-0 bg-[#e8e8ea]"
              sandbox="allow-same-origin"
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
            className="w-full gap-2 sm:w-auto"
            disabled={!sale}
            onClick={() => {
              if (!sale) return;
              simulatePdfDownload(sale);
            }}
          >
            <Download className="size-4" aria-hidden />
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
