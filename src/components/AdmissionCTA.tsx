import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const AdmissionCTA = () => {
  const [lang, setLang] = useState<string>(
    (typeof window !== "undefined" ? localStorage.getItem("site_lang") : "M") || "M"
  );
  useEffect(() => {
    const tick = () => setLang(localStorage.getItem("site_lang") || "M");
    window.addEventListener("storage", tick);
    const i = setInterval(tick, 400);
    return () => { window.removeEventListener("storage", tick); clearInterval(i); };
  }, []);
  const isEn = lang === "E";

  return (
    <section id="admission-form" className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft p-8 md:p-12 animate-fade-in">
            {/* Decorative glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40"
              style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.35), transparent)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(closest-side, hsl(var(--gold) / 0.5), transparent)" }}
            />

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl emerald-gradient flex items-center justify-center shadow-lg shrink-0 transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" strokeWidth={2} />
              </div>

              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-xs font-medium mb-3">
                  {isEn ? "Admissions 2026-27" : "പ്രവേശനം 2026-27"}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                  {isEn ? "🎓 Student Admission" : "🎓 വിദ്യാർത്ഥി അഡ്മിഷൻ"}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                  {isEn
                    ? "Apply for admission to Jawharathul Uloom Suffa Dars."
                    : "ജൗഹറത്തുൽ ഉലൂം സുഫ്ഫ ദർസിൽ അഡ്മിഷനായി അപേക്ഷിക്കുക."}
                </p>
              </div>

              <Link
                to="/admission"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl emerald-gradient text-primary-foreground font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>{isEn ? "Apply for Admission" : "അഡ്മിഷന് അപേക്ഷിക്കുക"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionCTA;
