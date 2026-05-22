import { Leaf, Instagram, Facebook, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Categories", href: "#categories" },
  { label: "About Us", href: "#about" },
  { label: "Combo Offers", href: "#combos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const products = [
  "Banana Chips",
  "Spices",
  "Dry Fruits",
  "Pickles",
  "Organic Ghee",
  "Trail Mixes",
  "Festival Hampers",
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-400" },
  { icon: Facebook, label: "Facebook", href: "#", color: "hover:text-blue-400" },
  { icon: Youtube, label: "YouTube", href: "#", color: "hover:text-red-400" },
];

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      style={{
        background: "linear-gradient(180deg, #1B4332 0%, #0d2818 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-white leading-none">Farm By</div>
                <div className="text-amber-400 text-xs font-medium tracking-widest uppercase">Gaavwala</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Connecting Indian farm families with urban households — one pure, honest product at a time.
            </p>
            <div className="flex gap-3" data-testid="footer-socials">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    data-testid={`social-${s.label.toLowerCase()}`}
                    className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 transition-all duration-200 hover:bg-white/20 ${s.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div data-testid="footer-quick-links">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="footer-products">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Our Products
            </h4>
            <ul className="space-y-2.5">
              {products.map((p) => (
                <li key={p}>
                  <a href="#products" className="text-white/60 text-sm hover:text-amber-400 transition-colors">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="footer-newsletter">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Stay Connected
            </h4>
            <p className="text-white/60 text-sm mb-4">
              Get seasonal offers, new arrivals, and farm stories in your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
              data-testid="footer-newsletter-form"
            >
              <input
                type="email"
                placeholder="your@email.com"
                data-testid="input-newsletter-email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-amber-400/60 transition-colors"
              />
              <button
                type="submit"
                data-testid="button-newsletter-subscribe"
                className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Join
              </button>
            </form>

            <div className="mt-6 flex gap-2 flex-wrap">
              {["FSSAI Certified", "100% Organic", "No Preservatives"].map((cert) => (
                <span
                  key={cert}
                  className="bg-white/10 border border-white/15 text-white/70 text-xs px-2.5 py-1 rounded-full"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Farm By Gaavwala. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map((item) => (
              <a key={item} href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
