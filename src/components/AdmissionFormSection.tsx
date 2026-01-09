import { useState } from "react";
import { Send, User, CheckCircle, Upload, X, File, Loader2, FileText, ScrollText, Image, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAdmissions } from "@/hooks/useAdmissions";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  file: File;
  name: string;
  type: string;
  size: number;
}

interface DocumentUploads {
  studentPhoto: UploadedFile | null;
  aadhaarCard: UploadedFile | null;
  birthCertificate: UploadedFile | null;
  tcCopy: UploadedFile | null;
}

const AdmissionFormSection = () => {
  const { submitAdmission } = useAdmissions();
  const { content } = useWebsiteContent();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentUploads>({
    studentPhoto: null,
    aadhaarCard: null,
    birthCertificate: null,
    tcCopy: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [rulesApproved, setRulesApproved] = useState(false);
  const [showRulesError, setShowRulesError] = useState(false);

  const formConfig = content.admissionForm || {
    title: 'വിദ്യാർത്ഥി അഡ്മിഷൻ അപേക്ഷ',
    subtitle: 'പ്രവേശനം 2025-26',
    description: 'എല്ലാ വിവരങ്ങളും കൃത്യമായി പൂരിപ്പിക്കുക.',
    institutionRules: '',
    rulesTitle: 'സ്ഥാപനത്തിന്റെ അച്ചടക്ക നിയമങ്ങൾ',
    approvalText: 'ഞാൻ മേൽപ്പറഞ്ഞ നിയമങ്ങൾ വായിക്കുകയും അംഗീകരിക്കുകയും ചെയ്തു',
    submitButtonText: 'അപേക്ഷ സമർപ്പിക്കുക'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (docType: keyof DocumentUploads, maxSize: number = 5) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "ഫയൽ വലുതാണ്!",
          description: `${maxSize}MB-ൽ കുറവുള്ള ഫയൽ അപ്‌ലോഡ് ചെയ്യുക.`,
          variant: "destructive"
        });
        return;
      }
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          file,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }));
    }
  };

  const removeDocument = (docType: keyof DocumentUploads) => {
    setDocuments(prev => ({ ...prev, [docType]: null }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const uploadFileToStorage = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if rules are approved
    if (!rulesApproved) {
      setShowRulesError(true);
      toast({
        title: "നിയമങ്ങൾ അംഗീകരിക്കുക",
        description: "തുടരാൻ സ്ഥാപന നിയമങ്ങൾ വായിച്ച് അംഗീകരിക്കുക.",
        variant: "destructive"
      });
      return;
    }

    // Check required fields
    const requiredFields = ['studentName', 'studentAge', 'dateOfBirth', 'guardianName', 'guardianPhone', 'address'];
    const missingFields = requiredFields.filter(f => !formData[f]?.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "പിശക്!",
        description: "ആവശ്യമായ എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക.",
        variant: "destructive"
      });
      return;
    }

    // Check required documents
    if (!documents.studentPhoto || !documents.aadhaarCard || !documents.birthCertificate || !documents.tcCopy) {
      toast({
        title: "ഡോക്യുമെന്റുകൾ ആവശ്യമാണ്!",
        description: "എല്ലാ ഡോക്യുമെന്റുകളും അപ്‌ലോഡ് ചെയ്യുക.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload all documents
      const [photoUrl, aadhaarUrl, birthCertUrl, tcUrl] = await Promise.all([
        uploadFileToStorage(documents.studentPhoto.file, 'student-photos'),
        uploadFileToStorage(documents.aadhaarCard.file, 'aadhaar-cards'),
        uploadFileToStorage(documents.birthCertificate.file, 'birth-certificates'),
        uploadFileToStorage(documents.tcCopy.file, 'tc-copies')
      ]);

      // Map form data to database fields
      const admissionData = {
        student_name: formData.studentName || '',
        age: formData.studentAge ? parseInt(formData.studentAge) : null,
        date_of_birth: formData.dateOfBirth || null,
        gender: null,
        guardian_name: formData.guardianName || '',
        guardian_relation: null,
        guardian_phone: formData.guardianPhone || '',
        guardian_email: formData.guardianEmail || null,
        address: formData.address || null,
        aadhaar_number: null,
        birth_certificate_number: null,
        previous_school: formData.previousSchool || null,
        tc_number: null,
        selected_course: null,
        additional_info: JSON.stringify({
          madarasaLevel: formData.madarasaLevel || '',
          madarasaName: formData.madarasaName || '',
          notes: formData.additionalInfo || '',
          documents: {
            photo: photoUrl,
            aadhaar: aadhaarUrl,
            birthCertificate: birthCertUrl,
            tc: tcUrl
          }
        }),
        image_url: photoUrl
      };

      const result = await submitAdmission(admissionData);
      
      if (result) {
        setSubmitted(true);
        setFormData({});
        setDocuments({
          studentPhoto: null,
          aadhaarCard: null,
          birthCertificate: null,
          tcCopy: null
        });
        setRulesApproved(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "പിശക്!",
        description: "അപേക്ഷ സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="admission-form" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-card rounded-3xl p-10 shadow-soft border border-border/50">
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
              <Button 
                onClick={() => setSubmitted(false)} 
                className="rounded-xl gold-bg text-primary"
              >
                പുതിയ അപേക്ഷ സമർപ്പിക്കുക
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const baseInputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  const renderDocumentUpload = (
    docType: keyof DocumentUploads,
    label: string,
    icon: React.ReactNode,
    accept: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label} *
      </label>
      {documents[docType] ? (
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{documents[docType]!.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(documents[docType]!.size)}</p>
          </div>
          <Button 
            type="button"
            size="sm" 
            variant="ghost" 
            onClick={() => removeDocument(docType)}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label 
          htmlFor={`${docType}-upload`}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          {icon}
          <span className="text-sm text-muted-foreground mt-2">ഫയൽ അപ്‌ലോഡ് ചെയ്യുക</span>
          <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</span>
          <input
            id={`${docType}-upload`}
            type="file"
            accept={accept}
            onChange={handleDocumentUpload(docType)}
            className="hidden"
          />
        </label>
      )}
    </div>
  );

  return (
    <section id="admission-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Form Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
              {formConfig.subtitle}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {formConfig.title?.split(' ').slice(0, -1).join(' ')}
              <span className="gold-text"> {formConfig.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {formConfig.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Photo Upload */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <Image className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">വിദ്യാർത്ഥിയുടെ ഫോട്ടോ</h3>
              </div>
              {renderDocumentUpload('studentPhoto', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', <User className="w-8 h-8 text-muted-foreground" />, '.jpg,.jpeg,.png')}
            </div>

            {/* Student Details */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    വിദ്യാർത്ഥിയുടെ പേര് *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName || ''}
                    onChange={handleChange}
                    required
                    className={baseInputClass}
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
                    value={formData.studentAge || ''}
                    onChange={handleChange}
                    required
                    className={baseInputClass}
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
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    required
                    className={baseInputClass}
                  />
                </div>
              </div>
            </div>

            {/* Guardian Details */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">രക്ഷിതാവിന്റെ വിവരങ്ങൾ</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    രക്ഷിതാവിന്റെ പേര് *
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName || ''}
                    onChange={handleChange}
                    required
                    className={baseInputClass}
                    placeholder="രക്ഷിതാവിന്റെ പൂർണ്ണ നാമം"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ഫോൺ നമ്പർ *
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone || ''}
                    onChange={handleChange}
                    required
                    className={baseInputClass}
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
                    value={formData.guardianEmail || ''}
                    onChange={handleChange}
                    className={baseInputClass}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    മേൽവിലാസം *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={`${baseInputClass} resize-none`}
                    placeholder="പൂർണ്ണ മേൽവിലാസം"
                  />
                </div>
              </div>
            </div>

            {/* Madarasa Education Details */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">മദ്രസ പഠന വിവരങ്ങൾ</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    മദ്രസ എത്ര വരെ പഠിച്ചു
                  </label>
                  <input
                    type="text"
                    name="madarasaLevel"
                    value={formData.madarasaLevel || ''}
                    onChange={handleChange}
                    className={baseInputClass}
                    placeholder="ഉദാ: 5-ാം ക്ലാസ്"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    മദ്രസയുടെ പേര്
                  </label>
                  <input
                    type="text"
                    name="madarasaName"
                    value={formData.madarasaName || ''}
                    onChange={handleChange}
                    className={baseInputClass}
                    placeholder="മദ്രസയുടെ പേര്"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    മുൻ സ്കൂൾ
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool || ''}
                    onChange={handleChange}
                    className={baseInputClass}
                    placeholder="മുൻ വിദ്യാലയത്തിന്റെ പേര്"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്യുക</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {renderDocumentUpload('aadhaarCard', 'ആധാർ കാർഡ് കോപ്പി', <FileText className="w-8 h-8 text-muted-foreground" />, '.pdf,.jpg,.jpeg,.png')}
                {renderDocumentUpload('birthCertificate', 'ജനന സർട്ടിഫിക്കറ്റ് കോപ്പി', <File className="w-8 h-8 text-muted-foreground" />, '.pdf,.jpg,.jpeg,.png')}
                {renderDocumentUpload('tcCopy', 'TC കോപ്പി', <FileText className="w-8 h-8 text-muted-foreground" />, '.pdf,.jpg,.jpeg,.png')}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">അധിക വിവരങ്ങൾ</h3>
              </div>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo || ''}
                onChange={handleChange}
                rows={3}
                className={`${baseInputClass} resize-none`}
                placeholder="എന്തെങ്കിലും പ്രത്യേക കാര്യങ്ങൾ അറിയിക്കണമെങ്കിൽ ഇവിടെ എഴുതുക..."
              />
            </div>

            {/* Institution Rules Section */}
            {formConfig.institutionRules && (
              <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                    <ScrollText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {formConfig.rulesTitle}
                  </h3>
                </div>
                
                {/* Scrollable Rules Document */}
                <div className="bg-muted/30 rounded-xl border border-border p-6 max-h-80 overflow-y-auto mb-6">
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {formConfig.institutionRules}
                  </div>
                </div>

                {/* Approval Checkbox */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors ${
                  showRulesError && !rulesApproved 
                    ? 'border-destructive bg-destructive/5' 
                    : rulesApproved 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-muted/30'
                }`}>
                  <Checkbox
                    id="rules-approval"
                    checked={rulesApproved}
                    onCheckedChange={(checked) => {
                      setRulesApproved(checked === true);
                      if (checked) setShowRulesError(false);
                    }}
                    className="mt-1"
                  />
                  <label 
                    htmlFor="rules-approval" 
                    className="text-sm font-medium text-foreground cursor-pointer leading-relaxed"
                  >
                    {formConfig.approvalText}
                  </label>
                </div>
                {showRulesError && !rulesApproved && (
                  <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    തുടരാൻ നിയമങ്ങൾ അംഗീകരിക്കുക
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={submitting || !rulesApproved}
                className={`font-semibold px-12 py-6 text-lg rounded-2xl shadow-gold transition-all duration-300 ${
                  rulesApproved 
                    ? 'gold-bg text-primary hover:scale-[1.02]' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    സമർപ്പിക്കുന്നു...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {formConfig.submitButtonText}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFormSection;
