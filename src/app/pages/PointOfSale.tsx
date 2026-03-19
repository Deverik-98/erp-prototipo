import { useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Trash2, ShoppingCart } from "lucide-react";
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

  const addToCart = (product: typeof products[0]) => {
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
        { id: product.id, name: product.name, price: product.price, quantity: 1 },
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>
        <p className="text-gray-500 mt-2">
          Registra pedidos entrantes de WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-3 block">
              Seleccionar Cliente
            </Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Buscar o seleccionar cliente..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Product Search */}
          <Card className="p-6">
            <Label className="text-base font-semibold mb-3 block">
              Agregar Productos
            </Label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar producto por nombre..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchProduct && filteredProducts.length > 0 && (
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => addToCart(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        $ {product.price} · Stock: {product.stock}
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Cart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold">Carrito de Compra</h3>
              <Badge variant="secondary" className="ml-auto">
                {cart.length} productos
              </Badge>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm mt-1">
                  Busca y agrega productos para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">$ {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <p className="font-semibold w-20 text-right">
                      $ {(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Section - Payment Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resumen de Pago</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">$ {subtotal.toLocaleString("es-AR")}</span>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Descuento (%)</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>- $ {discountAmount.toLocaleString("es-AR")}</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-blue-600">
                  $ {total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-sm mb-2 block">Método de Pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
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
              className="w-full"
              size="lg"
              onClick={handleProcessSale}
              disabled={cart.length === 0}
            >
              Procesar Venta
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
