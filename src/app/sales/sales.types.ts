export type SaleLineItem = {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
};

/** Impuesto aplicado sobre la base (subtotal − descuento). */
export type SaleTaxLine = {
  id: string;
  label: string;
  ratePercent: number;
  amount: number;
};

/** Línea de cobro (pago mixto). */
export type SalePaymentLine = {
  methodKey: string;
  methodLabel: string;
  amount: number;
};

/** Payload al registrar desde el POS (sin id ni timestamps). */
export type NewSaleInput = {
  customerId: number;
  customerName: string;
  customerPhone: string;
  items: SaleLineItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  /** Base sobre la que se calculan los impuestos. */
  taxableBase: number;
  taxLines: SaleTaxLine[];
  taxesTotal: number;
  total: number;
  payments: SalePaymentLine[];
  /** Texto corto para tabla / búsqueda (ej. "Efectivo · Tarjeta"). */
  paymentsSummaryLabel: string;
};

export type SaleRecord = NewSaleInput & {
  id: string;
  issuedAt: number;
  /** Número de recibo interno demo (8 dígitos). */
  receiptNumber: string;
};
