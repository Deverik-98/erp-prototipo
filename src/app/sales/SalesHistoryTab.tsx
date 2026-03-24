import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  Search,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { EmptyState } from "../components/feedback/PageStates";
import { appToast } from "../lib/appToast";
import { downloadInvoiceHtml } from "./invoiceHtml";
import { useSalesHistory } from "./SalesHistoryContext";
import type { SaleRecord } from "./sales.types";

type SalesHistoryTabProps = {
  onViewReceipt: (sale: SaleRecord) => void;
};

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function SalesHistoryTab({ onViewReceipt }: SalesHistoryTabProps) {
  const { sales } = useSalesHistory();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.receiptNumber.includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.customerPhone.includes(q) ||
        s.paymentMethodLabel.toLowerCase().includes(q)
    );
  }, [sales, query]);

  const handleDownload = (sale: SaleRecord) => {
    try {
      downloadInvoiceHtml(sale);
      appToast.success("Recibo descargado", {
        description: `Archivo del recibo N.º ${sale.receiptNumber} generado de nuevo.`,
      });
    } catch {
      appToast.error("No se pudo descargar", {
        description: "Intentá de nuevo o abrí el recibo e imprimí a PDF.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <Label htmlFor="sales-history-search" className="mb-2 block text-sm font-medium">
          Buscar en el historial
        </Label>
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <Input
            id="sales-history-search"
            placeholder="Cliente, teléfono, N.º recibo, ID de venta…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Las ventas quedan en memoria hasta recargar la página (prototipo).
        </p>
      </Card>

      <Card className="overflow-hidden p-0">
        {filtered.length === 0 ? (
          <EmptyState
            title={sales.length === 0 ? "Todavía no hay ventas" : "Sin resultados"}
            description={
              sales.length === 0
                ? "Registrá una venta en la pestaña “Nueva venta” y el recibo aparecerá acá para volver a descargarlo."
                : "Probá otra búsqueda o limpiá el filtro."
            }
            icon={FileText}
            className="py-16"
          >
            {sales.length > 0 && query ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setQuery("")}>
                Limpiar búsqueda
              </Button>
            ) : null}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <caption className="sr-only">
                Historial de ventas con totales y acciones de recibo
              </caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Fecha</TableHead>
                  <TableHead scope="col">Recibo</TableHead>
                  <TableHead scope="col">Venta</TableHead>
                  <TableHead scope="col">Cliente</TableHead>
                  <TableHead scope="col">Pago</TableHead>
                  <TableHead scope="col" className="text-right">
                    Total
                  </TableHead>
                  <TableHead scope="col" className="text-right">
                    Recibo
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="whitespace-nowrap text-gray-600 text-sm">
                      {dateFmt.format(new Date(sale.issuedAt))}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      {sale.receiptNumber}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs text-gray-500">
                      {sale.id}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{sale.customerName}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {sale.customerPhone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {sale.paymentMethodLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {money.format(sale.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 px-2 text-xs"
                          onClick={() => onViewReceipt(sale)}
                        >
                          <FileText className="size-3.5" aria-hidden />
                          Ver
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 px-2 text-xs"
                          onClick={() => handleDownload(sale)}
                        >
                          <Download className="size-3.5" aria-hidden />
                          Descargar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
