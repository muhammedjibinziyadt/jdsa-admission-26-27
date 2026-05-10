import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, CheckCircle, User, Phone, MapPin, BookOpen, Calendar, FileText, Clock, Users, Briefcase, ClipboardCheck, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudentsPortal } from "@/hooks/useStudentsPortal";
import CommitteesGrid from "@/components/committee/CommitteesGrid";
import AttendanceSection from "@/components/AttendanceSection";
import ComputerSection from "@/components/ComputerSection";
import SectionLockGate, { useSectionLock, SectionLockButton, ProtectedSection } from "@/components/SectionLock";

const StudentsPortal = () => {
  const committeeLock = useSectionLock('committee');
  const computerLock = useSectionLock('computer');
  const attendanceLock = useSectionLock('attendance');
  const { submitStudent, students, loading } = useStudentsPortal();
  const [activeView, setActiveView] = useState<'form' | 'computer' | 'students' | 'committee' | 'attendance'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    phone1: '',
    phone2: '',
    year_of_admission: '',
    previous_madrasa: '',
    address: '',
    current_education: '',
  });

  const [files, setFiles] = useState<{
    photo?: File;
    birthCert?: File;
    aadhaar?: File;
  }>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.student_name.trim()) errs.student_name = 'പേര് ആവശ്യമാണ്';
    if (!formData.father_name.trim()) errs.father_name = 'പിതാവിന്റെ പേര് ആവശ്യമാണ്';
    if (!formData.phone1.trim()) errs.phone1 = 'ഫോൺ നമ്പർ ആവശ്യമാണ്';
    else if (!/^\d{10}$/.test(formData.phone1.trim())) errs.phone1 = '10 അക്ക ഫോൺ നമ്പർ നൽകുക';
    if (formData.phone2 && !/^\d{10}$/.test(formData.phone2.trim())) errs.phone2 = '10 അക്ക ഫോൺ നമ്പർ നൽകുക';
    if (!formData.year_of_admission.trim()) errs.year_of_admission = 'പ്രവേശന വർഷം ആവശ്യമാണ്';
    if (!formData.address.trim()) errs.address = 'വിലാസം ആവശ്യമാണ്';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const success = await submitStudent(
      {
        student_name: formData.student_name.trim(),
        father_name: formData.father_name.trim(),
        phone1: formData.phone1.trim(),
        phone2: formData.phone2.trim() || null,
        year_of_admission: formData.year_of_admission.trim(),
        previous_madrasa: formData.previous_madrasa.trim() || null,
        address: formData.address.trim(),
        current_education: formData.current_education.trim() || null,
      },
      files
    );
    setSubmitting(false);
    if (success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-800">രജിസ്ട്രേഷൻ വിജയകരം!</h2>
          <p className="text-gray-600">നിങ്ങളുടെ വിദ്യാർത്ഥി രജിസ്ട്രേഷൻ വിജയകരമായി സമർപ്പിച്ചു.</p>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={() => { setSubmitted(false); setFormData({ student_name: '', father_name: '', phone1: '', phone2: '', year_of_admission: '', previous_madrasa: '', address: '', current_education: '' }); setFiles({}); }} variant="outline" className="border-emerald-300 text-emerald-700">
              പുതിയ രജിസ്ട്രേഷൻ
            </Button>
            <Link to="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700">ഹോം പേജ്</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20";

  const inputClassFinal = inputClass;


  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-emerald-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Link to="/" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4" /> ഹോം പേജിലേക്ക്
            </Link>
            <PortalLockButton onLock={lock} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">വിദ്യാർത്ഥി പോർട്ടൽ</h1>
          <p className="text-emerald-200 mt-1">Students Portal</p>
        </div>
      </div>

      {/* Sticky Menu Bar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-emerald-100 shadow-sm">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-hide">
            {[
              { id: 'form', label: 'രജിസ്ട്രേഷൻ', icon: User },
              { id: 'attendance', label: 'അറ്റൻഡൻസ്', icon: ClipboardCheck },
              { id: 'computer', label: 'കമ്പ്യൂട്ടർ', icon: Monitor },
              { id: 'students', label: 'വിദ്യാർത്ഥി ലിസ്റ്റ്', icon: Users },
              { id: 'committee', label: 'കമ്മിറ്റി', icon: Briefcase },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveView(id as typeof activeView)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {activeView === 'attendance' ? (
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <AttendanceSection />
        </div>
      ) : activeView === 'committee' ? (
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="mb-4 text-center">
            <p className="text-sm text-emerald-700/70">കമ്മിറ്റി തിരഞ്ഞെടുക്കുക</p>
          </div>
          <CommitteesGrid />
          <div className="mt-4 text-center">
            <Link to="/committee" className="inline-block text-sm text-emerald-700 hover:text-emerald-900 underline">
              അല്ലെങ്കിൽ കമ്മിറ്റി ഹബ്ബിലേക്ക് നേരിട്ട് പോകുക →
            </Link>
          </div>
        </div>
      ) : activeView === 'students' ? (
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> സമർപ്പിച്ച വിദ്യാർത്ഥികൾ
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ഇതുവരെ രജിസ്ട്രേഷനുകൾ ഇല്ല</p>
            ) : (
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between px-4 py-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-emerald-500 bg-emerald-100 rounded-full w-7 h-7 flex items-center justify-center">{index + 1}</span>
                      <span className="font-medium text-gray-800">{student.student_name}</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      Submitted <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeView === 'computer' ? (
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <ComputerSection />
        </div>
      ) : (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-lg mb-2">
              <User className="w-5 h-5" /> വ്യക്തിഗത വിവരങ്ങൾ
            </div>

            <div>
              <Label className="text-gray-700">വിദ്യാർത്ഥിയുടെ പൂർണ്ണ നാമം *</Label>
              <Input value={formData.student_name} onChange={e => setFormData(p => ({ ...p, student_name: e.target.value }))} className={inputClass} placeholder="Full Name" />
              {errors.student_name && <p className="text-red-500 text-xs mt-1">{errors.student_name}</p>}
            </div>

            <div>
              <Label className="text-gray-700">പിതാവിന്റെ പേര് *</Label>
              <Input value={formData.father_name} onChange={e => setFormData(p => ({ ...p, father_name: e.target.value }))} className={inputClass} placeholder="Father's Name" />
              {errors.father_name && <p className="text-red-500 text-xs mt-1">{errors.father_name}</p>}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-lg mb-2">
              <Phone className="w-5 h-5" /> ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ
            </div>

            <div>
              <Label className="text-gray-700">ഫോൺ നമ്പർ 1 *</Label>
              <Input value={formData.phone1} onChange={e => setFormData(p => ({ ...p, phone1: e.target.value }))} className={inputClass} placeholder="Phone Number 1" type="tel" maxLength={10} />
              {errors.phone1 && <p className="text-red-500 text-xs mt-1">{errors.phone1}</p>}
            </div>

            <div>
              <Label className="text-gray-700">ഫോൺ നമ്പർ 2 (ഓപ്ഷണൽ)</Label>
              <Input value={formData.phone2} onChange={e => setFormData(p => ({ ...p, phone2: e.target.value }))} className={inputClass} placeholder="Phone Number 2" type="tel" maxLength={10} />
              {errors.phone2 && <p className="text-red-500 text-xs mt-1">{errors.phone2}</p>}
            </div>

            <div>
              <Label className="text-gray-700">പൂർണ്ണ വിലാസം *</Label>
              <textarea value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} className={`w-full px-3 py-2 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none resize-none ${inputClass}`} rows={3} placeholder="Full Address" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-lg mb-2">
              <BookOpen className="w-5 h-5" /> വിദ്യാഭ്യാസ വിവരങ്ങൾ
            </div>

            <div>
              <Label className="text-gray-700">ദർസിലേക്കുള്ള പ്രവേശന വർഷം *</Label>
              <Input value={formData.year_of_admission} onChange={e => setFormData(p => ({ ...p, year_of_admission: e.target.value }))} className={inputClass} placeholder="Year of Admission (e.g., 2025)" />
              {errors.year_of_admission && <p className="text-red-500 text-xs mt-1">{errors.year_of_admission}</p>}
            </div>

            <div>
              <Label className="text-gray-700">മുമ്പ് പഠിച്ച മദ്രസയുടെ പേര്</Label>
              <Input value={formData.previous_madrasa} onChange={e => setFormData(p => ({ ...p, previous_madrasa: e.target.value }))} className={inputClass} placeholder="Name of Previous Madrasa" />
            </div>

            <div>
              <Label className="text-gray-700">നിലവിലെ ഭൗതിക വിദ്യാഭ്യാസം</Label>
              <Input value={formData.current_education} onChange={e => setFormData(p => ({ ...p, current_education: e.target.value }))} className={inputClass} placeholder="Current Secular Education" />
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-lg mb-2">
              <FileText className="w-5 h-5" /> ഡോക്യുമെന്റുകൾ
            </div>

            <FileUploadField label="വിദ്യാർത്ഥിയുടെ ഫോട്ടോ" accept="image/jpeg,image/png" file={files.photo} onChange={f => setFiles(p => ({ ...p, photo: f }))} />
            <FileUploadField label="ജനന സർട്ടിഫിക്കറ്റ്" accept="image/*,application/pdf" file={files.birthCert} onChange={f => setFiles(p => ({ ...p, birthCert: f }))} />
            <FileUploadField label="ആധാർ കാർഡ്" accept="image/*,application/pdf" file={files.aadhaar} onChange={f => setFiles(p => ({ ...p, aadhaar: f }))} />
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-xl">
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> സമർപ്പിക്കുന്നു...</>
            ) : (
              'സമർപ്പിക്കുക'
            )}
          </Button>
        </form>
      </div>
      )}
    </div>
  );
};

function FileUploadField({ label, accept, file, onChange }: {
  label: string;
  accept: string;
  file?: File;
  onChange: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Label className="text-gray-700">{label}</Label>
      <div
        onClick={() => ref.current?.click()}
        className="mt-1 border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
      >
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { if (e.target.files?.[0]) onChange(e.target.files[0]); }} />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-emerald-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          </div>
        ) : (
          <div className="text-gray-400">
            <Upload className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm">ഫയൽ അപ്‌ലോഡ് ചെയ്യുക</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsPortal;
