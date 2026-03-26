import { useState } from "react";
import { History, ShoppingCart } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { Button } from "../components/ui/button";
import { InvoicePreviewDialog } from "../sales/InvoicePreviewDialog";
import { SalesHistoryTab } from "../sales/SalesHistoryTab";
import { SalesPosTab } from "../sales/SalesPosTab";
import type { SaleRecord } from "../sales/sales.types";

export function Sales() {
  const [view, setView] = useState<"pos" | "history">("pos");
  const [receiptSale, setReceiptSale] = useState<SaleRecord | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const openReceipt = (sale: SaleRecord) => {
    setReceiptSale(sale);
    setReceiptOpen(true);
  };

  const handleReceiptOpenChange = (open: boolean) => {
    setReceiptOpen(open);
    if (!open) setReceiptSale(null);
  };

  return (
    <PageShell className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pb-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Ventas
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-snug text-muted-foreground sm:text-[0.9375rem]">
            Cobrá en el POS, revisá el historial y abrí recibos cuando haga falta. Todo es
            prototipo en memoria.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pt-0.5 sm:justify-end">
          {view === "pos" ? (
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              onClick={() => setView("history")}
            >
              <History className="size-4" aria-hidden />
              Ver historial
            </Button>
          ) : (
            <Button type="button" className="gap-1.5" onClick={() => setView("pos")}>
              <ShoppingCart className="size-4" aria-hidden />
              Nueva venta
            </Button>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 pt-3 sm:pt-4">
      {view === "pos" ? (
        <SalesPosTab
          onSaleComplete={openReceipt}
          onPreviewDraft={(sale) => {
            setReceiptSale(sale);
            setReceiptOpen(true);
          }}
        />
      ) : (
        <SalesHistoryTab onViewReceipt={openReceipt} />
      )}
      </div>

      <InvoicePreviewDialog
        sale={receiptSale}
        open={receiptOpen && receiptSale !== null}
        onOpenChange={handleReceiptOpenChange}
      />
    </PageShell>
  );
}
