import { 
  Mic, 
  PenTool, 
  BookOpen,
  GraduationCap,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrainingSubject {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subjects: TrainingSubject[];
  enabled: boolean;
  order: number;
}

interface TrainingCategoriesSectionProps {
  categories: TrainingCategory[];
  sectionTitle?: string;
  sectionDescription?: string;
}

const iconMap: { [key: string]: typeof Mic } = {
  Mic: Mic,
  PenTool: PenTool,
  BookOpen: BookOpen,
  GraduationCap: GraduationCap,
};

const colorMap: { [key: string]: string } = {
  'speech-training': 'from-purple-500 to-purple-700',
  'writing-training': 'from-amber-500 to-amber-700',
  default: 'from-primary to-primary/80'
};

const TrainingCategoriesSection = ({ 
  categories,
  sectionTitle = 'പ്രത്യേക പരിശീലന പരിപാടികൾ',
  sectionDescription = 'പ്രസംഗവും എഴുത്തും പോലുള്ള കഴിവുകൾ വികസിപ്പിക്കാനുള്ള പ്രത്യേക പരിശീലന പരിപാടികൾ'
}: TrainingCategoriesSectionProps) => {
  const enabledCategories = categories.filter(c => c.enabled);

  if (enabledCategories.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            പരിശീലന പരിപാടികൾ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {sectionDescription}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {enabledCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || BookOpen;
            const gradientColor = colorMap[category.id] || colorMap.default;
            
            return (
              <Card 
                key={category.id}
                className="group relative overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                {/* Header with gradient */}
                <CardHeader className={`bg-gradient-to-r ${gradientColor} text-white pb-6`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">
                        {category.name}
                      </CardTitle>
                      <p className="text-white/80 text-sm mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    പഠിപ്പിക്കുന്ന വിഷയങ്ങൾ
                  </h4>
                  
                  {category.subjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      വിഷയങ്ങൾ ചേർക്കപ്പെട്ടിട്ടില്ല
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {category.subjects
                        .sort((a, b) => a.order - b.order)
                        .map((subject) => (
                          <li 
                            key={subject.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <ChevronRight className={`w-5 h-5 mt-0.5 text-transparent bg-gradient-to-r ${gradientColor} bg-clip-text flex-shrink-0`} 
                              style={{ color: category.id === 'speech-training' ? '#a855f7' : '#f59e0b' }}
                            />
                            <div>
                              <p className="font-medium text-foreground">
                                {subject.title}
                              </p>
                              {subject.description && (
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {subject.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      {category.subjects.length} വിഷയങ്ങൾ
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrainingCategoriesSection;
