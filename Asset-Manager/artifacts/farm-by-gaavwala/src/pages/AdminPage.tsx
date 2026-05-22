import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart2,
  Settings, LogOut, Menu, X, Search, Filter, Plus, Pencil, Trash2,
  Check, AlertTriangle, Shield, Ban, TrendingUp, TrendingDown,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "inventory", label: "Inventory", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-400",
  confirmed: "bg-blue-900/50 text-blue-400",
  processing: "bg-purple-900/50 text-purple-400",
  shipped: "bg-indigo-900/50 text-indigo-400",
  delivered: "bg-green-900/50 text-green-400",
  cancelled: "bg-red-900/50 text-red-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[status] ?? "bg-gray-700 text-gray-400"}`}>
      {status}
    </span>
  );
}

function apiHeaders() {
  const token = localStorage.getItem("farm_token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

type Product = { id: number; name: string; slug: string; price: number; stock: number; featured: boolean | null; images?: string[] | null; emoji?: string | null; description?: string | null; badge?: string | null; originalPrice?: number | null; rating: number; reviewCount: number; discount?: number | null };
type Order = { id: number; userId: number; status: string; total: number; paymentMethod: string; paymentStatus: string; createdAt: string; shippingAddress?: Record<string, string> | null; items?: { id: number; name: string; quantity: number; price: number }[] };
type Customer = { id: number; name: string; email: string; phone?: string | null; role: string; blocked: boolean; createdAt: string; orderCount?: number; totalSpent?: number };
type Category = { id: number; name: string; slug: string; emoji?: string | null; description?: string | null; productCount?: number };

const REVENUE_DATA = [
  { month: "Jan", revenue: 42000 }, { month: "Feb", revenue: 58000 }, { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 73000 }, { month: "May", revenue: 68000 }, { month: "Jun", revenue: 89000 },
  { month: "Jul", revenue: 95000 }, { month: "Aug", revenue: 82000 }, { month: "Sep", revenue: 110000 },
  { month: "Oct", revenue: 124000 }, { month: "Nov", revenue: 148000 }, { month: "Dec", revenue: 162000 },
];

const ORDER_DATA = [
  { day: "Mon", orders: 12 }, { day: "Tue", orders: 18 }, { day: "Wed", orders: 15 },
  { day: "Thu", orders: 22 }, { day: "Fri", orders: 29 }, { day: "Sat", orders: 35 }, { day: "Sun", orders: 19 },
];

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState({ products: true, orders: true, customers: true, categories: true, inventory: true });

  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<Partial<Product>>({});
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<Partial<Category>>({});
  const [imageUrl, setImageUrl] = useState("");
  const [newProduct, setNewProduct] = useState<Partial<Product & { images?: string[] }>>({});
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!isAdmin) { navigate("/"); return; }
  }, [isAuthenticated, isAdmin, navigate]);

  async function fetchData(resource: string, setter: (d: unknown) => void, key: keyof typeof loading) {
    try {
      const res = await fetch(`/api/${resource}`, { headers: apiHeaders() });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setter(Array.isArray(data) ? data : data[resource] ?? data.orders ?? data.users ?? data);
    } finally {
      setLoading((l) => ({ ...l, [key]: false }));
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    fetchData("admin/products?limit=200", setProducts, "products");
    fetchData("admin/orders?limit=200", setOrders, "orders");
    fetchData("admin/users?limit=200", setCustomers, "customers");
    fetchData("categories", setCategories, "categories");
    fetchData("admin/products?limit=200", setInventory, "inventory");
  }, [isAdmin]);

  const filteredProducts = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase())), [products, productSearch]);
  const filteredOrders = useMemo(() => orders.filter((o) => {
    const matchSearch = orderSearch === "" || String(o.id).includes(orderSearch) || (o.shippingAddress?.name ?? "").toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  }), [orders, orderSearch, orderStatusFilter]);
  const filteredCustomers = useMemo(() => customers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase())), [customers, customerSearch]);

  const dashStats = useMemo(() => ({
    revenue: orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0),
    orders: orders.length,
    customers: customers.length,
    products: products.length,
  }), [orders, customers, products]);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...newProduct, images: imageUrl ? [imageUrl] : [] };
    const res = await fetch("/api/admin/products", { method: "POST", headers: apiHeaders(), body: JSON.stringify(payload) });
    if (res.ok) {
      const p = await res.json();
      setProducts((prev) => [p, ...prev]);
      setNewProduct({});
      setImageUrl("");
      setShowAddProduct(false);
    }
  }

  async function handleUpdateProduct(id: number) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "PUT", headers: apiHeaders(), body: JSON.stringify(editProductData) });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p));
      setEditingProduct(null);
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers: apiHeaders() });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleUpdateOrder(id: number, status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: apiHeaders(), body: JSON.stringify({ status }) });
    if (res.ok) setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  async function handleToggleBlock(id: number, blocked: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, { method: "PUT", headers: apiHeaders(), body: JSON.stringify({ blocked: !blocked }) });
    if (res.ok) setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, blocked: !blocked } : c));
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/categories", { method: "POST", headers: apiHeaders(), body: JSON.stringify(newCategory) });
    if (res.ok) {
      const cat = await res.json();
      setCategories((prev) => [...prev, cat]);
      setNewCategory({});
      setShowAddCategory(false);
    }
  }

  async function handleUpdateCategory(id: number) {
    const res = await fetch(`/api/categories/${id}`, { method: "PUT", headers: apiHeaders(), body: JSON.stringify(editCategoryData) });
    if (res.ok) {
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...updated } : c));
      setEditingCategory(null);
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE", headers: apiHeaders() });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold">F</div>
            <div>
              <p className="font-bold text-white text-sm leading-none">Gaavwala</p>
              <p className="text-amber-400 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-amber-500/20 text-amber-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-gray-800 pt-4">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to Store
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ══════════ DASHBOARD ══════════ */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: `₹${dashStats.revenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-900/20 border-green-900/30", trend: "+12%" },
                  { label: "Total Orders", value: dashStats.orders, icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-900/20 border-blue-900/30", trend: "+8%" },
                  { label: "Customers", value: dashStats.customers, icon: Users, color: "text-purple-400", bg: "bg-purple-900/20 border-purple-900/30", trend: "+24%" },
                  { label: "Products", value: dashStats.products, icon: Package, color: "text-amber-400", bg: "bg-amber-900/20 border-amber-900/30", trend: "Active" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`rounded-xl p-4 border ${stat.bg}`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.trend} this month</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Revenue (2024)</h3>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={REVENUE_DATA}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#rev)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Orders This Week</h3>
                    <TrendingDown className="w-4 h-4 text-blue-400" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ORDER_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8, color: "#fff" }} />
                      <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700">
                  <h3 className="font-semibold text-white">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-gray-400 text-xs uppercase tracking-wide">
                      {["Order", "Customer", "Total", "Status", "Date"].map((h) => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {orders.slice(0, 6).map((o) => (
                        <tr key={o.id} className="hover:bg-gray-750 transition-colors">
                          <td className="px-5 py-3 font-mono text-amber-400">#{o.id}</td>
                          <td className="px-5 py-3 text-gray-300">{o.shippingAddress?.name ?? `User #${o.userId}`}</td>
                          <td className="px-5 py-3 font-medium text-white">₹{o.total}</td>
                          <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ PRODUCTS ══════════ */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Products <span className="text-gray-500 text-base font-normal ml-1">({products.length})</span></h1>
                <button onClick={() => setShowAddProduct(!showAddProduct)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                  {showAddProduct ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
              </div>

              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="bg-gray-800 rounded-xl p-5 border border-gray-700 grid grid-cols-2 gap-3">
                  <h3 className="col-span-2 font-semibold text-white mb-1">New Product</h3>
                  {[
                    { label: "Name *", field: "name", span: 2 }, { label: "Slug *", field: "slug" }, { label: "Emoji", field: "emoji" },
                    { label: "Price (₹) *", field: "price", type: "number" }, { label: "Original Price", field: "originalPrice", type: "number" },
                    { label: "Stock *", field: "stock", type: "number" }, { label: "Badge", field: "badge" },
                  ].map(({ label, field, span, type }) => (
                    <div key={field} className={span === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs text-gray-400 mb-1">{label}</label>
                      <input type={type ?? "text"} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                        value={String((newProduct as Record<string, unknown>)[field] ?? "")}
                        onChange={(e) => setNewProduct((p) => ({ ...p, [field]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value }))}
                        required={["name", "slug", "price", "stock"].includes(field)}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Description</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      value={newProduct.description ?? ""} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                    {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-lg border border-gray-600" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured-new" checked={newProduct.featured ?? false} onChange={(e) => setNewProduct((p) => ({ ...p, featured: e.target.checked }))} className="accent-amber-500" />
                    <label htmlFor="featured-new" className="text-sm text-gray-300">Featured</label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-colors">Create</button>
                  </div>
                </form>
              )}

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-750 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wide">
                    {["", "Product", "Price", "Stock", "Badge", "Featured", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {loading.products ? (
                      Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-700 rounded animate-pulse" /></td></tr>)
                    ) : filteredProducts.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No products found</td></tr>
                    ) : filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3">
                          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover" /> : <span className="text-2xl">{p.emoji ?? "🌿"}</span>}
                        </td>
                        <td className="px-4 py-3">
                          {editingProduct === p.id ? (
                            <input className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-40 border border-gray-600" value={String(editProductData.name ?? p.name)} onChange={(e) => setEditProductData((d) => ({ ...d, name: e.target.value }))} />
                          ) : (
                            <div>
                              <p className="font-medium text-white">{p.name}</p>
                              {p.description && <p className="text-xs text-gray-500 truncate max-w-[180px]">{p.description}</p>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingProduct === p.id ? (
                            <input type="number" className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-20 border border-gray-600" value={String(editProductData.price ?? p.price)} onChange={(e) => setEditProductData((d) => ({ ...d, price: parseInt(e.target.value) || 0 }))} />
                          ) : <span className="text-white font-medium">₹{p.price}</span>}
                        </td>
                        <td className="px-4 py-3">
                          {editingProduct === p.id ? (
                            <input type="number" className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-20 border border-gray-600" value={String(editProductData.stock ?? p.stock)} onChange={(e) => setEditProductData((d) => ({ ...d, stock: parseInt(e.target.value) || 0 }))} />
                          ) : <span className={p.stock < 10 ? "text-red-400 font-medium" : "text-gray-300"}>{p.stock}</span>}
                        </td>
                        <td className="px-4 py-3">{p.badge && <span className="bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded-full text-xs">{p.badge}</span>}</td>
                        <td className="px-4 py-3">{p.featured ? <span className="text-green-400 text-xs font-bold">● Featured</span> : <span className="text-gray-600 text-xs">—</span>}</td>
                        <td className="px-4 py-3">
                          {editingProduct === p.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleUpdateProduct(p.id)} className="p-1.5 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors"><Check className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setEditingProduct(null)} className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <button onClick={() => { setEditingProduct(p.id); setEditProductData({ name: p.name, price: p.price, stock: p.stock }); }} className="p-1.5 bg-gray-700 hover:bg-blue-700 text-gray-400 hover:text-white rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 bg-gray-700 hover:bg-red-700 text-gray-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ ORDERS ══════════ */}
          {tab === "orders" && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-white">Orders <span className="text-gray-500 text-base font-normal ml-1">({orders.length})</span></h1>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search by order ID or customer…" className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 appearance-none">
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-750 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wide">
                    {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {loading.orders ? (
                      Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-700 rounded animate-pulse" /></td></tr>)
                    ) : filteredOrders.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No orders found</td></tr>
                    ) : filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3 font-mono text-amber-400 font-medium">#{o.id}</td>
                        <td className="px-4 py-3 text-gray-300">{o.shippingAddress?.name ?? `User #${o.userId}`}</td>
                        <td className="px-4 py-3 text-gray-400">{o.items?.length ?? 0} items</td>
                        <td className="px-4 py-3 font-medium text-white">₹{o.total}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${o.paymentStatus === "paid" ? "bg-green-900/50 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                            {o.paymentMethod === "cod" ? "COD" : "Online"} · {o.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <select value={o.status} onChange={(e) => handleUpdateOrder(o.id, e.target.value)} className="text-xs bg-gray-700 border border-gray-600 text-white rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500">
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ CUSTOMERS ══════════ */}
          {tab === "customers" && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-white">Customers <span className="text-gray-500 text-base font-normal ml-1">({customers.length})</span></h1>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="Search by name or email…" className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500" />
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-750 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wide">
                    {["Customer", "Email", "Phone", "Orders", "Spent", "Role", "Joined", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {loading.customers ? (
                      Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-700 rounded animate-pulse" /></td></tr>)
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No customers found</td></tr>
                    ) : filteredCustomers.map((c) => (
                      <tr key={c.id} className={`hover:bg-gray-750 transition-colors ${c.blocked ? "opacity-50" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">{c.name[0]?.toUpperCase()}</div>
                            <span className="font-medium text-white">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{c.email}</td>
                        <td className="px-4 py-3 text-gray-400">{c.phone ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-300">{c.orderCount ?? 0}</td>
                        <td className="px-4 py-3 text-gray-300">₹{(c.totalSpent ?? 0).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${c.role === "admin" ? "bg-amber-900/50 text-amber-400" : "bg-gray-700 text-gray-400"}`}>{c.role}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleToggleBlock(c.id, c.blocked)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${c.blocked ? "bg-green-900/50 text-green-400 hover:bg-green-800" : "bg-red-900/50 text-red-400 hover:bg-red-800"}`}>
                            {c.blocked ? <><Shield className="w-3 h-3" /> Unblock</> : <><Ban className="w-3 h-3" /> Block</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ CATEGORIES ══════════ */}
          {tab === "categories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Categories <span className="text-gray-500 text-base font-normal ml-1">({categories.length})</span></h1>
                <button onClick={() => setShowAddCategory(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              {showAddCategory && (
                <form onSubmit={handleCreateCategory} className="bg-gray-800 rounded-xl p-5 border border-gray-700 grid grid-cols-2 gap-3">
                  <h3 className="col-span-2 font-semibold text-white mb-1">New Category</h3>
                  {[{ label: "Name *", field: "name", span: 2 }, { label: "Slug *", field: "slug" }, { label: "Emoji", field: "emoji" }].map(({ label, field, span }) => (
                    <div key={field} className={span === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs text-gray-400 mb-1">{label}</label>
                      <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                        value={String((newCategory as Record<string, unknown>)[field] ?? "")}
                        onChange={(e) => setNewCategory((c) => ({ ...c, [field]: e.target.value }))}
                        required={["name", "slug"].includes(field)} />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Description</label>
                    <input className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                      value={newCategory.description ?? ""} onChange={(e) => setNewCategory((c) => ({ ...c, description: e.target.value }))} />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-end">
                    <button type="button" onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm">Create</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading.categories ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-gray-800 rounded-xl h-28 animate-pulse border border-gray-700" />) :
                  categories.length === 0 ? <div className="col-span-3 text-gray-500 text-center py-12">No categories yet</div> :
                  categories.map((c) => (
                    <div key={c.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                      {editingCategory === c.id ? (
                        <div className="space-y-2">
                          <input className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none" value={String(editCategoryData.name ?? c.name)} onChange={(e) => setEditCategoryData((d) => ({ ...d, name: e.target.value }))} />
                          <input className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none" placeholder="Emoji" value={String(editCategoryData.emoji ?? c.emoji ?? "")} onChange={(e) => setEditCategoryData((d) => ({ ...d, emoji: e.target.value }))} />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateCategory(c.id)} className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-sm flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Save</button>
                            <button onClick={() => setEditingCategory(null)} className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center justify-center gap-1"><X className="w-3.5 h-3.5" /> Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{c.emoji ?? "📦"}</span>
                              <div>
                                <p className="font-semibold text-white">{c.name}</p>
                                <p className="text-xs text-gray-500">{c.slug}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{c.productCount ?? 0} products</span>
                          </div>
                          {c.description && <p className="text-xs text-gray-500 mb-3 line-clamp-1">{c.description}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingCategory(c.id); setEditCategoryData({ name: c.name, emoji: c.emoji ?? "" }); }} className="flex-1 py-1.5 bg-gray-700 hover:bg-blue-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"><Pencil className="w-3 h-3" /> Edit</button>
                            <button onClick={() => handleDeleteCategory(c.id)} className="flex-1 py-1.5 bg-gray-700 hover:bg-red-700 text-gray-400 hover:text-red-400 rounded text-xs flex items-center justify-center gap-1 transition-colors"><Trash2 className="w-3 h-3" /> Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ══════════ INVENTORY ══════════ */}
          {tab === "inventory" && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-white">Inventory Management</h1>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Out of Stock", value: inventory.filter((p) => p.stock === 0).length, color: "text-red-400", bg: "bg-red-900/20 border-red-900/30" },
                  { label: "Low Stock (< 10)", value: inventory.filter((p) => p.stock > 0 && p.stock < 10).length, color: "text-orange-400", bg: "bg-orange-900/20 border-orange-900/30" },
                  { label: "In Stock", value: inventory.filter((p) => p.stock >= 10).length, color: "text-green-400", bg: "bg-green-900/20 border-green-900/30" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-4 border ${s.bg}`}>
                    <p className="text-sm text-gray-400">{s.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-750 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wide">
                    {["Product", "Emoji", "Price", "Stock Level", "Status"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {loading.inventory ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-700 rounded animate-pulse" /></td></tr>) :
                      inventory.map((p) => {
                        const pct = Math.min(100, (p.stock / 100) * 100);
                        const color = p.stock === 0 ? "bg-red-500" : p.stock < 10 ? "bg-orange-500" : "bg-green-500";
                        const label = p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock";
                        const labelColor = p.stock === 0 ? "text-red-400" : p.stock < 10 ? "text-orange-400" : "text-green-400";
                        return (
                          <tr key={p.id} className="hover:bg-gray-750 transition-colors">
                            <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                            <td className="px-4 py-3 text-xl">{p.emoji ?? "🌿"}</td>
                            <td className="px-4 py-3 text-gray-300">₹{p.price}</td>
                            <td className="px-4 py-3 w-48">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-sm font-medium text-white w-8 text-right">{p.stock}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {(p.stock === 0 || p.stock < 10) && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                                <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ SETTINGS ══════════ */}
          {tab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h1 className="text-xl font-bold text-white">Settings</h1>

              {[
                {
                  title: "Store Information", fields: [
                    { label: "Store Name", value: "Farm By Gaavwala", type: "text" },
                    { label: "Store Email", value: "hello@farmgaavwala.com", type: "email" },
                    { label: "WhatsApp Number", value: "+91 98765 43210", type: "text" },
                    { label: "Store Address", value: "123 Farm Road, Rural India", type: "text" },
                  ]
                },
                {
                  title: "Delivery Settings", fields: [
                    { label: "Free Delivery Above (₹)", value: "0", type: "number" },
                    { label: "Standard Delivery Charge (₹)", value: "0", type: "number" },
                    { label: "Express Delivery Charge (₹)", value: "99", type: "number" },
                  ]
                },
                {
                  title: "Payment Settings", fields: [
                    { label: "Razorpay Key ID", value: "rzp_test_••••••••", type: "text" },
                    { label: "COD Available", value: "Yes", type: "text" },
                  ]
                },
              ].map((section) => (
                <div key={section.title} className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                  <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                  <div className="space-y-3">
                    {section.fields.map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
                        <input type={field.type} defaultValue={field.value} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500" />
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-colors">
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
