import { Route, Switch } from "wouter";
import { Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import ComboOffers from "@/components/ComboOffers";
import Testimonials from "@/components/Testimonials";
import SocialGallery from "@/components/SocialGallery";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import OrdersPage from "@/pages/OrdersPage";
import WishlistPage from "@/pages/WishlistPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <ProductCategories />
        <FeaturedProducts />
        <About />
        <WhyChooseUs />
        <ComboOffers />
        <Testimonials />
        <SocialGallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
              <Route path="/cart" component={CartPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/order-success" component={OrderSuccessPage} />
              <Route path="/orders" component={OrdersPage} />
              <Route path="/wishlist" component={WishlistPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/admin" component={AdminPage} />
            </Switch>
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
