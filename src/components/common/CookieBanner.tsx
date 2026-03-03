// src/components/common/CookieBanner.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Cookie, ShieldCheck, BarChart3, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = (finalSettings: typeof settings) => {
    localStorage.setItem("cookie-consent", JSON.stringify(finalSettings));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0"
        >
          <div className="bg-white border shadow-2xl rounded-2xl p-6 border-primary/20 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-tight">Prywatność i Cookies</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Używamy ciasteczek, aby nasza platforma była bezpieczna i pomocna.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleSave({ ...settings, analytics: true, marketing: true })}
                size="sm"
                className="w-full font-bold"
              >
                Akceptuję wszystkie
              </Button>

              {/* MODAL Z USTAWIENIAMI */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    Ustawienia
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Preferencje prywatności
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Sekcja: Niezbędne */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Niezbędne (Techniczne)</p>
                        <p className="text-xs text-muted-foreground">
                          Wymagane do działania strony i Twojego bezpieczeństwa.
                        </p>
                      </div>
                      <Switch checked disabled /> {/* Zawsze włączone */}
                    </div>

                    {/* Sekcja: Analityczne */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-semibold">Analityczne</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pomagają nam zrozumieć, jak korzystasz ze strony.
                        </p>
                      </div>
                      <Switch
                        checked={settings.analytics}
                        onCheckedChange={(val) => setSettings((prev) => ({ ...prev, analytics: val }))}
                      />
                    </div>

                    {/* Sekcja: Marketingowe */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-semibold">Marketingowe</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Dzięki nim widzisz ogłoszenia, które Cię interesują.
                        </p>
                      </div>
                      <Switch
                        checked={settings.marketing}
                        onCheckedChange={(val) => setSettings((prev) => ({ ...prev, marketing: val }))}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave(settings)} className="w-full font-bold">
                    Zapisz moje wybory
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
