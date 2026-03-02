import { Phone, Mail, Clock } from "lucide-react";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";

interface ContactContent {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  timing: string;
}

interface ContactSectionProps {
  content: ContactContent;
}

const ContactSection = ({ content }: ContactSectionProps) => {
  const phoneNumber = content.phone1?.replace(/\s/g, '') || '9048696090';
  const displayPhone = content.phone1 || '9048696090';

  return (
    <section id="contact" className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/* Main Helpline Card */}
          <ScrollAnimate direction="up">
            <div className="bg-card rounded-2xl p-8 md:p-10 shadow-soft border border-border text-center">
              <div className="w-16 h-16 rounded-2xl emerald-gradient flex items-center justify-center mx-auto mb-5">
                <Phone className="w-8 h-8 text-primary-foreground" />
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Need Assistance with Admission?
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
                For any queries regarding admission procedures, eligibility, documents, or fee details, please contact our Admission Help Desk.
              </p>

              {/* Phone CTA */}
              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity mb-4"
              >
                <Phone className="w-5 h-5" />
                📞 {displayPhone}
              </a>

              {/* WhatsApp */}
              <ScrollAnimate direction="fade" delay={150}>
                <p className="text-muted-foreground text-sm mt-4">
                  📩 You may also reach us via <a href={`https://wa.me/91${phoneNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">WhatsApp</a> on the same number.
                </p>
              </ScrollAnimate>

              {/* Timing */}
              {content.timing && (
                <ScrollAnimate direction="fade" delay={250}>
                  <div className="mt-5 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>🕒 Available: {content.timing}</span>
                  </div>
                </ScrollAnimate>
              )}
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
