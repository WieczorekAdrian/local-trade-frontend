import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, PackageSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: FileText, title: "Dodaj ogłoszenie", desc: "Wypełnij prosty formularz i dodaj zdjęcia." },
  { icon: PackageSearch, title: "Przeglądaj okazje", desc: "Znajdź to, czego szukasz w swojej okolicy." },
  { icon: ShieldCheck, title: "Kupuj bezpiecznie", desc: "Wymieniaj wiadomości bezpośrednio na platformie." },
];

export function HowItWorksCollapsible() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`
    group rounded-full px-6 py-5 bg-white border-primary/30 
    hover:bg-slate-50 hover:border-primary/60 hover:shadow-md
    transition-all duration-300 shadow-sm
    ${isOpen ? "bg-slate-50 border-primary/60 shadow-inner" : ""}
  `}
      >
        <span className="font-semibold text-primary text-md">Jak to działa?</span>
        <ChevronDown
          className={`h-5 w-5 text-primary transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-b mb-8">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3 p-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <step.icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-bold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground max-w-[200px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
