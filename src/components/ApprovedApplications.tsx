import { User, Phone, BookOpen } from 'lucide-react';

interface Application {
  id: string;
  student_name: string;
  guardian_name: string;
  guardian_phone: string;
  selected_course: string | null;
  image_url: string | null;
  additional_info: string | null;
  created_at: string;
}

interface ApprovedApplicationsProps {
  applications: Application[];
}

const ApprovedApplications = ({ applications }: ApprovedApplicationsProps) => {
  if (!applications || applications.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-4">
            വിദ്യാർത്ഥികൾ
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            പ്രവേശനം ലഭിച്ച <span className="gold-text">വിദ്യാർത്ഥികൾ</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {applications.map((app) => (
            <div key={app.id} className="bg-card rounded-xl overflow-hidden shadow-soft card-hover">
              {app.image_url ? (
                <div className="aspect-square overflow-hidden">
                  <img src={app.image_url} alt={app.student_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <User className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{app.student_name}</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" /> <span>{app.guardian_name}</span>
                  </div>
                  {app.selected_course && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-4 h-4" /> <span>{app.selected_course}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" /> <span>{app.guardian_phone}</span>
                  </div>
                </div>
                {app.additional_info && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{app.additional_info}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApprovedApplications;