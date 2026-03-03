import { Mail, Globe, Github } from "lucide-react";
import { InfoModal } from "@/components/common/InfoModel.tsx";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo i Opis */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-primary tracking-tight">Local Trade</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Najlepsze miejsce do kupna i sprzedaży w Twojej okolicy. Dołącz do tysięcy zadowolonych użytkowników.
            </p>
          </div>

          {/* Linki - Szybki dostęp */}
          <div>
            <h4 className="font-semibold mb-4">Serwis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Ogłoszenia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kategorie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Cennik
                </a>
              </li>
            </ul>
          </div>

          {/* Linki - Pomoc */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Pomoc</h4>
            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col">
              <li>
                <InfoModal triggerText="Regulamin" title="Regulamin serwisu">
                  <p>1. Każdy użytkownik może dodać ogłoszenie za darmo.</p>
                  <p>2. Zabrania się wystawiania przedmiotów nielegalnych.</p>
                </InfoModal>
              </li>
              <li>
                <InfoModal triggerText="Prywatność" title="Polityka prywatności">
                  <p>Twoje dane są u nas bezpieczne. Szyfrujemy wszystko, co się da.</p>
                  <p>Wykorzystujemy pliki cookies, aby strona działała poprawnie.</p>
                </InfoModal>
              </li>
              <li>
                <InfoModal triggerText="Kontakt" title="Skontaktuj się z nami">
                  <div className="space-y-4">
                    <p>Masz pytania? Chętnie pomożemy!</p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold">
                        Email: <span className="text-primary font-normal text-sm">wieczorek.adrian12@gmail.com</span>
                      </p>
                      <p className="font-semibold pt-2 text-sm">
                        Godziny pracy: <span className="font-normal">Pn-Pt 9:00 - 17:00</span>
                      </p>
                    </div>
                    <p className="text-xs italic text-muted-foreground text-sm">Odpowiadamy zazwyczaj w ciągu 24h.</p>
                  </div>
                </InfoModal>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div className="space-y-4">
            <h4 className="font-semibold">Bądźmy w kontakcie</h4>
            <div className="flex space-x-4 text-muted-foreground">
              <a href="mailto:wieczorek.adrian12@gmail.com" className="hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/adrian-wieczorek-b355ba31a/" className="hover:text-primary">
                <Globe className="h-5 w-5" />
              </a>
              <a href="https://github.com/WieczorekAdrian" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground pt-2">© 2026 Local Trade Sp. z o.o.</p>
          </div>
        </div>

        {/* Mały "smaczek" na dole - info o technologiach (dobre na portfolio) */}
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-medium">
            Built with React • Tailwind CSS • Shadcn UI
          </p>
        </div>
      </div>
    </footer>
  );
}
