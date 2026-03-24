import { useState } from "react";
import { Search, Plus, Trash2, ShoppingCart, SearchX } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "../components/feedback/PageStates";
import { useMockRemoteData } from "../hooks/useMockRemoteData";
import { appToast } from "../lib/appToast";
import { paymentMethodLabel } from "./paymentLabels";
import { useSalesHistory } from "./SalesHistoryContext";
import type { SaleRecord } from "./sales.types";

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

type SalesPosTabProps = {
  onSaleComplete: (sale: SaleRecord) => void;
};

export function SalesPosTab({ onSaleComplete }: SalesPosTabProps) {
  const { registerSale } = useSalesHistory();
  const remote = useMockRemoteData(loadPosCatalog, { delayMs: 400 });
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("");

  const products = remote.status === "success" ? remote.data.products : [];
  const customers = remote.status === "success" ? remote.data.customers : [];

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
    setSearchProduct("");
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
  const total = subtotal - discountAmount;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleProcessSale = () => {
    if (cart.length === 0) {
      appToast.warning("Falta armar el pedido", {
        description:
          "Agregá al menos un producto al carrito antes de confirmar la venta.",
      });
      return;
    }
    if (!selectedCustomer) {
      appToast.warning("Elegí un cliente", {
        description:
          "Seleccioná quién hace el pedido en la lista (equivalente a un pedido por WhatsApp).",
      });
      return;
    }
    if (!paymentMethod) {
      appToast.warning("Falta el método de pago", {
        description:
          "Indicá cómo se cobra: efectivo, tarjeta, transferencia u otra opción.",
      });
      return;
    }

    const customer = customers.find((c) => c.id.toString() === selectedCustomer);
    if (!customer) return;

    const sale = registerSale({
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
      total,
      paymentMethod,
      paymentMethodLabel: paymentMethodLabel(paymentMethod),
    });

    appToast.success("Venta registrada", {
      description: `Recibo N.º ${sale.receiptNumber} · Total ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}.`,
      duration: 4000,
    });

    setCart([]);
    setSelectedCustomer("");
    setDiscount("0");
    setPaymentMethod("");
    onSaleComplete(sale);
  };

  if (remote.status === "loading") {
    return (
      <Card className="p-6">
        <LoadingState
          title="Cargando catálogo y clientes…"
          description="Preparando productos y lista de clientes para tomar el pedido."
        />
      </Card>
    );
  }

  if (remote.status === "error") {
    return (
      <Card className="p-6">
        <ErrorState
          title="No se pudo cargar el punto de venta"
          description={remote.error}
          onRetry={remote.retry}
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="p-4 sm:p-6">
          <Label htmlFor="pos-customer" className="mb-3 block text-base font-semibold">
            Seleccionar Cliente
          </Label>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger id="pos-customer" className="w-full">
              <SelectValue placeholder="Buscar o seleccionar cliente..." />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name} — {customer.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4 sm:p-6">
          <Label htmlFor="pos-product-search" className="mb-3 block text-base font-semibold">
            Agregar Productos
          </Label>
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <Input
              id="pos-product-search"
              placeholder="Buscar producto por nombre..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="pl-10"
              autoComplete="off"
            />
          </div>

          {searchProduct.trim() !== "" && filteredProducts.length === 0 ? (
            <EmptyState
              title="No hay productos con ese nombre"
              description="Probá otra palabra o revisá la ortografía. También podés borrar la búsqueda para ver todo el catálogo al tipear de nuevo."
              icon={SearchX}
              className="py-8"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSearchProduct("")}
              >
                Limpiar búsqueda
              </Button>
            </EmptyState>
          ) : null}

          {searchProduct && filteredProducts.length > 0 ? (
            <ul
              className="max-h-64 divide-y overflow-y-auto rounded-lg border"
              role="listbox"
              aria-label="Resultados de búsqueda de productos"
            >
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                    onClick={() => addToCart(product)}
                    aria-label={`Agregar ${product.name} al carrito, precio ${product.price} pesos, stock ${product.stock}`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        $ {product.price} · Stock: {product.stock}
                      </p>
                    </div>
                    <Plus className="size-5 shrink-0 text-blue-600" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <ShoppingCart className="size-5 text-gray-700" aria-hidden />
            <h2 className="text-lg font-semibold">Carrito de Compra</h2>
            <Badge variant="secondary" className="ml-auto">
              {cart.length} productos
            </Badge>
          </div>

          {cart.length === 0 ? (
            <EmptyState
              title="El carrito está vacío"
              description="Buscá productos arriba y tocá un ítem para sumarlo al pedido, como en un mensaje de WhatsApp."
              icon={ShoppingCart}
              className="py-10"
            />
          ) : (
            <ul className="space-y-3" aria-label="Productos en el carrito">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">$ {item.price}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Disminuir cantidad de ${item.name}`}
                      >
                        <span aria-hidden>−</span>
                      </Button>
                      <span className="min-w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        <span aria-hidden>+</span>
                      </Button>
                    </div>
                    <p className="font-semibold sm:w-24 sm:text-right">
                      $ {(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 text-red-600"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start">
        <Card className="p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Resumen de Pago</h2>

          <div className="mb-6 space-y-3">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium tabular-nums">
                $ {subtotal.toLocaleString("es-AR")}
              </span>
            </div>

            <div>
              <Label htmlFor="pos-discount" className="mb-2 block text-sm">
                Descuento (%)
              </Label>
              <Input
                id="pos-discount"
                type="number"
                inputMode="decimal"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                min={0}
                max={100}
              />
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between gap-4 text-green-600">
                <span>Descuento:</span>
                <span className="tabular-nums">
                  - $ {discountAmount.toLocaleString("es-AR")}
                </span>
              </div>
            )}

            <div className="flex justify-between gap-4 border-t pt-3 text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-blue-600 tabular-nums">
                $ {total.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="pos-payment" className="mb-2 block text-sm">
              Método de Pago
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="pos-payment" className="w-full">
                <SelectValue placeholder="Seleccionar método..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="whatsapp">Pago por WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            className="w-full min-h-11"
            size="lg"
            onClick={handleProcessSale}
            disabled={cart.length === 0}
          >
            Procesar Venta
          </Button>
        </Card>
      </div>
    </div>
  );
}
