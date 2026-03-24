export type SaleLineItem = {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
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
  total: number;
  paymentMethod: string;
  paymentMethodLabel: string;
};

export type SaleRecord = NewSaleInput & {
  id: string;
  issuedAt: number;
  /** Número de recibo interno demo (8 dígitos). */
  receiptNumber: string;
};
