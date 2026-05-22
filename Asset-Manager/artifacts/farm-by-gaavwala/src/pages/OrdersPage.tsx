import { Link, useLocation } from "wouter";
import { useListOrders, useCancelOrder } from "@workspace/api-client-react";
import { getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: orders, isLoading } = useListOrders({ query: { queryKey: getListOrdersQueryKey(), enabled: isAuthenticated } });

  const cancelOrder = useCancelOrder({
    mutation: {
      onSuccess() {
        qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Order cancelled" });
      },
      onError() {
        toast({ title: "Cannot cancel order", variant: "destructive" });
      },
    },
  });

  if (!isAuthenticated) { navigate("/login"); return null; }
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const sortedOrders = [...(orders ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-serif font-bold">My Orders</h1>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button asChild><Link href="/">Shop Now</Link></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm flex justify-between">
                      <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="font-bold">₹{order.total}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"} · {order.paymentStatus}</p>
                  </div>
                  {["pending", "confirmed"].includes(order.status) && (
                    <Button variant="outline" size="sm" onClick={() => cancelOrder.mutate({ id: order.id })} className="text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
