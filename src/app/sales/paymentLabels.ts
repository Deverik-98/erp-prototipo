export const PAYMENT_METHOD_OPTIONS = [
  { key: "efectivo", label: "Efectivo" },
  { key: "tarjeta", label: "Tarjeta" },
  { key: "transferencia", label: "Transferencia" },
] as const;

export type PaymentMethodKey = (typeof PAYMENT_METHOD_OPTIONS)[number]["key"];

const LABEL_MAP: Record<string, string> = Object.fromEntries(
  PAYMENT_METHOD_OPTIONS.map((o) => [o.key, o.label])
);

export function paymentMethodLabel(method: string): string {
  return LABEL_MAP[method] ?? method;
}
