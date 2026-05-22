import { motion } from "framer-motion";
import { Star, ShoppingCart, Tag, Heart, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  useListProducts,
  getListProductsQueryKey,
  useAddCartItem,
  getGetCartQueryKey,
  useGetWishlist,
  getGetWishlistQueryKey,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const GRADIENTS = [
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-500",
  "from-amber-500 to-yellow-600",
  "from-yellow-500 to-green-500",
  "from-amber-300 to-yellow-400",
  "from-green-400 to-emerald-600",
  "from-teal-400 to-cyan-500",
  "from-purple-400 to-indigo-500",
  "from-pink-400 to-rose-500",
  "from-lime-400 to-green-500",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function FeaturedProducts() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [addingCart, setAddingCart] = useState<number | null>(null);
  const [buyingNow, setBuyingNow] = useState<number | null>(null);

  const { data, isLoading } = useListProducts(
    { limit: 6, featured: true },
    { query: { queryKey: getListProductsQueryKey({ limit: 6, featured: true }) } },
  );

  const { data: wishlist } = useGetWishlist({
    query: { queryKey: getGetWishlistQueryKey(), enabled: isAuthenticated },
  });

  const wishlistIds = new Set((wishlist ?? []).map((w) => w.productId));

  const addCartItem = useAddCartItem({
    mutation: {
      onSuccess() {
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
      },
    },
  });

  const addWishlist = useAddToWishlist({
    mutation: { onSuccess() { qc.invalidateQueries({ queryKey: getGetWishlistQueryKey() }); } },
  });
  const removeWishlist = useRemoveFromWishlist({
    mutation: { onSuccess() { qc.invalidateQueries({ queryKey: getGetWishlistQueryKey() }); } },
  });

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      toast({ title: "Please sign in", description: "Sign in to continue", variant: "destructive" });
      navigate("/login");
      return;
    }
    action();
  }

  async function handleAddToCart(productId: number) {
    requireAuth(async () => {
      setAddingCart(productId);
      try {
        await addCartItem.mutateAsync({ data: { productId, quantity: 1 } });
        toast({ title: "Added to cart 🛒", description: "Item added successfully" });
      } finally {
        setAddingCart(null);
      }
    });
  }

  async function handleBuyNow(productId: number) {
    requireAuth(async () => {
      setBuyingNow(productId);
      try {
        await addCartItem.mutateAsync({ data: { productId, quantity: 1 } });
        navigate("/checkout");
      } finally {
        setBuyingNow(null);
      }
    });
  }

  function toggleWishlist(productId: number) {
    requireAuth(() => {
      if (wishlistIds.has(productId)) {
        removeWishlist.mutate({ productId });
      } else {
        addWishlist.mutate({ data: { productId } });
      }
    });
  }

  const products = data?.products ?? [];

  return (
    <section
      id="products"
      data-testid="products-section"
      className="section-pad"
      style={{ background: "linear-gradient(180deg, hsl(42,35%,97%) 0%, hsl(152,20%,94%) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
            Handpicked for You
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our most-loved products — tried, tasted, and trusted by families across India.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-3xl border border-card-border shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
            {products.map((product, idx) => {
              const gradient = GRADIENTS[idx % GRADIENTS.length];
              const isWishlisted = wishlistIds.has(product.id);
              const isAddingThis = addingCart === product.id;
              const isBuyingThis = buyingNow === product.id;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group bg-card rounded-3xl border border-card-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover absolute inset-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : null}

                    {product.discount != null && product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                        <Tag className="w-3 h-3" />
                        {product.discount}% OFF
                      </div>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-200 ${
                        isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>

                    {product.badge && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                        {product.badge}
                      </div>
                    )}

                    {!product.images?.[0] && (
                      <span className="text-7xl select-none drop-shadow-lg relative z-0" style={{ fontSize: "4.5rem" }}>
                        {product.emoji ?? "🌿"}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-foreground text-base leading-tight mb-0.5">{product.name}</h3>
                    {product.description && (
                      <p className="text-muted-foreground text-xs mb-2 line-clamp-1">{product.description}</p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={product.rating} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through ml-2">₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.stock <= 10 && product.stock > 0 && (
                        <span className="text-xs text-orange-500 font-medium">Only {product.stock} left!</span>
                      )}
                      {product.stock === 0 && (
                        <span className="text-xs text-red-500 font-medium">Out of stock</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0 || isAddingThis}
                        data-testid={`add-to-cart-${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        {isAddingThis ? "Adding…" : "Add"}
                      </button>
                      <button
                        onClick={() => handleBuyNow(product.id)}
                        disabled={product.stock === 0 || isBuyingThis}
                        data-testid={`buy-now-${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBuyingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        {isBuyingThis ? "…" : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <motion.a
            href="#contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            data-testid="view-all-products"
          >
            View All Products
          </motion.a>
        </div>
      </div>
    </section>
  );
}
