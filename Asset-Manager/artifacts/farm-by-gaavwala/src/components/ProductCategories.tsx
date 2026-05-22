import { motion } from "framer-motion";
import { Banana, Flame, Apple, Archive, Sprout, Cookie, ShoppingBag } from "lucide-react";

const categories = [
  {
    icon: Banana,
    name: "Banana Chips",
    desc: "Kerala-style crispy chips",
    color: "from-yellow-100 to-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
  {
    icon: Flame,
    name: "Spices",
    desc: "Hand-ground masalas",
    color: "from-red-50 to-orange-100",
    iconColor: "text-orange-600",
    border: "border-orange-200",
  },
  {
    icon: Apple,
    name: "Dry Fruits",
    desc: "Premium nuts & raisins",
    color: "from-amber-50 to-yellow-100",
    iconColor: "text-yellow-700",
    border: "border-yellow-200",
  },
  {
    icon: Archive,
    name: "Pickles",
    desc: "Traditional homestyle achaar",
    color: "from-lime-50 to-green-100",
    iconColor: "text-green-700",
    border: "border-green-200",
  },
  {
    icon: Sprout,
    name: "Organic Products",
    desc: "Certified organic range",
    color: "from-emerald-50 to-teal-100",
    iconColor: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    icon: Cookie,
    name: "Traditional Snacks",
    desc: "Village-recipe delights",
    color: "from-orange-50 to-amber-100",
    iconColor: "text-amber-700",
    border: "border-amber-200",
  },
  {
    icon: ShoppingBag,
    name: "Farm Fresh",
    desc: "Seasonal farm produce",
    color: "from-green-50 to-lime-100",
    iconColor: "text-green-600",
    border: "border-lime-200",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductCategories() {
  return (
    <section
      id="categories"
      data-testid="categories-section"
      className="section-pad bg-background"
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
            What We Offer
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Product Categories
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Carefully sourced from partner farms across India — every category tells a story of
            tradition, purity, and honest craftsmanship.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          data-testid="categories-grid"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`group cursor-pointer rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.color} p-5 md:p-6 transition-shadow duration-200 hover:shadow-lg`}
                data-testid={`category-card-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                </div>
                <h3 className="font-semibold text-primary text-sm md:text-base leading-tight mb-1">
                  {cat.name}
                </h3>
                <p className="text-muted-foreground text-xs">{cat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
