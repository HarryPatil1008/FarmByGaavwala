import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User2, Mail, Phone, ShieldCheck, ShoppingBag, Heart } from "lucide-react";
import { Link } from "wouter";

export default function ProfilePage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) { navigate("/login"); return null; }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-serif font-bold">My Profile</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              {user?.role === "admin" && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link href="/orders" className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">My Orders</span>
          </Link>
          <Link href="/wishlist" className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Wishlist</span>
          </Link>
        </div>

        {user?.role === "admin" && (
          <Link href="/admin" className="block bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-center hover:bg-amber-100 transition-colors">
            <ShieldCheck className="w-5 h-5 text-amber-700 mx-auto mb-1" />
            <span className="text-sm font-medium text-amber-800">Admin Panel</span>
          </Link>
        )}

        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
