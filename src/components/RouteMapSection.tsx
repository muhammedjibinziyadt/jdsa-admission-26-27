import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const RouteMapSection = () => {
  // Replace with your actual Google Maps embed URL or coordinates
  const googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.9!2d76.2!3d10.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDAzJzAwLjAiTiA3NsKwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890";
  
  const handleGetDirections = () => {
    // Replace with your actual coordinates
    window.open("https://www.google.com/maps/dir/?api=1&destination=10.0,76.2", "_blank");
  };

  return (
    <section id="route-map" className="py-24 lg:py-32 relative bg-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Navigation className="w-4 h-4" />
            റൂട്ട് മാപ്പ്
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            ഞങ്ങളിലേക്കുള്ള 
            <span className="gold-text"> വഴി</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസിലേക്ക് എത്തിച്ചേരാൻ ഈ മാപ്പ് ഉപയോഗിക്കുക
          </p>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div className="bg-card rounded-3xl overflow-hidden shadow-elevated border border-border/50">
            {/* Map Embed */}
            <div className="aspect-video lg:aspect-[21/9] w-full">
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jawharathul Uloom Location"
                className="w-full h-full"
              />
            </div>

            {/* Map Info Card */}
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl emerald-gradient flex items-center justify-center shadow-soft flex-shrink-0">
                    <MapPin className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      ജവ്ഹറത്തുൽ ഉലൂം സുഫ്ഫാ ദർസ്
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      കേരളം, ഇന്ത്യ
                      <br />
                      <span className="text-sm">
                        (കൃത്യമായ വിലാസത്തിനായി ഞങ്ങളെ ബന്ധപ്പെടുക)
                      </span>
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleGetDirections}
                  className="gold-bg text-primary font-semibold px-8 py-6 rounded-xl shadow-gold hover:scale-[1.02] transition-all duration-300"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  ദിശ കണ്ടെത്തുക
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Landmarks */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">അടുത്തുള്ള ലാൻഡ്മാർക്ക്</h4>
                <p className="text-sm text-muted-foreground">പ്രധാന റോഡിൽ നിന്ന് 500 മീറ്റർ</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">ബസ് സ്റ്റോപ്പ്</h4>
                <p className="text-sm text-muted-foreground">സമീപത്തുള്ള ബസ് സ്റ്റോപ്പ് 200 മീറ്റർ</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">പാർക്കിംഗ്</h4>
                <p className="text-sm text-muted-foreground">സൗജന്യ പാർക്കിംഗ് സൗകര്യം ലഭ്യമാണ്</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteMapSection;
