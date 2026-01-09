import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, User, Calendar, Users, FileText, GraduationCap, CheckCircle, Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FormData {
  studentName: string;
  studentAge: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  aadhaarNumber: string;
  birthCertificateNumber: string;
  previousSchool: string;
  tcNumber: string;
  course: string;
  additionalInfo: string;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

const AdmissionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentAge: "",
    dateOfBirth: "",
    gender: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
    aadhaarNumber: "",
    birthCertificateNumber: "",
    previousSchool: "",
    tcNumber: "",
    course: "",
    additionalInfo: ""
  });

  const [aadhaarFile, setAadhaarFile] = useState<UploadedFile | null>(null);
  const [birthCertFile, setBirthCertFile] = useState<UploadedFile | null>(null);
  const [tcFile, setTcFile] = useState<UploadedFile | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ഫയൽ വലുതാണ്!",
          description: "5MB-ൽ കുറവുള്ള ഫയൽ അപ്‌ലോഡ് ചെയ്യുക.",
          variant: "destructive"
        });
        return;
      }
      setFile({
        name: file.name,
        type: file.type,
        size: file.size
      });
      toast({
        title: "ഫയൽ അപ്‌ലോഡ് ചെയ്തു!",
        description: `${file.name} വിജയകരമായി ചേർത്തു.`,
      });
    }
  };

  const removeFile = (setFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>) => {
    setFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.studentName || !formData.guardianName || !formData.guardianPhone) {
      toast({
        title: "പിശക്!",
        description: "ആവശ്യമായ എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to a backend
    console.log("Form submitted:", formData);
    console.log("Files:", { aadhaarFile, birthCertFile, tcFile });
    setSubmitted(true);
    toast({
      title: "അപേക്ഷ സമർപ്പിച്ചു!",
      description: "നിങ്ങളുടെ അഡ്മിഷൻ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl p-10 text-center max-w-md shadow-soft border border-border/50">
          <div className="w-20 h-20 rounded-full emerald-gradient flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            അപേക്ഷ സമർപ്പിച്ചു!
          </h2>
          <p className="text-muted-foreground mb-8">
            നിങ്ങളുടെ അഡ്മിഷൻ അപേക്ഷ വിജയകരമായി ലഭിച്ചു. 
            ഉടൻ തന്നെ ഞങ്ങൾ നിങ്ങളെ ബന്ധപ്പെടുന്നതാണ്.
          </p>
          <Link to="/">
            <Button className="rounded-xl gold-bg text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ഹോം പേജിലേക്ക് മടങ്ങുക
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const FileUploadBox = ({ 
    label, 
    file, 
    setFile, 
    inputId,
    required = false
  }: { 
    label: string; 
    file: UploadedFile | null; 
    setFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>;
    inputId: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} {required && '*'}
      </label>
      {file ? (
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <File className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <Button 
            type="button"
            size="sm" 
            variant="ghost" 
            onClick={() => removeFile(setFile)}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label 
          htmlFor={inputId}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">ഫയൽ അപ്‌ലോഡ് ചെയ്യുക</span>
          <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</span>
          <input
            id={inputId}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, setFile)}
            className="hidden"
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>ഹോം</span>
            </Link>
            <h1 className="font-display text-xl font-bold text-foreground">അഡ്മിഷൻ ഫോം</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Form Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
              പ്രവേശനം 2025-26
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              വിദ്യാർത്ഥി അഡ്മിഷൻ
              <span className="gold-text"> അപേക്ഷ</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              എല്ലാ വിവരങ്ങളും കൃത്യമായി പൂരിപ്പിക്കുക. * അടയാളപ്പെടുത്തിയ ഫീൽഡുകൾ നിർബന്ധമാണ്.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    വിദ്യാർത്ഥിയുടെ പേര് *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="പൂർണ്ണ നാമം"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    വയസ്സ് *
                  </label>
                  <input
                    type="number"
                    name="studentAge"
                    value={formData.studentAge}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="വയസ്സ്"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ജനനതീയതി *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ലിംഗഭേദം *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">തിരഞ്ഞെടുക്കുക</option>
                    <option value="male">ആൺ</option>
                    <option value="female">പെൺ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">രക്ഷിതാവിന്റെ വിവരങ്ങൾ</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    രക്ഷിതാവിന്റെ പേര് *
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="രക്ഷിതാവിന്റെ പൂർണ്ണ നാമം"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ബന്ധം *
                  </label>
                  <select
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">തിരഞ്ഞെടുക്കുക</option>
                    <option value="father">പിതാവ്</option>
                    <option value="mother">മാതാവ്</option>
                    <option value="guardian">രക്ഷാകർത്താവ്</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ഫോൺ നമ്പർ *
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ഇമെയിൽ
                  </label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    മേൽവിലാസം *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="പൂർണ്ണ മേൽവിലാസം"
                  />
                </div>
              </div>
            </div>

            {/* Legal Documents */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">നിയമപരമായ രേഖകൾ</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ആധാർ കാർഡ് നമ്പർ *
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    required
                    maxLength={12}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ജനന സർട്ടിഫിക്കറ്റ് നമ്പർ
                  </label>
                  <input
                    type="text"
                    name="birthCertificateNumber"
                    value={formData.birthCertificateNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="സർട്ടിഫിക്കറ്റ് നമ്പർ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    മുൻ സ്കൂൾ
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="മുൻ വിദ്യാലയത്തിന്റെ പേര്"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    TC നമ്പർ
                  </label>
                  <input
                    type="text"
                    name="tcNumber"
                    value={formData.tcNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="ട്രാൻസ്ഫർ സർട്ടിഫിക്കറ്റ് നമ്പർ"
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium text-foreground mb-4">ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്യുക</h4>
                <div className="grid sm:grid-cols-3 gap-5">
                  <FileUploadBox 
                    label="ആധാർ കാർഡ്" 
                    file={aadhaarFile} 
                    setFile={setAadhaarFile}
                    inputId="aadhaar-upload"
                    required
                  />
                  <FileUploadBox 
                    label="ജനന സർട്ടിഫിക്കറ്റ്" 
                    file={birthCertFile} 
                    setFile={setBirthCertFile}
                    inputId="birth-cert-upload"
                  />
                  <FileUploadBox 
                    label="സ്കൂൾ TC" 
                    file={tcFile} 
                    setFile={setTcFile}
                    inputId="tc-upload"
                  />
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">കോഴ്‌സ് തിരഞ്ഞെടുപ്പ്</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    കോഴ്‌സ് *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">കോഴ്‌സ് തിരഞ്ഞെടുക്കുക</option>
                    <option value="suffa">സുഫ്ഫാ കോഴ്‌സിന് കീഴിലെ ദർസ്</option>
                    <option value="quran">ഖുർആൻ പഠനം</option>
                    <option value="computer">കമ്പ്യൂട്ടർ പഠനം</option>
                    <option value="writing">എഴുത്ത് പഠനം</option>
                    <option value="speech">പ്രസംഗ പരിശീലനം</option>
                    <option value="waal">വഅള് പരിശീലനം</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    അധിക വിവരങ്ങൾ
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="എന്തെങ്കിലും പ്രത്യേക കാര്യങ്ങൾ അറിയിക്കണമെങ്കിൽ ഇവിടെ എഴുതുക..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="gold-bg text-primary font-semibold px-12 py-6 text-lg rounded-2xl shadow-gold hover:scale-[1.02] transition-all duration-300"
              >
                അപേക്ഷ സമർപ്പിക്കുക
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
