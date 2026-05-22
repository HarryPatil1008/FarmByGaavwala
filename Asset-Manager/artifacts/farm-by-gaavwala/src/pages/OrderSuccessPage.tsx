import { useSearch, Link } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OrderSuccessPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = parseInt(params.get("id") ?? "0");
  const { isAuthenticated } = useAuth();

  const { data: order } = useGetOrder(orderId, { query: { queryKey: getGetOrderQueryKey(orderId), enabled: isAuthenticated && orderId > 0 } });

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-green-700 mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. We'll start preparing your fresh farm products right away!
        </p>

        {order && (
          <div className="bg-amber-50 rounded-xl p-4 text-left mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize text-green-600">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Items</p>
              {order.items.map((item) => (
                <div key={item.id} className="text-sm flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button asChild><Link href="/orders">View My Orders</Link></Button>
          <Button variant="outline" asChild><Link href="/">Continue Shopping</Link></Button>
        </div>
      </div>
    </div>
  );
}
