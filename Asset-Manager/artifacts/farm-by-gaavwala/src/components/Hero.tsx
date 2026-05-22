import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0d2818 0%, #1B4332 30%, #2d6a4f 55%, #3a5a40 70%, #52400e 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #f0c040 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #8B5E3C 0%, transparent 40%),
            radial-gradient(circle at 60% 70%, #2d6a4f 0%, transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
          data-testid="hero-badge"
        >
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-200 text-xs font-medium tracking-widest uppercase">
            100% Natural — Direct from Indian Farms
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6"
          data-testid="hero-headline"
        >
          Pure Taste From
          <br />
          <span
            className="italic"
            style={{ color: "#f0c040", textShadow: "0 0 40px rgba(240,192,64,0.3)" }}
          >
            Indian Farms
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/80 text-lg md:text-xl font-medium tracking-[0.15em] mb-10"
          data-testid="hero-subheading"
        >
          Fresh &nbsp;•&nbsp; Natural &nbsp;•&nbsp; Authentic &nbsp;•&nbsp; Direct From Farmers
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          data-testid="hero-ctas"
        >
          <a
            href="#products"
            data-testid="hero-shop-now"
            className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-amber-900/30"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#categories"
            data-testid="hero-explore-products"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Explore Products
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          data-testid="hero-stats"
        >
          {[
            { value: "50+", label: "Farmer Partners" },
            { value: "1200+", label: "Happy Customers" },
            { value: "100%", label: "Chemical Free" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-white/60 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        data-testid="hero-scroll-indicator"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
