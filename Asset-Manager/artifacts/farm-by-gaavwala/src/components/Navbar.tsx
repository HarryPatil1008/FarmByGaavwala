import { useState, useEffect } from "react";
import { Menu, X, Leaf, ShoppingCart, Heart, User2, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: isAuthenticated } });
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group" data-testid="navbar-logo">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${scrolled ? "bg-primary" : "bg-white/20 border border-white/40"}`}>
              <Leaf className={`w-5 h-5 transition-colors ${scrolled ? "text-primary-foreground" : "text-white"}`} />
            </div>
            <div>
              <span className={`font-serif text-lg font-bold leading-none block transition-colors ${scrolled ? "text-primary" : "text-white"}`}>
                Farm By
              </span>
              <span className={`font-serif text-xs font-medium tracking-widest uppercase transition-colors ${scrolled ? "text-secondary" : "text-amber-200"}`}>
                Gaavwala
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8" data-testid="navbar-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                  scrolled ? "text-foreground" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${scrolled ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-white/20 text-white hover:bg-white/30"}`}>
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </Link>
                )}
                <Link href="/wishlist" className={`p-2 rounded-full transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}>
                  <Heart className="w-5 h-5" />
                </Link>
                <Link href="/cart" className={`relative p-2 rounded-full transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${scrolled ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-primary hover:bg-amber-50"}`}>
                  <User2 className="w-3.5 h-3.5" />
                  {user?.name?.split(" ")[0]}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className={`hidden md:inline-flex px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white/90 hover:bg-white/10"}`}>
                  Sign In
                </Link>
                <Link href="/signup" data-testid="navbar-shop-now" className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${scrolled ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white text-primary hover:bg-amber-50"}`}>
                  Get Started
                </Link>
              </>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="navbar-mobile-toggle"
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-lg" data-testid="navbar-mobile-menu">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                className="text-foreground font-medium py-2 border-b border-border/50 last:border-0"
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 font-medium">
                  <ShoppingCart className="w-4 h-4" /> Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 font-medium">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 font-medium">
                  Orders
                </Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 font-medium">
                  <User2 className="w-4 h-4" /> Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 font-medium text-amber-700">
                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); navigate("/"); }} className="text-left text-red-600 py-2 font-medium">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center py-2 border rounded-full font-medium">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="bg-primary text-primary-foreground text-center py-3 rounded-full font-semibold text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
