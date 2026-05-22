import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const gallery = [
  {
    id: 1,
    label: "Banana plantation at sunrise",
    gradient: "from-yellow-300 to-amber-500",
    emoji: "🌅",
  },
  {
    id: 2,
    label: "Freshly packed spice jars",
    gradient: "from-red-400 to-orange-500",
    emoji: "🌶",
  },
  {
    id: 3,
    label: "Farmer harvesting turmeric",
    gradient: "from-yellow-400 to-green-500",
    emoji: "🌾",
  },
  {
    id: 4,
    label: "Traditional pickle-making",
    gradient: "from-lime-400 to-green-600",
    emoji: "🫙",
  },
  {
    id: 5,
    label: "Premium dry fruit arrangement",
    gradient: "from-amber-500 to-yellow-600",
    emoji: "🥜",
  },
  {
    id: 6,
    label: "Village morning — our farm life",
    gradient: "from-emerald-400 to-teal-600",
    emoji: "🌿",
  },
];

export default function SocialGallery() {
  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="section-pad"
      style={{ background: "linear-gradient(180deg, hsl(42,35%,97%) 0%, hsl(42,35%,95%) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 text-secondary text-sm font-semibold tracking-widest uppercase">
            <Instagram className="w-4 h-4" />
            @farmbygaavwala
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Our Farm Life
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Follow our journey from field to shelf — every crop, every harvest, every batch of goodness.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          data-testid="gallery-grid"
        >
          {gallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              whileHover={{ scale: 1.03 }}
              className={`relative group rounded-2xl overflow-hidden cursor-pointer aspect-square bg-gradient-to-br ${item.gradient}`}
              data-testid={`gallery-item-${item.id}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-4">
                <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {item.label}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="#contact"
            data-testid="gallery-follow-cta"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-7 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md"
          >
            <Instagram className="w-5 h-5" />
            Follow Us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
