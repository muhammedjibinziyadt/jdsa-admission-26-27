import { useState } from "react";
import { Loader2, Trash2, Eye, Download, X, User, Phone, MapPin, BookOpen, Calendar, FileText, Search, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateStudentPDF } from "@/utils/generateStudentPDF";
import { Input } from "@/components/ui/input";
import { useStudentsPortal, StudentRecord } from "@/hooks/useStudentsPortal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StudentsAdminPanel = () => {
  const { students, loading, deleteStudent, getSignedUrl } = useStudentsPortal();
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const filtered = students.filter(s =>
    s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.father_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone1.includes(searchQuery)
  );

  const handleViewFile = async (url: string | null) => {
    if (!url) return;
    setLoadingUrl(url);
    const signed = await getSignedUrl(url);
    setLoadingUrl(null);
    if (signed) window.open(signed, '_blank');
  };

  const handleDownloadFile = async (url: string | null, name: string) => {
    if (!url) return;
    setLoadingUrl(url);
    const signed = await getSignedUrl(url);
    setLoadingUrl(null);
    if (signed) {
      const a = document.createElement('a');
      a.href = signed;
      a.download = name;
      a.target = '_blank';
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Detail view
  if (selectedStudent) {
    const s = selectedStudent;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">വിദ്യാർത്ഥി വിവരങ്ങൾ</h3>
          <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
            <X className="w-4 h-4 mr-1" /> തിരികെ
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={<User className="w-4 h-4" />} label="വിദ്യാർത്ഥിയുടെ പേര്" value={s.student_name} />
          <InfoCard icon={<User className="w-4 h-4" />} label="പിതാവിന്റെ പേര്" value={s.father_name} />
          <InfoCard icon={<Phone className="w-4 h-4" />} label="ഫോൺ 1" value={s.phone1} />
          <InfoCard icon={<Phone className="w-4 h-4" />} label="ഫോൺ 2" value={s.phone2 || 'N/A'} />
          <InfoCard icon={<Calendar className="w-4 h-4" />} label="പ്രവേശന വർഷം" value={s.year_of_admission} />
          <InfoCard icon={<BookOpen className="w-4 h-4" />} label="മുൻ മദ്രസ" value={s.previous_madrasa || 'N/A'} />
          <InfoCard icon={<MapPin className="w-4 h-4" />} label="വിലാസം" value={s.address} className="md:col-span-2" />
          <InfoCard icon={<BookOpen className="w-4 h-4" />} label="ഭൗതിക വിദ്യാഭ്യാസം" value={s.current_education || 'N/A'} />
          <InfoCard icon={<Calendar className="w-4 h-4" />} label="രജിസ്ട്രേഷൻ തീയതി" value={new Date(s.created_at).toLocaleDateString('ml-IN')} />
        </div>

        {/* Documents */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" /> ഡോക്യുമെന്റുകൾ
          </h4>

          {/* Photo */}
          {s.photo_url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">വിദ്യാർത്ഥിയുടെ ഫോട്ടോ</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewFile(s.photo_url)} disabled={loadingUrl === s.photo_url}>
                  {loadingUrl === s.photo_url ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Eye className="w-3 h-3 mr-1" />} കാണുക
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownloadFile(s.photo_url, `${s.student_name}_photo`)}>
                  <Download className="w-3 h-3 mr-1" /> ഡൗൺലോഡ്
                </Button>
              </div>
            </div>
          )}

          {/* Birth Certificate */}
          {s.birth_certificate_url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">ജനന സർട്ടിഫിക്കറ്റ്</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewFile(s.birth_certificate_url)} disabled={loadingUrl === s.birth_certificate_url}>
                  {loadingUrl === s.birth_certificate_url ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Eye className="w-3 h-3 mr-1" />} കാണുക
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownloadFile(s.birth_certificate_url, `${s.student_name}_birth_cert`)}>
                  <Download className="w-3 h-3 mr-1" /> ഡൗൺലോഡ്
                </Button>
              </div>
            </div>
          )}

          {/* Aadhaar */}
          {s.aadhaar_url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">ആധാർ കാർഡ്</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewFile(s.aadhaar_url)} disabled={loadingUrl === s.aadhaar_url}>
                  {loadingUrl === s.aadhaar_url ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Eye className="w-3 h-3 mr-1" />} കാണുക
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownloadFile(s.aadhaar_url, `${s.student_name}_aadhaar`)}>
                  <Download className="w-3 h-3 mr-1" /> ഡൗൺലോഡ്
                </Button>
              </div>
            </div>
          )}

          {!s.photo_url && !s.birth_certificate_url && !s.aadhaar_url && (
            <p className="text-muted-foreground text-sm">ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല.</p>
          )}
        </div>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-1" /> ഡിലീറ്റ് ചെയ്യുക
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ഈ റെക്കോർഡ് ഡിലീറ്റ് ചെയ്യണോ?</AlertDialogTitle>
              <AlertDialogDescription>ഈ പ്രവർത്തനം പഴയപടിയാക്കാൻ കഴിയില്ല.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>റദ്ദാക്കുക</AlertDialogCancel>
              <AlertDialogAction onClick={() => { deleteStudent(s.id); setSelectedStudent(null); }}>ഡിലീറ്റ്</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">വിദ്യാർത്ഥി പോർട്ടൽ ({students.length})</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="പേര് / ഫോൺ നമ്പർ തിരയുക..."
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">വിദ്യാർത്ഥികൾ ഇല്ല.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{s.student_name}</p>
                  <p className="text-sm text-muted-foreground">{s.father_name} · {s.phone1}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString('ml-IN')}</p>
                  <p className="text-xs text-primary">{s.year_of_admission}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function InfoCard({ icon, label, value, className = '' }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div className={`bg-card rounded-xl border border-border p-4 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        {icon} {label}
      </div>
      <p className="text-foreground font-medium">{value}</p>
    </div>
  );
}

export default StudentsAdminPanel;
