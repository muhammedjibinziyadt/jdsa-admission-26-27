import { useRef } from "react";
import {
  BookOpen, Heart, Users, Star, Shield, Lightbulb,
  TrendingUp, Sparkles, CheckCircle2, Award,
} from "lucide-react";

type VariantKey =
  | "values" | "personality" | "cultural" | "exam"
  | "discipline" | "knowledge" | "confidence" | "ethics" | "default";

const KEYWORDS: Record<VariantKey, string[]> = {
  values:      ["മൂല്യ", "value", "values"],
  personality: ["വ്യക്തിത്വ", "growth", "personality", "development"],
  cultural:    ["സാംസ്കാരിക", "cultural", "culture"],
  exam:        ["പരീക്ഷ", "exam", "test"],
  discipline:  ["അച്ചടക്കം", "discipline"],
  knowledge:   ["അറിവ്", "knowledge", "wisdom"],
  confidence:  ["ആത്മവിശ്വാസം", "confidence"],
  ethics:      ["ധാർമ്മിക", "ധാർമിക", "ethic", "moral"],
  default:     [],
};

export function pickVariant(title: string): VariantKey {
  const t = (title || "").toLowerCase();
  for (const k of Object.keys(KEYWORDS) as VariantKey[]) {
    if (KEYWORDS[k].some(w => t.includes(w.toLowerCase()))) return k;
  }
  return "default";
}

interface Props {
  title: string;
  description: string;
  variant?: VariantKey;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
}

const AnimatedFeatureCard = ({ title, description, variant, fallbackIcon: Fallback = Star }: Props) => {
  const v = variant ?? pickVariant(title);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`feature-card feature-card--${v} group h-full`}
    >
      <div className="feature-card-glow" aria-hidden />
      <div className="feature-card-particles" aria-hidden>
        <span /><span /><span /><span /><span />
      </div>
      <div className="feature-visual">
        <FeatureVisual variant={v} Fallback={Fallback} />
      </div>
      <div className="relative z-10 p-6 pt-4">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const FeatureVisual = ({ variant, Fallback }: { variant: VariantKey; Fallback: React.ComponentType<{ className?: string }> }) => {
  switch (variant) {
    case "values":
      return (
        <div className="visual-stage">
          <div className="open-book">
            <div className="page page-l"><span /><span /><span /></div>
            <div className="page page-r"><span /><span /><span /></div>
            <div className="page page-flip"><span /><span /><span /></div>
            <div className="book-spine" />
          </div>
          <BookOpen className="float-icon" />
          <Particles count={6} />
        </div>
      );
    case "personality":
      return (
        <div className="visual-stage">
          <svg viewBox="0 0 120 80" className="growth-chart">
            <polyline points="6,70 30,55 54,42 78,28 108,10"
              fill="none" stroke="currentColor" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" className="growth-line" />
            {[6, 30, 54, 78, 108].map((x, i) => (
              <circle key={i} cx={x} cy={[70,55,42,28,10][i]} r="3" className="growth-dot" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </svg>
          <div className="badge-pulse"><Award /></div>
          <Particles count={5} />
        </div>
      );
    case "cultural":
      return (
        <div className="visual-stage">
          <div className="culture-pattern" />
          <div className="culture-ring r1" />
          <div className="culture-ring r2" />
          <div className="culture-ring r3" />
          <Sparkles className="float-icon culture-icon" />
        </div>
      );
    case "exam":
      return (
        <div className="visual-stage">
          <div className="checklist">
            {[0,1,2].map(i => (
              <div key={i} className="check-row" style={{ animationDelay: `${i * 0.25}s` }}>
                <CheckCircle2 className="check-mark" />
                <div className="check-bar" />
              </div>
            ))}
          </div>
          <div className="progress-track"><div className="progress-fill" /></div>
        </div>
      );
    case "discipline":
      return (
        <div className="visual-stage">
          <div className="shield-rings"><span /><span /><span /></div>
          <Shield className="shield-icon" />
        </div>
      );
    case "knowledge":
      return (
        <div className="visual-stage">
          <div className="bulb-glow" />
          <Lightbulb className="bulb-icon" />
          <div className="idea-ring r1" />
          <div className="idea-ring r2" />
          <Particles count={7} />
        </div>
      );
    case "confidence":
      return (
        <div className="visual-stage">
          <div className="star-glow" />
          <Star className="star-icon" />
          <Particles count={6} className="rising" />
        </div>
      );
    case "ethics":
      return (
        <div className="visual-stage">
          <div className="heart-aura" />
          <Heart className="heart-icon" />
          <Particles count={5} className="rising" />
        </div>
      );
    default:
      return (
        <div className="visual-stage">
          <Fallback className="float-icon w-12 h-12" />
          <Particles count={4} />
        </div>
      );
  }
};

const Particles = ({ count, className = "" }: { count: number; className?: string }) => (
  <div className={`particles ${className}`} aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} style={{
        left: `${(i * 83) % 90 + 5}%`,
        animationDelay: `${(i * 0.4).toFixed(2)}s`,
        animationDuration: `${4 + (i % 3)}s`,
      }} />
    ))}
  </div>
);

export default AnimatedFeatureCard;
