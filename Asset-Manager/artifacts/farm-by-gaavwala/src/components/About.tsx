import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const values = [
  "Sourced directly from 50+ partner farmers",
  "Zero artificial preservatives or additives",
  "Traditional recipes preserved for generations",
  "Export-quality packaging and hygiene standards",
  "Fair prices that support farming communities",
];

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="section-pad overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 40%, #3a5a40 70%, #1B4332 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
            data-testid="about-illustration"
          >
            <div className="relative rounded-3xl overflow-hidden" style={{ height: "420px" }}>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 70%, rgba(240,192,64,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(139,94,60,0.3) 0%, transparent 50%), linear-gradient(180deg, #0d2818 0%, #1B4332 50%, #2d6a4f 100%)",
                }}
              />
              <div className="absolute top-8 right-8 w-24 h-24 rounded-full border-2 border-amber-400/30" />
              <div className="absolute top-12 right-12 w-16 h-16 rounded-full border border-amber-400/20" />
              <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-amber-400/10" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center">
                  <span className="text-4xl">🌾</span>
                </div>
                <div className="text-center">
                  <div className="font-serif text-2xl font-bold text-white">Farm By Gaavwala</div>
                  <div className="text-amber-300 text-sm mt-1 tracking-widest uppercase">
                    Est. in the Fields
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { icon: "🌿", label: "Natural" },
                    { icon: "🤝", label: "Farmers" },
                    { icon: "✨", label: "Pure" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                        {item.icon}
                      </div>
                      <span className="text-white/70 text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="text-3xl">🏆</div>
              <div>
                <div className="font-bold text-primary text-sm">Export Quality</div>
                <div className="text-xs text-muted-foreground">FSSAI Certified</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -left-4 bg-amber-500 rounded-2xl shadow-xl p-4 text-white"
            >
              <div className="font-bold text-2xl">50+</div>
              <div className="text-xs opacity-80">Farmer Partners</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            data-testid="about-content"
          >
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
              Our Story
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3 mb-6 leading-tight">
              Rooted in Soil,
              <br />
              <span className="italic text-amber-400">Built with Purpose</span>
            </h2>
            <p className="text-white/75 text-base leading-relaxed mb-4">
              Farm By Gaavwala was born from a simple belief — that the best food in the world is
              already growing in Indian farms, tended by hands that have known these fields for
              generations. We just help it reach your table.
            </p>
            <p className="text-white/75 text-base leading-relaxed mb-8">
              Our name means "one who belongs to the village." We partner directly with small
              farmers, using traditional methods that have been passed down through centuries —
              no shortcuts, no compromises, no artificial ingredients.
            </p>

            <ul className="space-y-3 mb-8" data-testid="about-values">
              {values.map((val) => (
                <li key={val} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{val}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              data-testid="about-cta"
            >
              Get in Touch with Us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
