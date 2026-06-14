import { Sparkles } from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";
import { useEffect, useRef, useState } from "react";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  syllabus?: string;
  featured: boolean;
}

interface CoursesSectionProps {
  courses: Course[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
}

/* ---------- Subject-specific animated visuals ---------- */

const WritingVisual = () => (
  <div className="course-visual">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="notebook">
        <div className="notebook-line" />
        <div className="notebook-line" />
        <div className="notebook-line short" />
        <svg className="ink-stroke" viewBox="0 0 100 40" fill="none">
          <path d="M5 25 Q 25 5, 45 22 T 95 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <svg className="pen" viewBox="0 0 64 64" fill="none">
        <g transform="rotate(-30 32 32)">
          <rect x="28" y="6" width="8" height="36" rx="2" fill="hsl(var(--primary))" />
          <rect x="28" y="6" width="8" height="8" rx="2" fill="hsl(38 78% 52%)" />
          <polygon points="28,42 36,42 32,56" fill="hsl(220 15% 18%)" />
          <circle cx="32" cy="54" r="1.6" fill="hsl(38 78% 52%)" />
        </g>
      </svg>
    </div>
  </div>
);

const SpeechVisual = () => (
  <div className="course-visual">
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="wave wave-1" />
      <span className="wave wave-2" />
      <span className="wave wave-3" />
      <svg className="mic" viewBox="0 0 64 64" fill="none">
        <rect x="24" y="8" width="16" height="30" rx="8" fill="hsl(var(--primary))" />
        <path d="M16 34 a16 16 0 0 0 32 0" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="30" y="50" width="4" height="8" fill="hsl(var(--primary))" />
        <rect x="22" y="56" width="20" height="3" rx="1.5" fill="hsl(var(--primary))" />
      </svg>
    </div>
  </div>
);

const LibraryVisual = () => (
  <div className="course-visual">
    <div className="absolute inset-0 flex items-end justify-center gap-1.5 pb-4">
      <div className="book book-a" />
      <div className="book book-b" />
      <div className="book book-c" />
      <div className="book book-d" />
    </div>
    <svg className="floating-book" viewBox="0 0 64 48" fill="none">
      <rect x="4" y="6" width="56" height="36" rx="2" fill="hsl(var(--primary))" />
      <rect x="30" y="6" width="4" height="36" fill="hsl(158 64% 15%)" />
      <rect x="8" y="10" width="20" height="2" fill="hsl(0 0% 100% / 0.5)" />
      <rect x="36" y="10" width="20" height="2" fill="hsl(0 0% 100% / 0.5)" />
    </svg>
  </div>
);

const CanteenVisual = () => (
  <div className="course-visual">
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="steam steam-1" />
      <span className="steam steam-2" />
      <span className="steam steam-3" />
      <svg className="cup" viewBox="0 0 64 64" fill="none">
        <path d="M14 28 H46 V48 a6 6 0 0 1 -6 6 H20 a6 6 0 0 1 -6 -6 Z" fill="hsl(var(--primary))" />
        <path d="M46 32 h6 a6 6 0 0 1 0 12 h-6" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
        <rect x="14" y="28" width="32" height="4" fill="hsl(38 78% 52%)" />
      </svg>
    </div>
  </div>
);

const GrowthVisual = () => (
  <div className="course-visual">
    <div className="absolute inset-0 flex items-end justify-center gap-2 pb-5 px-6">
      <div className="bar bar-1" />
      <div className="bar bar-2" />
      <div className="bar bar-3" />
      <div className="bar bar-4" />
    </div>
    <svg className="trend" viewBox="0 0 100 60" fill="none">
      <polyline points="5,50 25,38 45,42 65,22 90,10" stroke="hsl(38 78% 52%)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="90" cy="10" r="3" fill="hsl(38 78% 52%)" />
    </svg>
    <span className="sparkle sparkle-1">✦</span>
    <span className="sparkle sparkle-2">✦</span>
    <span className="sparkle sparkle-3">✦</span>
  </div>
);

const SermonVisual = () => (
  <div className="course-visual">
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="rays" />
      <svg className="mosque" viewBox="0 0 80 60" fill="none">
        <path d="M40 6 v6 M37 12 h6" stroke="hsl(38 78% 52%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 14 c-6 0 -10 4 -10 10 v22 h20 v-22 c0 -6 -4 -10 -10 -10 z" fill="hsl(var(--primary))" />
        <rect x="14" y="34" width="14" height="20" fill="hsl(var(--primary))" />
        <rect x="52" y="34" width="14" height="20" fill="hsl(var(--primary))" />
        <path d="M18 34 a3 3 0 0 1 6 0" fill="hsl(158 64% 15%)" />
        <path d="M56 34 a3 3 0 0 1 6 0" fill="hsl(158 64% 15%)" />
        <path d="M36 40 a4 5 0 0 1 8 0 v14 h-8 z" fill="hsl(38 78% 52%)" />
      </svg>
      <svg className="bubble" viewBox="0 0 40 32" fill="none">
        <path d="M4 4 h32 a2 2 0 0 1 2 2 v16 a2 2 0 0 1 -2 2 H14 l-6 6 v-6 H4 a2 2 0 0 1 -2 -2 V6 a2 2 0 0 1 2 -2 z" fill="hsl(0 0% 100% / 0.95)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="1.5" fill="hsl(var(--primary))" />
        <circle cx="20" cy="14" r="1.5" fill="hsl(var(--primary))" />
        <circle cx="26" cy="14" r="1.5" fill="hsl(var(--primary))" />
      </svg>
      <span className="geo-pattern" />
    </div>
  </div>
);

/* ---------- Title → visual matcher ---------- */

type VisualKind = "writing" | "speech" | "library" | "canteen" | "growth" | "sermon";

const pickVisual = (title: string, index: number): VisualKind => {
  const t = title || "";
  if (/എഴുത്ത്|writing|pen/i.test(t)) return "writing";
  if (/പ്രസംഗ|speech|speak/i.test(t)) return "speech";
  if (/ലൈബ്രറി|library|book/i.test(t)) return "library";
  if (/കാന്റീൻ|canteen|food/i.test(t)) return "canteen";
  if (/വ്യക്തിത്വ|personality|growth/i.test(t)) return "growth";
  if (/വഅള്|sermon|വാള്|വഅള/i.test(t)) return "sermon";
  const fallback: VisualKind[] = ["writing", "speech", "library", "canteen", "growth", "sermon"];
  return fallback[index % fallback.length];
};

const renderVisual = (kind: VisualKind) => {
  switch (kind) {
    case "writing": return <WritingVisual />;
    case "speech": return <SpeechVisual />;
    case "library": return <LibraryVisual />;
    case "canteen": return <CanteenVisual />;
    case "growth": return <GrowthVisual />;
    case "sermon": return <SermonVisual />;
  }
};

/* ---------- Card ---------- */

const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  const kind = pickVisual(course.title, index);
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 6, y: px * 8 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={`course-card course-card--${kind} group`}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="course-card-glow" />
      {renderVisual(kind)}
      <div className="relative z-10 p-6 pt-2">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {course.description}
        </p>
      </div>
    </div>
  );
};

/* ---------- Section ---------- */

const CoursesSection = ({
  courses,
  sectionTitle = "പഠന പാഠ്യന്തര വിഷയങ്ങൾ",
  sectionSubtitle = "പഠന പദ്ധതികൾ",
  sectionDescription = "സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു",
}: CoursesSectionProps) => {
  const featured = courses.filter((c) => c.featured);
  const regular = courses.filter((c) => !c.featured);

  return (
    <section id="courses" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <ScrollAnimate direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {sectionSubtitle}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              {sectionTitle}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {sectionDescription}
            </p>
          </div>
        </ScrollAnimate>

        {/* Featured */}
        {featured.slice(0, 1).map((course) => (
          <ScrollAnimate key={course.id} direction="scale" duration={700}>
            <div className="mb-12 rounded-2xl overflow-hidden emerald-gradient relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,hsl(38_78%_52%/0.4),transparent_60%)]" />
              <div className="p-8 lg:p-12 relative">
                <div className="inline-block px-3 py-1 rounded-full bg-white/15 text-gold-light text-xs font-semibold mb-3 uppercase tracking-wide">
                  മുഖ്യ കോഴ്‌സ്
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
                  {course.title}
                </h3>
                <p className="text-primary-foreground/85 text-lg leading-relaxed max-w-3xl">
                  {course.description}
                </p>
              </div>
            </div>
          </ScrollAnimate>
        ))}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regular.map((course, index) => (
            <ScrollAnimate key={course.id} direction="up" delay={index * 90} duration={650}>
              <CourseCard course={course} index={index} />
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
