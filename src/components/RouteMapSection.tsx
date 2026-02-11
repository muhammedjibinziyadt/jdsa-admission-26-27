import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";

interface Landmark {
  id: string;
  number: string;
  title: string;
  description: string;
}

interface MapContent {
  embedUrl: string;
  address: string;
  landmarks?: Landmark[];
  landmarksEnabled?: boolean;
}

interface RouteMapSectionProps {
  content: MapContent;
}

const defaultLandmarks: Landmark[] = [
  { id: '1', number: '1', title: 'അടുത്തുള്ള ലാൻഡ്മാർക്ക്', description: 'പ്രധാന റോഡിൽ നിന്ന് 500 മീറ്റർ' },
  { id: '2', number: '2', title: 'ബസ് സ്റ്റോപ്പ്', description: 'സമീപത്തുള്ള ബസ് സ്റ്റോപ്പ് 200 മീറ്റർ' },
  { id: '3', number: '3', title: 'പാർക്കിംഗ്', description: 'സൗജന്യ പാർക്കിംഗ് സൗകര്യം ലഭ്യമാണ്' },
];

const RouteMapSection = ({ content }: RouteMapSectionProps) => {
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5!2d76.27!3d10.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDAyJzI0LjAiTiA3NsKwMTYnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890";
  
  const handleGetDirections = () => {
    window.open(content.embedUrl || "https://maps.app.goo.gl/ZN8C3epBni6h3hKn9?g_st=aw", "_blank");
  };

  const landmarks = content.landmarks && content.landmarks.length > 0 ? content.landmarks : defaultLandmarks;
  const landmarksEnabled = content.landmarksEnabled !== false;

  return (
    <section id="route-map" className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollAnimate direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-4">
              <Navigation className="w-4 h-4" />
              റൂട്ട് മാപ്പ്
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              ഞങ്ങളിലേക്കുള്ള 
              <span className="gold-text"> വഴി</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസിലേക്ക് എത്തിച്ചേരാൻ ഈ മാപ്പ് ഉപയോഗിക്കുക
            </p>
          </div>
        </ScrollAnimate>

        {/* Map */}
        <ScrollAnimate direction="up" delay={100} duration={700}>
          <div className="bg-card rounded-xl overflow-hidden shadow-soft border border-border">
            <div className="aspect-video lg:aspect-[21/9] w-full">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jawharathul Uloom Location"
                className="w-full h-full"
              />
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl emerald-gradient flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {content.address || 'ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്'}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      കേരളം, ഇന്ത്യ
                      <br />
                      <span className="text-sm">(കൃത്യമായ വിലാസത്തിനായി ഞങ്ങളെ ബന്ധപ്പെടുക)</span>
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleGetDirections}
                  className="gold-bg text-primary font-semibold px-8 py-5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  ദിശ കണ്ടെത്തുക
                </Button>
              </div>
            </div>
          </div>
        </ScrollAnimate>

        {/* Landmarks */}
        {landmarksEnabled && landmarks.length > 0 && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landmarks.map((landmark, index) => (
              <ScrollAnimate key={landmark.id} direction="up" delay={index * 100}>
                <div className="bg-card rounded-xl p-5 shadow-soft h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
                      <span className="text-primary font-bold">{landmark.number}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{landmark.title}</h4>
                      <p className="text-sm text-muted-foreground">{landmark.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RouteMapSection;
