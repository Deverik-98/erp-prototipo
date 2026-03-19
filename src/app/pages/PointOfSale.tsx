import { useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Trash2, ShoppingCart } from "lucide-react";
import { PageHeader, PageShell } from "../components/PageShell";
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

const customers = [
  { id: 1, name: "María García", phone: "+54 11 1234-5678" },
  { id: 2, name: "Carlos López", phone: "+54 11 5678-9012" },
  { id: 3, name: "Ana Martínez", phone: "+54 11 9012-3456" },
];

const products = [
  { id: 1, name: "Leche Entera 1L", price: 65, stock: 150 },
  { id: 2, name: "Queso Fresco 500g", price: 120, stock: 45 },
  { id: 3, name: "Yogurt Natural 1L", price: 40, stock: 200 },
  { id: 4, name: "Mantequilla 250g", price: 75, stock: 80 },
  { id: 5, name: "Queso Mozzarella 1kg", price: 190, stock: 25 },
  { id: 6, name: "Crema de Leche 500ml", price: 55, stock: 120 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export function PointOfSale() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("");

  const addToCart = (product: (typeof products)[0]) => {
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
  const discountAmount = (subtotal * parseFloat(discount || "0")) / 100;
  const total = subtotal - discountAmount;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleProcessSale = () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    if (!selectedCustomer) {
      toast.error("Por favor selecciona un cliente");
      return;
    }
    if (!paymentMethod) {
      toast.error("Por favor selecciona un método de pago");
      return;
    }

    toast.success(
      `Venta procesada exitosamente por $ ${total.toLocaleString("es-AR")}`,
      { duration: 4000 }
    );
    setCart([]);
    setSelectedCustomer("");
    setDiscount("0");
    setPaymentMethod("");
  };

  return (
    <PageShell>
      <PageHeader
        title="Punto de Venta"
        description="Registra pedidos entrantes de WhatsApp"
      />

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

            {searchProduct && filteredProducts.length > 0 && (
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
            )}
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
              <div className="py-12 text-center text-gray-500">
                <ShoppingCart className="mx-auto mb-3 size-12 text-gray-300" aria-hidden />
                <p>El carrito está vacío</p>
                <p className="mt-1 text-sm">
                  Busca y agrega productos para comenzar
                </p>
              </div>
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
    </PageShell>
  );
}
