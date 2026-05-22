import { Link, useLocation } from "wouter";
import { useGetCart, useAddCartItem, useUpdateCartItem, useRemoveCartItem, useClearCart } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();

  const { data: cart, isLoading } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: isAuthenticated } });

  const updateItem = useUpdateCartItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetCartQueryKey() }) } });
  const removeItem = useRemoveCartItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetCartQueryKey() }) } });
  const clearCart = useClearCart({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetCartQueryKey() }) } });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view your cart</h2>
          <Button asChild className="mt-4"><Link href="/login">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const items = cart?.items ?? [];

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-serif font-bold">Your Cart</h1>
          <span className="text-muted-foreground">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some fresh farm products!</p>
            <Button asChild><Link href="/">Shop Now</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center text-3xl shrink-0">
                    {item.product?.emoji ?? "🌿"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.product?.name ?? "Product"}</h3>
                    <p className="text-primary font-semibold">₹{item.product?.price ?? 0}</p>
                    {item.product?.badge && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{item.product.badge}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => item.quantity > 1 ? updateItem.mutate({ id: item.id, data: { quantity: item.quantity - 1 } }) : removeItem.mutate({ id: item.id })} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateItem.mutate({ id: item.id, data: { quantity: item.quantity + 1 } })} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-semibold w-16 text-right">₹{(item.product?.price ?? 0) * item.quantity}</p>
                  <button onClick={() => removeItem.mutate({ id: item.id })} className="text-red-400 hover:text-red-600 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => clearCart.mutate()} className="text-sm text-red-500 hover:underline">Clear cart</button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate mr-2">{item.product?.name} × {item.quantity}</span>
                    <span>₹{(item.product?.price ?? 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{cart?.total ?? 0}</span>
              </div>
              <Button className="w-full mt-4" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
