import { motion } from "framer-motion";
import { Tractor, FlaskConical, PackageCheck, Award, Utensils, Truck } from "lucide-react";

const reasons = [
  {
    icon: Tractor,
    title: "Direct From Farmers",
    desc: "We work hand-in-hand with 50+ partner farmers across India, cutting out middlemen completely.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: FlaskConical,
    title: "No Artificial Chemicals",
    desc: "Zero preservatives, no artificial colours or flavours. What you see is exactly what nature made.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: PackageCheck,
    title: "Hygienic Packaging",
    desc: "Food-grade, tamper-proof packaging done in ISO-compliant facilities with strict quality controls.",
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: Award,
    title: "Export Quality",
    desc: "FSSAI certified and meeting international export standards — the same quality we ship abroad.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Utensils,
    title: "Authentic Taste",
    desc: "Traditional recipes refined over generations — the flavour of real Indian kitchens in every bite.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Pan-India delivery within 3-5 days, with cold-chain packaging for perishable items.",
    color: "bg-teal-100 text-teal-700",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      data-testid="why-choose-us-section"
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
            Why We Stand Out
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Six reasons thousands of families trust Farm By Gaavwala for their pantry.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="why-choose-grid"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group p-6 bg-card rounded-2xl border border-card-border hover:shadow-lg transition-all duration-300"
                data-testid={`why-card-${reason.title.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${reason.color} group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-2">{reason.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{reason.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
