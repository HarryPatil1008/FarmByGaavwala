import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "PS",
    avatarColor: "bg-rose-500",
    rating: 5,
    title: "The banana chips are simply unreal",
    review:
      "I've tried so many banana chip brands but nothing compares to Farm By Gaavwala's Kerala chips. You can actually taste the coconut oil — real, pure, and incredibly crispy. My entire family is hooked. We've been ordering every month for over a year.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Bengaluru, Karnataka",
    avatar: "RK",
    avatarColor: "bg-blue-600",
    rating: 5,
    title: "Finally found honest organic ghee",
    review:
      "As someone who's been searching for authentic A2 desi ghee for years, I'm so glad I found Gaavwala. The bilona process is genuine, the ghee has that perfect grainy texture and deep aroma. This is the real deal. Worth every rupee.",
  },
  {
    id: 3,
    name: "Anita Menon",
    location: "Kochi, Kerala",
    avatar: "AM",
    avatarColor: "bg-purple-600",
    rating: 5,
    title: "My grandmother approved the pickle",
    review:
      "That's the highest praise in my house — when my Ammachi (86 years old!) says something tastes like how she used to make it in the village. She tried the mango pickle and smiled. I nearly cried. Order this pickle. Just do it.",
  },
  {
    id: 4,
    name: "Vikram Singh Rathore",
    location: "Jaipur, Rajasthan",
    avatar: "VS",
    avatarColor: "bg-amber-600",
    rating: 4,
    title: "Premium quality, fast delivery",
    review:
      "Ordered the Spice Master Kit as a gift for my sister's wedding. The packaging was premium, the spices were fragrant and clearly fresh-ground. Everyone at the wedding asked where we got the masalas from. Great product, will definitely reorder.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= count ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
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
            What People Say
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Loved By Families
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Real reviews from real customers who've made Farm By Gaavwala part of their kitchen.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-testid="testimonials-grid"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card rounded-3xl border border-card-border p-6 md:p-7 hover:shadow-lg transition-all duration-300 relative"
              data-testid={`testimonial-card-${t.id}`}
            >
              <Quote
                className="absolute top-5 right-6 w-10 h-10 text-primary/10"
                fill="currentColor"
              />
              <Stars count={t.rating} />
              <h3 className="font-semibold text-foreground text-base mt-3 mb-2">
                "{t.title}"
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t.review}</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.location}</div>
                </div>
                <div className="ml-auto">
                  <div className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Verified Purchase
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 bg-primary rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-center"
          data-testid="testimonials-summary"
        >
          {[
            { value: "4.8/5", label: "Average Rating" },
            { value: "1,200+", label: "Happy Customers" },
            { value: "98%", label: "Would Recommend" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-3xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-white/70 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
