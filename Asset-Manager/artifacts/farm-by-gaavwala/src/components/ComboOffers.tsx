import { motion } from "framer-motion";
import { Sparkles, Clock, Tag } from "lucide-react";

const combos = [
  {
    id: 1,
    name: "Festival Snack Bundle",
    description: "Kerala Banana Chips + Mixed Dry Fruits + 2 Traditional Snacks — perfect for Diwali gifting",
    items: ["Kerala Banana Chips 250g", "Mixed Dry Fruits 300g", "Murukku 200g", "Chakli 200g"],
    price: 599,
    originalPrice: 849,
    savings: 250,
    discount: 29,
    emoji: "🎁",
    badge: "Diwali Special",
    gradient: "from-amber-500 to-orange-600",
    light: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
  {
    id: 2,
    name: "Spice Master Kit",
    description: "7 premium hand-ground spices curated by our farming partners — the complete Indian pantry",
    items: ["Kashmiri Red Chilli 100g", "Coriander Powder 100g", "Turmeric 100g", "Garam Masala 100g"],
    price: 449,
    originalPrice: 650,
    savings: 201,
    discount: 31,
    emoji: "🌶",
    badge: "Chef's Choice",
    gradient: "from-red-500 to-rose-600",
    light: "from-red-50 to-rose-50",
    border: "border-red-200",
  },
  {
    id: 3,
    name: "Healthy Start Pack",
    description: "Organic ghee, A2 milk powder, and premium dry fruits — your morning ritual, elevated",
    items: ["A2 Desi Ghee 250ml", "Organic Honey 300g", "Trail Mix 200g", "Flaxseeds 200g"],
    price: 799,
    originalPrice: 1099,
    savings: 300,
    discount: 27,
    emoji: "🌅",
    badge: "Wellness Combo",
    gradient: "from-emerald-500 to-green-700",
    light: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
  },
];

export default function ComboOffers() {
  return (
    <section
      id="combos"
      data-testid="combos-section"
      className="section-pad"
      style={{
        background:
          "linear-gradient(180deg, hsl(152,20%,94%) 0%, hsl(42,35%,97%) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Limited Time
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Combo Offers
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Thoughtfully bundled for festivals, gifting, and everyday indulgence — always at the best value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="combos-grid">
          {combos.map((combo, idx) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative group bg-gradient-to-br ${combo.light} border ${combo.border} rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300`}
              data-testid={`combo-card-${combo.id}`}
            >
              <div className={`bg-gradient-to-r ${combo.gradient} p-5 flex items-center gap-4`}>
                <span className="text-5xl">{combo.emoji}</span>
                <div>
                  <div className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-1">
                    {combo.badge}
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight">{combo.name}</h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{combo.description}</p>

                <ul className="space-y-1.5 mb-5">
                  {combo.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2 mb-4 border border-card-border">
                  <Tag className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-600">You Save ₹{combo.savings} ({combo.discount}% OFF)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{combo.price}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">₹{combo.originalPrice}</span>
                  </div>
                  <button
                    data-testid={`grab-deal-${combo.id}`}
                    className={`bg-gradient-to-r ${combo.gradient} text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md`}
                  >
                    Grab Deal
                  </button>
                </div>
              </div>

              <div className="px-5 pb-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Limited stock available
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
