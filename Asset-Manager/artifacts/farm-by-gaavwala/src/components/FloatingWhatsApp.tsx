import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-testid="floating-whatsapp"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden"
            data-testid="whatsapp-popup"
          >
            <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">Farm By Gaavwala</p>
                  <p className="text-green-200 text-xs mt-0.5">Typically replies in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                data-testid="button-close-whatsapp"
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 bg-[#e5ddd5]">
              <div className="bg-white rounded-xl rounded-tl-none px-3 py-2.5 shadow-sm max-w-[85%]">
                <p className="text-gray-800 text-sm leading-relaxed">
                  Hello! Welcome to Farm By Gaavwala. How can we help you today? Ask us about products,
                  bulk orders, or anything else.
                </p>
                <p className="text-gray-400 text-[10px] mt-1 text-right">Just now</p>
              </div>
            </div>

            <div className="px-4 py-3">
              <a
                href="https://wa.me/919876543210?text=Hello%20Farm%20By%20Gaavwala!%20I%20am%20interested%20in%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-whatsapp-chat"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Start Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-whatsapp-toggle"
        className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full shadow-xl flex items-center justify-center transition-colors relative"
        style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}
      >
        <span className="absolute w-full h-full rounded-full bg-green-400 animate-ping opacity-30" />
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </motion.button>
    </div>
  );
}
