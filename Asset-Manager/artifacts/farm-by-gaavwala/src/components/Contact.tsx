import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="section-pad"
      style={{ background: "linear-gradient(180deg, hsl(152,20%,94%) 0%, hsl(42,35%,97%) 100%)" }}
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
            We'd Love to Hear From You
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            For orders, bulk inquiries, or just to say hello — our team responds within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-testid="contact-info"
          >
            <div className="space-y-5 mb-8">
              {[
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: "+91 98765 43210",
                  href: "https://wa.me/919876543210",
                  color: "bg-green-100 text-green-700",
                  cta: "Chat Now",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 98765 43210",
                  href: "tel:+919876543210",
                  color: "bg-blue-100 text-blue-700",
                  cta: null,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@farmbygaavwala.in",
                  href: "mailto:hello@farmbygaavwala.in",
                  color: "bg-amber-100 text-amber-700",
                  cta: null,
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "Gaavwala Farm, Near Thrissur, Kerala 680001, India",
                  href: "#",
                  color: "bg-rose-100 text-rose-700",
                  cta: null,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        data-testid={`contact-${item.label.toLowerCase()}`}
                        className="text-foreground font-semibold text-sm hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                    {item.cta && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-green-500 transition-colors mt-0.5"
                      >
                        {item.cta}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
              <p className="font-semibold text-primary text-sm mb-3">Business Hours</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday – Saturday</span>
                  <span className="font-medium text-foreground">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium text-foreground">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WhatsApp</span>
                  <span className="font-medium text-green-700">24/7 Available</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-testid="contact-form-container"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl border border-card-border shadow-sm p-7 space-y-5"
              data-testid="contact-form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma"
                    data-testid="input-name"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    data-testid="input-phone"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  data-testid="input-email"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                  Message *
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us what you're looking for — product inquiry, bulk order, partnership..."
                  data-testid="input-message"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/60 resize-none"
                />
              </div>

              <button
                type="submit"
                data-testid="button-submit"
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  submitted
                    ? "bg-green-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {submitted ? (
                  "Message Sent — We'll be in touch!"
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
