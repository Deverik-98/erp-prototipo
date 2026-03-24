import { useState } from "react";
import { PageHeader, PageShell } from "../components/PageShell";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { InvoicePreviewDialog } from "../sales/InvoicePreviewDialog";
import { SalesHistoryTab } from "../sales/SalesHistoryTab";
import { SalesPosTab } from "../sales/SalesPosTab";
import type { SaleRecord } from "../sales/sales.types";

export function Sales() {
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
    <PageShell>
      <PageHeader
        title="Ventas"
        description="Registrar pedidos, cobrar y consultar el historial con recibos descargables (prototipo)."
      />

      <Tabs defaultValue="nueva" className="mt-2 gap-6">
        <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto">
          <TabsTrigger value="nueva">Nueva venta</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="nueva" className="mt-0 outline-none">
          <SalesPosTab onSaleComplete={openReceipt} />
        </TabsContent>

        <TabsContent value="historial" className="mt-0 outline-none">
          <SalesHistoryTab onViewReceipt={openReceipt} />
        </TabsContent>
      </Tabs>

      <InvoicePreviewDialog
        sale={receiptSale}
        open={receiptOpen && receiptSale !== null}
        onOpenChange={handleReceiptOpenChange}
      />
    </PageShell>
  );
}
