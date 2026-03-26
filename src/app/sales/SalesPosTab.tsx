import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { cn } from "../components/ui/utils";
import { ErrorState, LoadingState } from "../components/feedback/PageStates";
import { useMockRemoteData } from "../hooks/useMockRemoteData";
import { appToast } from "../lib/appToast";
import {
  PAYMENT_METHOD_OPTIONS,
  paymentMethodLabel,
  type PaymentMethodKey,
} from "./paymentLabels";
import { useSalesHistory } from "./SalesHistoryContext";
import type { NewSaleInput, SaleRecord } from "./sales.types";

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `x-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseAmount(s: string): number {
  const t = s.trim().replace(/\s/g, "").replace(",", ".");
  if (!t) return 0;
  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
}

type PosCustomer = { id: number; name: string; phone: string };
type PosProduct = { id: number; name: string; price: number; stock: number };

const POS_CUSTOMERS: PosCustomer[] = [
  { id: 1, name: "María García", phone: "+54 11 1234-5678" },
  { id: 2, name: "Carlos López", phone: "+54 11 5678-9012" },
  { id: 3, name: "Ana Martínez", phone: "+54 11 9012-3456" },
];

const POS_PRODUCTS: PosProduct[] = [
  { id: 1, name: "Leche Entera 1L", price: 65, stock: 150 },
  { id: 2, name: "Queso Fresco 500g", price: 120, stock: 45 },
  { id: 3, name: "Yogurt Natural 1L", price: 40, stock: 200 },
  { id: 4, name: "Mantequilla 250g", price: 75, stock: 80 },
  { id: 5, name: "Queso Mozzarella 1kg", price: 190, stock: 25 },
  { id: 6, name: "Crema de Leche 500ml", price: 55, stock: 120 },
];

type PosCatalog = { customers: PosCustomer[]; products: PosProduct[] };

function loadPosCatalog(): PosCatalog {
  return {
    customers: POS_CUSTOMERS.map((c) => ({ ...c })),
    products: POS_PRODUCTS.map((p) => ({ ...p })),
  };
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

type DraftTax = { id: string; label: string; rate: string };

const TAX_PRESETS = [
  { id: "p-tax-iva-21", label: "IVA 21%", rate: "21" },
  { id: "p-tax-iva-105", label: "IVA 10,5%", rate: "10.5" },
  { id: "p-tax-iibb", label: "IIBB 3%", rate: "3" },
] as const;

/** Impuesto más habitual en ventas B2C en Argentina (IVA general). */
const DEFAULT_ARG_TAX_PRESET = TAX_PRESETS[0];

function isPresetTaxId(id: string) {
  return TAX_PRESETS.some((p) => p.id === id);
}

function initialTaxDrafts(): DraftTax[] {
  return [
    {
      id: DEFAULT_ARG_TAX_PRESET.id,
      label: DEFAULT_ARG_TAX_PRESET.label,
      rate: DEFAULT_ARG_TAX_PRESET.rate,
    },
  ];
}

type PaymentLineDraft = { id: string; methodKey: PaymentMethodKey; amount: string };

function initialPaymentLines(): PaymentLineDraft[] {
  return [{ id: newId(), methodKey: "efectivo", amount: "" }];
}

function nextPaymentMethodKey(lines: PaymentLineDraft[]): PaymentMethodKey {
  const used = new Set(lines.map((l) => l.methodKey));
  for (const o of PAYMENT_METHOD_OPTIONS) {
    if (!used.has(o.key)) return o.key;
  }
  return "efectivo";
}

type SalesPosTabProps = {
  onSaleComplete: (sale: SaleRecord) => void;
  /** Vista previa del comprobante sin registrar (misma validación que cobrar). */
  onPreviewDraft?: (sale: SaleRecord) => void;
};

const moneyFmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** Misma precisión que el recibo HTML para el bloque estilo ticket */
const moneyReceipt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function ReceiptDivider({ className }: { className?: string }) {
  return (
    <hr
      className={cn("my-2 border-0 border-t border-dashed border-[#333]", className)}
      aria-hidden
    />
  );
}

function ReceiptRow({
  label,
  value,
  valueClassName,
}: {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between gap-2 py-0.5 text-[clamp(0.68rem,2.4vw,0.75rem)] [font-variant-numeric:tabular-nums]">
      <span className="min-w-0 break-words uppercase leading-snug text-[#333]">
        {label}
      </span>
      <span
        className={cn(
          "shrink-0 whitespace-nowrap text-right font-semibold text-[#111]",
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  );
}

const PAY_TOLERANCE = 0.02;

/** Un solo contorno visible (el ring por defecto del tema simulaba un “doble borde”). */
const POS_FIELD =
  "border border-[#c8c8c8] bg-white shadow-none outline-none focus-visible:border-[#333] focus-visible:ring-1 focus-visible:ring-[#333]/30";
const POS_FIELD_TEXT = "font-mono text-[0.75rem] leading-normal";
const posFieldCn = (...extra: (string | undefined)[]) =>
  cn(POS_FIELD, POS_FIELD_TEXT, ...extra);

/**
 * Combobox POS sin Popover+cmdk: portal a body + position fixed evita recortes por overflow del
 * layout (`main` con overflow-x) y conflictos de foco con Radix modal.
 */
function PosSearchDropdown({
  open,
  onOpenChange,
  triggerRef,
  searchId,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  searchId: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 320 });
  /** Evita que el mismo clic que abre dispare el cierre del backdrop. */
  const [backdropArmed, setBackdropArmed] = useState(false);

  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const place = () => {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;
      const width = Math.min(420, Math.max(260, r.width));
      let left = r.left;
      if (left + width > vw - margin) left = Math.max(margin, vw - margin - width);
      const below = r.bottom + 4;
      const panelMax = Math.min(360, vh - margin * 2);
      let top = below;
      if (below + panelMax > vh - margin) {
        const above = r.top - 4 - panelMax;
        top = above >= margin ? above : Math.max(margin, vh - margin - panelMax);
      }
      setCoords({ top, left, width });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) {
      setBackdropArmed(false);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setBackdropArmed(true));
    });
    const focusId = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(focusId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      {backdropArmed ? (
        <div
          className="fixed inset-0 z-[9998] bg-transparent"
          aria-hidden
          onPointerDownCapture={() => onOpenChange(false)}
        />
      ) : null}
      <div
        className="bg-popover text-popover-foreground fixed z-[9999] flex max-h-[min(360px,50dvh)] flex-col overflow-hidden rounded-md border shadow-md outline-none"
        style={{ top: coords.top, left: coords.left, width: coords.width }}
      >
        <div className="flex h-10 shrink-0 items-center gap-2 border-b px-2">
          <Search className="size-4 shrink-0 opacity-45" aria-hidden />
          <input
            ref={searchInputRef}
            id={searchId}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full min-w-0 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            autoComplete="off"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1">{children}</div>
      </div>
    </>,
    document.body
  );
}

const listRowCn =
  "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent";

export function SalesPosTab({
  onSaleComplete,
  onPreviewDraft,
}: SalesPosTabProps) {
  const { registerSale } = useSalesHistory();
  const remote = useMockRemoteData(loadPosCatalog, { delayMs: 400 });
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [addedCustomers, setAddedCustomers] = useState<PosCustomer[]>([]);
  const [customerComboOpen, setCustomerComboOpen] = useState(false);
  const [productComboOpen, setProductComboOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const customerTriggerRef = useRef<HTMLDivElement | null>(null);
  const productTriggerRef = useRef<HTMLDivElement | null>(null);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState("0");
  const [taxDrafts, setTaxDrafts] = useState<DraftTax[]>(() => initialTaxDrafts());
  const [paymentLines, setPaymentLines] = useState<PaymentLineDraft[]>(() =>
    initialPaymentLines()
  );

  const products = remote.status === "success" ? remote.data.products : [];
  const customers = remote.status === "success" ? remote.data.customers : [];

  const allCustomers = useMemo(
    () => [...customers, ...addedCustomers],
    [customers, addedCustomers]
  );

  const nextCustomerId = useMemo(() => {
    const m = allCustomers.reduce((acc, c) => Math.max(acc, c.id), 0);
    return m + 1;
  }, [allCustomers]);

  const selectedCustomerEntity = allCustomers.find(
    (c) => c.id.toString() === selectedCustomer
  );

  useEffect(() => {
    if (customerComboOpen) setCustomerSearch("");
  }, [customerComboOpen]);

  useEffect(() => {
    if (productComboOpen) setProductSearch("");
  }, [productComboOpen]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return allCustomers;
    return allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        String(c.id).includes(q)
    );
  }, [allCustomers, customerSearch]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const sku = String(p.id).padStart(6, "0");
      return (
        p.name.toLowerCase().includes(q) ||
        sku.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        String(p.price).includes(q) ||
        String(p.stock).includes(q)
      );
    });
  }, [products, productSearch]);

  const addToCart = (product: PosProduct) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountPct = parseFloat(discount || "0");
  const discountAmount = (subtotal * discountPct) / 100;
  const taxableBase = Math.max(0, subtotal - discountAmount);

  const { taxLines, taxesTotal, total } = useMemo(() => {
    const lines = taxDrafts
      .filter((t) => t.label.trim() && t.rate.trim() !== "")
      .map((t) => {
        const ratePercent = parseFloat(t.rate.replace(",", ".")) || 0;
        const raw = (taxableBase * ratePercent) / 100;
        const amount = Math.round(raw * 100) / 100;
        return {
          id: t.id,
          label: t.label.trim(),
          ratePercent,
          amount,
        };
      });
    const ttot = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;
    const tot = Math.round((taxableBase + ttot) * 100) / 100;
    return { taxLines: lines, taxesTotal: ttot, total: tot };
  }, [taxDrafts, taxableBase]);

  const paidSum = useMemo(() => {
    const s = paymentLines.reduce((acc, l) => acc + parseAmount(l.amount), 0);
    return Math.round(s * 100) / 100;
  }, [paymentLines]);

  const remainder = Math.round((total - paidSum) * 100) / 100;

  const addTaxRow = () => {
    setTaxDrafts((prev) => [...prev, { id: newId(), label: "", rate: "" }]);
  };

  const removeTaxRow = (id: string) => {
    setTaxDrafts((prev) => prev.filter((t) => t.id !== id));
  };

  const applyRemainderToEfectivo = () => {
    if (remainder <= 0) return;
    setPaymentLines((prev) => {
      const idx = prev.findIndex((l) => l.methodKey === "efectivo");
      if (idx >= 0) {
        const cur = parseAmount(prev[idx].amount);
        const merged = Math.round((cur + remainder) * 100) / 100;
        return prev.map((l, i) => (i === idx ? { ...l, amount: String(merged) } : l));
      }
      const merged = Math.round(remainder * 100) / 100;
      return [{ id: newId(), methodKey: "efectivo", amount: String(merged) }, ...prev];
    });
  };

  const addPaymentLine = () => {
    setPaymentLines((prev) => [
      ...prev,
      { id: newId(), methodKey: nextPaymentMethodKey(prev), amount: "" },
    ]);
  };

  const removePaymentLine = (id: string) => {
    setPaymentLines((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((l) => l.id !== id);
    });
  };

  const updatePaymentLine = (id: string, patch: Partial<Pick<PaymentLineDraft, "methodKey" | "amount">>) => {
    setPaymentLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  };

  const toggleTaxPreset = (preset: (typeof TAX_PRESETS)[number]) => {
    setTaxDrafts((prev) => {
      if (prev.some((t) => t.id === preset.id)) {
        return prev.filter((t) => t.id !== preset.id);
      }
      return [
        ...prev.filter((t) => t.id !== preset.id),
        { id: preset.id, label: preset.label, rate: preset.rate },
      ];
    });
  };

  const resetAfterSale = () => {
    setCart([]);
    setSelectedCustomer("");
    setDiscount("0");
    setTaxDrafts(initialTaxDrafts());
    setPaymentLines(initialPaymentLines());
  };

  const submitNewCustomer = () => {
    const name = newCustomerName.trim();
    const phone = newCustomerPhone.trim();
    if (!name || !phone) {
      appToast.warning("Completá los datos", {
        description: "Nombre y teléfono son obligatorios para dar de alta al cliente.",
      });
      return;
    }
    const id = nextCustomerId;
    setAddedCustomers((prev) => [...prev, { id, name, phone }]);
    setSelectedCustomer(String(id));
    setNewCustomerName("");
    setNewCustomerPhone("");
    setAddCustomerOpen(false);
    setCustomerComboOpen(false);
    appToast.success("Cliente agregado", { description: `${name} quedó seleccionado para esta venta.` });
  };

  const tryBuildSaleInput = ():
    | { ok: false; title: string; description: string }
    | { ok: true; input: NewSaleInput; customer: PosCustomer } => {
    if (cart.length === 0) {
      return {
        ok: false,
        title: "Falta armar el pedido",
        description:
          "Agregá al menos un producto al carrito antes de confirmar la venta.",
      };
    }
    if (!selectedCustomer) {
      return {
        ok: false,
        title: "Elegí un cliente",
        description: "Seleccioná un cliente en la columna izquierda.",
      };
    }
    const customer = allCustomers.find((c) => c.id.toString() === selectedCustomer);
    if (!customer) {
      return { ok: false, title: "Cliente inválido", description: "Volvé a elegir cliente." };
    }

    const activePaymentLines = paymentLines.filter((l) => parseAmount(l.amount) > 0);
    if (activePaymentLines.length === 0) {
      return {
        ok: false,
        title: "Indicá los pagos",
        description:
          "Ingresá el importe en al menos una fila de cobro; la suma debe coincidir con el total.",
      };
    }

    if (Math.abs(remainder) > PAY_TOLERANCE) {
      return {
        ok: false,
        title: remainder > 0 ? "Falta completar el cobro" : "Te pasaste del total",
        description:
          remainder > 0
            ? `Quedan ${moneyFmt.format(remainder)} por registrar.`
            : `Los pagos superan el total en ${moneyFmt.format(-remainder)}.`,
      };
    }

    const invalidTax = taxDrafts.some(
      (t) =>
        !isPresetTaxId(t.id) &&
        ((t.label.trim() && !t.rate.trim()) || (!t.label.trim() && t.rate.trim()))
    );
    if (invalidTax) {
      return {
        ok: false,
        title: "Revisá los impuestos",
        description:
          "Cada impuesto manual necesita nombre y %, o borrá la fila incompleta.",
      };
    }

    const payments = activePaymentLines.map((l) => ({
      methodKey: l.methodKey,
      methodLabel: paymentMethodLabel(l.methodKey),
      amount: Math.round(parseAmount(l.amount) * 100) / 100,
    }));

    const paymentsSummaryLabel = [
      ...new Set(payments.map((p) => p.methodLabel)),
    ].join(" · ");

    const input: NewSaleInput = {
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      discountPct,
      discountAmount,
      taxableBase,
      taxLines,
      taxesTotal,
      total,
      payments,
      paymentsSummaryLabel,
    };
    return { ok: true, input, customer };
  };

  const handleProcessSale = () => {
    const r = tryBuildSaleInput();
    if (!r.ok) {
      appToast.warning(r.title, { description: r.description });
      return;
    }
    const sale = registerSale(r.input);
    appToast.success("Venta registrada", {
      description: `Recibo N.º ${sale.receiptNumber} · Total ${moneyFmt.format(total)}.`,
      duration: 4000,
    });
    resetAfterSale();
    onSaleComplete(sale);
  };

  const handlePreviewDraft = () => {
    const r = tryBuildSaleInput();
    if (!r.ok) {
      appToast.warning(r.title, { description: r.description });
      return;
    }
    if (!onPreviewDraft) return;
    onPreviewDraft({
      ...r.input,
      id: `pv-${Date.now()}`,
      issuedAt: Date.now(),
      receiptNumber: "00000000",
    });
  };

  if (remote.status === "loading") {
    return (
      <div className="relative grid grid-cols-1 gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="h-9 animate-pulse rounded-md bg-muted" />
          <div className="h-9 animate-pulse rounded-md bg-muted" />
          <div className="min-h-[14rem] animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="min-h-[14rem] animate-pulse rounded-xl bg-muted lg:min-h-[18rem]" />
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 p-4 backdrop-blur-[1px]">
          <LoadingState
            title="Cargando catálogo y clientes…"
            description="Preparando productos y lista de clientes para tomar el pedido."
          />
        </div>
      </div>
    );
  }

  if (remote.status === "error") {
    return (
      <Card className="flex min-h-[min(50vh,24rem)] flex-col justify-center p-6">
        <ErrorState
          title="No se pudo cargar el punto de venta"
          description={remote.error}
          onRetry={remote.retry}
        />
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start lg:gap-5">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="pos-customer-trigger"
              className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              Cliente
            </Label>
            <div className="flex gap-2">
              <div ref={customerTriggerRef} className="min-w-0 flex-1">
                <Button
                  id="pos-customer-trigger"
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={customerComboOpen}
                  aria-haspopup="listbox"
                  className="h-9 w-full justify-between px-3 font-normal"
                  onClick={() => {
                    setProductComboOpen(false);
                    setCustomerComboOpen((o) => !o);
                  }}
                >
                  <span className="truncate text-left">
                    {selectedCustomerEntity
                      ? `${selectedCustomerEntity.name} · ${selectedCustomerEntity.phone}`
                      : "Buscar o elegir cliente…"}
                  </span>
                  <ChevronsUpDown className="ml-1 size-4 shrink-0 opacity-45" aria-hidden />
                </Button>
              </div>
              <PosSearchDropdown
                open={customerComboOpen}
                onOpenChange={setCustomerComboOpen}
                triggerRef={customerTriggerRef}
                searchId="pos-customer-search"
                searchPlaceholder="Nombre o teléfono…"
                searchValue={customerSearch}
                onSearchChange={setCustomerSearch}
              >
                {filteredCustomers.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Sin coincidencias.
                  </p>
                ) : (
                  <ul className="space-y-0.5" role="none">
                    <li role="none">
                      <button
                        type="button"
                        role="option"
                        className={listRowCn}
                        onClick={() => {
                          setSelectedCustomer("");
                          setCustomerComboOpen(false);
                        }}
                      >
                        <span className="text-muted-foreground">Sin cliente</span>
                        <Check
                          className={cn(
                            "ml-auto size-4 shrink-0",
                            !selectedCustomer ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </button>
                    </li>
                    {filteredCustomers.map((c) => (
                      <li key={c.id} role="none">
                        <button
                          type="button"
                          role="option"
                          className={listRowCn}
                          onClick={() => {
                            setSelectedCustomer(String(c.id));
                            setCustomerComboOpen(false);
                          }}
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {c.name} · {c.phone}
                          </span>
                          <Check
                            className={cn(
                              "ml-auto size-4 shrink-0",
                              selectedCustomer === String(c.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </PosSearchDropdown>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                onClick={() => setAddCustomerOpen(true)}
                aria-label="Agregar nuevo cliente"
                title="Nuevo cliente"
              >
                <UserPlus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="pos-product-trigger"
              className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              Agregar producto
            </Label>
              <div ref={productTriggerRef} className="w-full">
                <Button
                  id="pos-product-trigger"
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={productComboOpen}
                  aria-haspopup="listbox"
                  className="h-9 w-full justify-between px-3 font-normal"
                  onClick={() => {
                    setCustomerComboOpen(false);
                    setProductComboOpen((o) => !o);
                  }}
                >
                  <span className="truncate text-muted-foreground">
                    Buscar producto en catálogo…
                  </span>
                  <ChevronsUpDown className="ml-1 size-4 shrink-0 opacity-45" aria-hidden />
                </Button>
              </div>
              <PosSearchDropdown
                open={productComboOpen}
                onOpenChange={setProductComboOpen}
                triggerRef={productTriggerRef}
                searchId="pos-product-search"
                searchPlaceholder="Nombre, SKU, precio o stock…"
                searchValue={productSearch}
                onSearchChange={setProductSearch}
              >
                {filteredProducts.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Sin coincidencias.
                  </p>
                ) : (
                  <ul className="space-y-0.5" role="none">
                    {filteredProducts.map((product) => {
                      const sku = String(product.id).padStart(6, "0");
                      return (
                        <li key={product.id} role="none">
                          <button
                            type="button"
                            role="option"
                            className={cn(listRowCn, "flex-col items-stretch gap-0.5 py-2")}
                            onClick={() => {
                              addToCart(product);
                              setProductComboOpen(false);
                            }}
                          >
                            <span className="truncate font-medium leading-tight">{product.name}</span>
                            <span className="text-muted-foreground text-xs tabular-nums">
                              SKU {sku} · {moneyFmt.format(product.price)} · Stock {product.stock}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </PosSearchDropdown>
          </div>

          <Card className="flex flex-col overflow-hidden border-border/80 p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/25 px-3 py-2.5 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <ShoppingCart className="size-[1.125rem] shrink-0 text-muted-foreground" aria-hidden />
              <h2 className="truncate text-sm font-semibold sm:text-base">Carrito</h2>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs tabular-nums">
              {cart.length} ítems
            </Badge>
          </div>
          <div className="overflow-x-auto">
            {cart.length === 0 ? (
              <p className="px-4 py-5 text-center text-sm leading-snug text-muted-foreground">
                Usá el buscador de producto arriba: al elegir una fila se suma al carrito. Podés seguir
                buscando para agregar más.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[7rem] pl-4">Producto</TableHead>
                    <TableHead className="w-[5.5rem]">SKU</TableHead>
                    <TableHead className="w-[8.5rem] text-center">Cant.</TableHead>
                    <TableHead className="w-[6rem] text-right">P. unit.</TableHead>
                    <TableHead className="w-[6.5rem] text-right">Subtotal</TableHead>
                    <TableHead className="w-12 pr-4 text-right">
                      <span className="sr-only">Eliminar</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="max-w-[10rem] pl-4 font-medium">
                        <span className="line-clamp-2">{item.name}</span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {String(item.id).padStart(6, "0")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Menos"
                          >
                            −
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            className="h-8 w-12 border-border px-1 text-center text-sm tabular-nums"
                            value={item.quantity}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (Number.isFinite(v) && v >= 1) updateQuantity(item.id, v);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Más"
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        $ {item.price.toLocaleString("es-AR")}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        $ {(item.price * item.quantity).toLocaleString("es-AR")}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Eliminar línea"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
        </div>

        {/* —— Derecha: resumen / cobro —— */}
        <aside className="flex flex-col gap-0 lg:sticky lg:top-4 lg:z-10 lg:self-start">
          <Card className="flex flex-col overflow-hidden border-border/80 p-0 shadow-sm">
            <div className="shrink-0 border-b border-border/60 bg-muted/30 px-3 py-2 sm:px-3">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold leading-tight">Resumen de pago</h2>
                  <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                    Impuestos, cobro y totales.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Total
                  </p>
                  <p className="text-base font-bold tabular-nums leading-none text-foreground sm:text-lg">
                    {moneyReceipt.format(total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-hidden bg-muted/25 px-1.5 py-1.5 sm:px-2 sm:py-1.5">
              <div
                className={cn(
                  "mx-auto w-full max-w-full border border-[#c8c8c8] bg-[#faf9f7] text-[#111] shadow-sm",
                  "px-2.5 py-2 sm:px-3 sm:py-2.5",
                  "font-mono text-[0.7rem] leading-snug sm:text-[0.75rem]"
                )}
              >
                <p className="mb-1 text-center text-[0.62rem] uppercase tracking-wide text-[#555]">
                  Prototipo · no fiscal
                </p>

                <ReceiptDivider className="my-1.5" />

                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[0.62rem] font-bold uppercase leading-tight text-[#111]">
                    Impuestos rápidos
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7 shrink-0 border-[#d4d2ce] bg-white/90 text-[#111] shadow-none hover:bg-white"
                    onClick={addTaxRow}
                    title="Impuesto manual (nombre y porcentaje)"
                    aria-label="Agregar otro impuesto"
                  >
                    <Plus className="size-3.5" strokeWidth={2.25} aria-hidden />
                  </Button>
                </div>
                <div className="mb-1.5 grid grid-cols-2 gap-1.5">
                  {TAX_PRESETS.map((preset) => {
                    const on = taxDrafts.some((t) => t.id === preset.id);
                    return (
                      <label
                        key={preset.id}
                        className="flex cursor-pointer items-center gap-1.5 rounded border border-[#d4d2ce] bg-white/90 px-1.5 py-1 text-[0.65rem]"
                      >
                        <Checkbox
                          checked={on}
                          onCheckedChange={() => toggleTaxPreset(preset)}
                          aria-label={preset.label}
                        />
                        <span className="leading-tight">{preset.label}</span>
                      </label>
                    );
                  })}
                </div>

                {taxDrafts.some((t) => !isPresetTaxId(t.id)) ? (
                  <div className="mb-2 space-y-1 border-t border-dashed border-[#ccc] pt-1.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-wide text-[#555]">
                      Otros impuestos
                    </p>
                    {taxDrafts
                      .filter((t) => !isPresetTaxId(t.id))
                      .map((row) => (
                        <div
                          key={row.id}
                          className="flex flex-wrap items-end gap-1 rounded border border-[#e8e6e3] bg-white/95 p-1"
                        >
                          <div className="min-w-[6rem] flex-1">
                            <Label className="text-[0.58rem] uppercase text-[#555]">Nombre</Label>
                            <Input
                              value={row.label}
                              onChange={(e) =>
                                setTaxDrafts((prev) =>
                                  prev.map((t) =>
                                    t.id === row.id ? { ...t, label: e.target.value } : t
                                  )
                                )
                              }
                              className={posFieldCn("h-7 w-full")}
                            />
                          </div>
                          <div className="w-12 shrink-0 sm:w-14">
                            <Label className="text-[0.58rem] uppercase text-[#555]">%</Label>
                            <Input
                              inputMode="decimal"
                              value={row.rate}
                              onChange={(e) =>
                                setTaxDrafts((prev) =>
                                  prev.map((t) =>
                                    t.id === row.id ? { ...t, rate: e.target.value } : t
                                  )
                                )
                              }
                              className={posFieldCn("h-7 w-full")}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0 text-red-600"
                            onClick={() => removeTaxRow(row.id)}
                            aria-label="Quitar impuesto manual"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : null}

                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-[0.62rem] font-bold uppercase leading-tight text-[#111]">
                    Medios de pago
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7 shrink-0 border-[#d4d2ce] bg-white/90 text-[#111] shadow-none hover:bg-white"
                    onClick={addPaymentLine}
                    title="Agregar otra forma de cobro"
                    aria-label="Agregar medio de pago"
                  >
                    <Plus className="size-3.5" strokeWidth={2.25} aria-hidden />
                  </Button>
                </div>
                <div className="mb-2 space-y-1 rounded-sm border border-[#d4d2ce] bg-white/95 p-1.5">
                  {paymentLines.map((line) => (
                    <div key={line.id} className="flex items-end gap-1">
                      <div className="min-w-0 flex-1">
                        <Label className="sr-only" htmlFor={`pay-method-${line.id}`}>
                          Medio de pago
                        </Label>
                        <Select
                          value={line.methodKey}
                          onValueChange={(v) =>
                            updatePaymentLine(line.id, { methodKey: v as PaymentMethodKey })
                          }
                        >
                          <SelectTrigger
                            id={`pay-method-${line.id}`}
                            className={cn(posFieldCn("h-8 w-full"), "border-[#c8c8c8]")}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper" className="z-[10000]">
                            {PAYMENT_METHOD_OPTIONS.map((o) => (
                              <SelectItem key={o.key} value={o.key}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-[5.25rem] shrink-0 sm:w-24">
                        <Label className="sr-only" htmlFor={`pay-amt-${line.id}`}>
                          Importe
                        </Label>
                        <Input
                          id={`pay-amt-${line.id}`}
                          inputMode="decimal"
                          placeholder="0"
                          value={line.amount}
                          onChange={(e) =>
                            updatePaymentLine(line.id, { amount: e.target.value })
                          }
                          className={posFieldCn("h-8 w-full")}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-red-600 disabled:opacity-25"
                        disabled={paymentLines.length <= 1}
                        onClick={() => removePaymentLine(line.id)}
                        aria-label="Quitar línea de pago"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 w-full text-[0.62rem]"
                    disabled={remainder <= 0 || Math.abs(remainder) < PAY_TOLERANCE}
                    onClick={applyRemainderToEfectivo}
                  >
                    Completar con efectivo
                  </Button>
                </div>

                <ReceiptRow label="Subtotal" value={moneyReceipt.format(subtotal)} />
                <div className="mt-2 space-y-1">
                  <Label htmlFor="pos-discount" className="text-[0.65rem] font-bold uppercase text-[#333]">
                    Descuento (%)
                  </Label>
                  <Input
                    id="pos-discount"
                    type="number"
                    inputMode="decimal"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className={posFieldCn("h-8 w-full")}
                    min={0}
                    max={100}
                  />
                </div>
                {discountAmount > 0 ? (
                  <ReceiptRow
                    label={`Descuento (${discountPct}%)`}
                    value={`− ${moneyReceipt.format(discountAmount)}`}
                    valueClassName="text-green-800"
                  />
                ) : null}
                <ReceiptRow label="Base imponible" value={moneyReceipt.format(taxableBase)} />
                {taxLines.map((t) => (
                  <ReceiptRow
                    key={t.id}
                    label={`${t.label.toUpperCase()} (${t.ratePercent}%)`}
                    value={moneyReceipt.format(t.amount)}
                  />
                ))}
                {taxesTotal > 0 ? (
                  <ReceiptRow label="Impuestos (suma)" value={moneyReceipt.format(taxesTotal)} />
                ) : null}
                <div className="mt-1.5 flex justify-between border-t-2 border-[#111] pt-1.5 text-[0.78rem] font-extrabold uppercase sm:text-[0.82rem]">
                  <span>Total</span>
                  <span className="tabular-nums">{moneyReceipt.format(total)}</span>
                </div>

                <div
                  className={cn(
                    "mt-2 flex justify-between border border-dashed border-[#333] px-1.5 py-1.5 text-[0.65rem] font-semibold",
                    Math.abs(remainder) < PAY_TOLERANCE
                      ? "bg-[#ecfdf5] text-[#065f46]"
                      : remainder > 0
                        ? "bg-[#fffbeb] text-[#78350f]"
                        : "bg-[#fef2f2] text-[#991b1b]"
                  )}
                >
                  <span className="uppercase">
                    {Math.abs(remainder) < PAY_TOLERANCE
                      ? "Pagos OK"
                      : remainder > 0
                        ? "Falta"
                        : "Excedente"}
                  </span>
                  <span className="tabular-nums">
                    {remainder > 0 ? "+" : ""}
                    {moneyReceipt.format(remainder)}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-2 border-t border-border/60 bg-card p-2.5 sm:p-3">
              <Button
                type="button"
                className="h-10 w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                size="lg"
                onClick={handleProcessSale}
                disabled={cart.length === 0}
              >
                Procesar venta
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handlePreviewDraft}>
                Previsualizar factura
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      <Dialog
        open={addCustomerOpen}
        onOpenChange={(open) => {
          setAddCustomerOpen(open);
          if (!open) {
            setNewCustomerName("");
            setNewCustomerPhone("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>
              Se guarda en esta sesión de venta y queda seleccionado para cobrar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="new-cust-name">Nombre</Label>
              <Input
                id="new-cust-name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-cust-phone">Teléfono</Label>
              <Input
                id="new-cust-phone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                placeholder="+54 11 …"
                autoComplete="tel"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddCustomerOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={submitNewCustomer}>
              Guardar y seleccionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
