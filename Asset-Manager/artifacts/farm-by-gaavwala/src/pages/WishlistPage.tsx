import { Link, useLocation } from "wouter";
import { useGetWishlist, useRemoveFromWishlist, useAddCartItem } from "@workspace/api-client-react";
import { getGetWishlistQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function WishlistPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: wishlist, isLoading } = useGetWishlist({ query: { queryKey: getGetWishlistQueryKey(), enabled: isAuthenticated } });

  const removeItem = useRemoveFromWishlist({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetWishlistQueryKey() }) } });
  const addToCart = useAddCartItem({
    mutation: {
      onSuccess() {
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({ title: "Added to cart!" });
      },
    },
  });

  if (!isAuthenticated) { navigate("/login"); return null; }
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-serif font-bold">My Wishlist</h1>
          <span className="text-muted-foreground">({wishlist?.length ?? 0} items)</span>
        </div>

        {!wishlist?.length ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save your favourite products here</p>
            <Button asChild><Link href="/">Explore Products</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-36 bg-amber-100 flex items-center justify-center text-5xl">
                  {item.product?.emoji ?? "🌿"}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.product?.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-bold text-primary">₹{item.product?.price}</span>
                    {item.product?.originalPrice && <span className="text-xs text-muted-foreground line-through">₹{item.product.originalPrice}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => addToCart.mutate({ data: { productId: item.productId, quantity: 1 } })}>
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => removeItem.mutate({ productId: item.productId })}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
