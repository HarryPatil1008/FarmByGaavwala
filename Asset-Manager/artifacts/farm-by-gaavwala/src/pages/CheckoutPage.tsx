import { useState } from "react";
import { useLocation } from "wouter";
import { useGetCart, useCreateOrder } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: isAuthenticated } });

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess(order) {
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
        navigate(`/order-success?id=${order.id}`);
      },
      onError() {
        toast({ title: "Order failed", description: "Could not place order. Please try again.", variant: "destructive" });
      },
    },
  });

  if (!isAuthenticated) { navigate("/login"); return null; }
  if (!cart || cart.items.length === 0) { navigate("/cart"); return null; }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast({ title: "Missing fields", description: "Please fill all required address fields", variant: "destructive" });
      return;
    }
    createOrder.mutate({
      data: {
        shippingAddress: { name: form.name, phone: form.phone, line1: form.line1, line2: form.line2 || null, city: form.city, state: form.state, pincode: form.pincode },
        paymentMethod,
      },
    });
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/cart")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-serif font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Full Name *</Label>
                    <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ramesh Kumar" required />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Phone *</Label>
                    <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" required />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Address Line 1 *</Label>
                    <Input value={form.line1} onChange={(e) => update("line1", e.target.value)} placeholder="House no., Street name" required />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Address Line 2</Label>
                    <Input value={form.line2} onChange={(e) => update("line2", e.target.value)} placeholder="Landmark, Area (optional)" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City *</Label>
                    <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Mumbai" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>State *</Label>
                    <Input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Maharashtra" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Pincode *</Label>
                    <Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="400001" required maxLength={6} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-amber-50" : "border-border"}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-primary" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "border-primary bg-amber-50" : "border-border"}`}>
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} className="accent-primary" />
                    <div>
                      <p className="font-medium">Online Payment (Razorpay)</p>
                      <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate mr-2">{item.product?.emoji} {item.product?.name} ×{item.quantity}</span>
                    <span>₹{(item.product?.price ?? 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-1">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{cart.total}</span></div>
                <div className="flex justify-between text-sm text-green-600"><span>Delivery</span><span>Free</span></div>
                <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>₹{cart.total}</span></div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={createOrder.isPending}>
                {createOrder.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Placing Order…</> : `Place Order · ₹${cart.total}`}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">Free delivery on all orders 🌿</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
