import { useState } from "react";
import { Send, User, CheckCircle, Upload, X, File, Loader2, FileText, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAdmissions } from "@/hooks/useAdmissions";
import { useWebsiteContent, FormField } from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  file: File;
  name: string;
  type: string;
  size: number;
}

const AdmissionFormSection = () => {
  const { submitAdmission } = useAdmissions();
  const { content } = useWebsiteContent();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [studentPhoto, setStudentPhoto] = useState<UploadedFile | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [rulesApproved, setRulesApproved] = useState(false);
  const [showRulesError, setShowRulesError] = useState(false);

  const formConfig = content.admissionForm || {
    title: 'വിദ്യാർത്ഥി അഡ്മിഷൻ അപേക്ഷ',
    subtitle: 'പ്രവേശനം 2025-26',
    description: 'എല്ലാ വിവരങ്ങളും കൃത്യമായി പൂരിപ്പിക്കുക.',
    fields: [],
    institutionRules: '',
    rulesTitle: 'സ്ഥാപനത്തിന്റെ അച്ചടക്ക നിയമങ്ങൾ',
    approvalText: 'ഞാൻ മേൽപ്പറഞ്ഞ നിയമങ്ങൾ വായിക്കുകയും അംഗീകരിക്കുകയും ചെയ്തു',
    submitButtonText: 'അപേക്ഷ സമർപ്പിക്കുക'
  };

  const sortedFields = [...(formConfig.fields || [])].sort((a, b) => a.order - b.order);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ഫയൽ വലുതാണ്!",
          description: "5MB-ൽ കുറവുള്ള ഫയൽ അപ്‌ലോഡ് ചെയ്യുക.",
          variant: "destructive"
        });
        return;
      }
      setStudentPhoto({
        file,
        name: file.name,
        type: file.type,
        size: file.size
      });
    }
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
    const requiredFields = sortedFields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name]?.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "പിശക്!",
        description: `ആവശ്യമായ ഫീൽഡുകൾ പൂരിപ്പിക്കുക: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload student photo if provided
      let imageUrl = null;
      if (studentPhoto) {
        imageUrl = await uploadFileToStorage(studentPhoto.file, 'student-photos');
      }

      // Map form data to database fields
      const admissionData = {
        student_name: formData.studentName || '',
        age: formData.studentAge ? parseInt(formData.studentAge) : null,
        date_of_birth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        guardian_name: formData.guardianName || '',
        guardian_relation: formData.guardianRelation || null,
        guardian_phone: formData.guardianPhone || '',
        guardian_email: formData.guardianEmail || null,
        address: formData.address || null,
        aadhaar_number: formData.aadhaarNumber || null,
        birth_certificate_number: formData.birthCertificateNumber || null,
        previous_school: formData.previousSchool || null,
        tc_number: formData.tcNumber || null,
        selected_course: formData.course || null,
        additional_info: formData.additionalInfo || null,
        image_url: imageUrl
      };

      const result = await submitAdmission(admissionData);
      
      if (result) {
        setSubmitted(true);
        setFormData({});
        setStudentPhoto(null);
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

  const renderField = (field: FormField) => {
    const baseInputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            rows={3}
            className={`${baseInputClass} resize-none`}
            placeholder={field.placeholder}
          />
        );
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
          >
            <option value="">തിരഞ്ഞെടുക്കുക</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
            placeholder={field.placeholder}
          />
        );
      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        );
      default:
        return (
          <input
            type="text"
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
            placeholder={field.placeholder}
          />
        );
    }
  };

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
            {/* Student Photo */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">വിദ്യാർത്ഥിയുടെ ഫോട്ടോ</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  പാസ്പോർട്ട് സൈസ് ഫോട്ടോ
                </label>
                {studentPhoto ? (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <File className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{studentPhoto.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(studentPhoto.size)}</p>
                    </div>
                    <Button 
                      type="button"
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setStudentPhoto(null)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label 
                    htmlFor="student-photo-upload"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">ഫയൽ അപ്‌ലോഡ് ചെയ്യുക</span>
                    <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</span>
                    <input
                      id="student-photo-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Dynamic Form Fields */}
            <div className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">വിവരങ്ങൾ പൂരിപ്പിക്കുക</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                {sortedFields.map(field => (
                  <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {field.label} {field.required && '*'}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
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
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    സമർപ്പിക്കുന്നു...
                  </>
                ) : (
                  <>
                    {formConfig.submitButtonText}
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
            
            {!rulesApproved && formConfig.institutionRules && (
              <p className="text-center text-sm text-muted-foreground">
                സമർപ്പിക്കാൻ മുകളിലുള്ള നിയമങ്ങൾ വായിച്ച് അംഗീകരിക്കുക
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFormSection;