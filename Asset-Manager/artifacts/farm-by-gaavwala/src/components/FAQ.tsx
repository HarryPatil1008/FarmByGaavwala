import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Where do your products come from?",
    a: "All our products are sourced directly from our network of 50+ partner farmers spread across India — Kerala for banana chips, Rajasthan for spices, Kashmir for dry fruits, and Andhra Pradesh for pickles. We visit every farm personally and build long-term relationships with our farmers.",
  },
  {
    q: "Are your products free from preservatives and artificial ingredients?",
    a: "Absolutely. We use zero artificial preservatives, colours, or flavours across our entire range. Our products stay fresh through traditional methods like sun-drying, cold-pressing, and natural salt curing — the same techniques Indian households have used for centuries.",
  },
  {
    q: "How fresh are the products when they arrive?",
    a: "We process in small, frequent batches to ensure maximum freshness. Most products have a shelf life of 3–12 months depending on the category, and we ship within 48 hours of your order. You'll always receive products with at least 60% of their shelf life remaining.",
  },
  {
    q: "Do you offer bulk or wholesale orders?",
    a: "Yes! We work with retailers, gift hamper businesses, corporate gifting teams, and restaurants. Bulk discounts start at orders of ₹5,000 and above. Contact us via WhatsApp or the inquiry form and our team will get back to you within 24 hours.",
  },
  {
    q: "What is your return and refund policy?",
    a: "If you receive a damaged or incorrect product, we'll replace it or issue a full refund — no questions asked. Simply contact us within 7 days of delivery with a photo of the product. We take quality seriously and stand behind every package we send.",
  },
  {
    q: "Do you ship outside India?",
    a: "Currently we ship across all major cities and towns in India via our courier partners. International shipping to select countries (USA, UAE, UK, Canada, Singapore) is available for dry, non-perishable products. Contact us for shipping rates and timelines.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is dispatched, you'll receive an SMS and email with a tracking link. We partner with reputable logistics providers like DTDC, Blue Dart, and Delhivery. Most metro city orders arrive within 3–4 business days; other areas within 5–7 days.",
  },
  {
    q: "Are your products suitable for children and elderly?",
    a: "Yes — because we use no artificial additives, our products are suitable for all age groups. Our organic ghee and dry fruits are especially popular with families with young children and senior members. However, please check individual product pages for allergen information.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="section-pad bg-background"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
            Got Questions?
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Frequently Asked
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything you need to know about our products, delivery, and sourcing practices.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          data-testid="faq-accordion"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-card-border rounded-2xl px-5 bg-card shadow-sm overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-md transition-all duration-200"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="text-left font-semibold text-foreground text-sm md:text-base py-5 hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center p-6 bg-accent rounded-2xl border border-accent-border"
          data-testid="faq-contact-cta"
        >
          <p className="text-foreground font-semibold mb-1">Still have questions?</p>
          <p className="text-muted-foreground text-sm mb-4">
            We're happy to help — reach out via WhatsApp or the contact form below.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
