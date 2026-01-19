import { useState, useRef } from 'react';
import { 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  FileText, 
  ClipboardList,
  Upload,
  Download,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdmissions, Admission } from '@/hooks/useAdmissions';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

const AdmissionsManager = () => {
  const { admissions, updateAdmission, deleteAdmission } = useAdmissions();
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadingDocFor, setUploadingDocFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteAdmission(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleDocumentUpload = async (admissionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocFor(admissionId);
    try {
      const url = await uploadImage(file, 'documents');
      if (url) {
        await updateAdmission(admissionId, { 
          confirmation_document_url: url 
        } as Partial<Admission>);
        toast({
          title: "ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്തു!",
          description: "വിദ്യാർത്ഥി പാലിക്കേണ്ട കാര്യങ്ങൾ ഫയൽ സേവ് ചെയ്തു"
        });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "പിശക്!",
        description: "ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല",
        variant: "destructive"
      });
    } finally {
      setUploadingDocFor(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = async (admissionId: string) => {
    await updateAdmission(admissionId, { 
      confirmation_document_url: null 
    } as Partial<Admission>);
    toast({
      title: "ഡോക്യുമെന്റ് നീക്കം ചെയ്തു",
      description: "ഫയൽ വിജയകരമായി നീക്കം ചെയ്തു"
    });
  };

  if (admissions.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-soft text-center">
        <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">അപേക്ഷകൾ ഇല്ല</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {admissions.map(admission => {
          // Parse additional_info for documents
          let additionalData: { 
            documents?: { photo?: string; aadhaar?: string; birthCertificate?: string; tc?: string }; 
            madarasaLevel?: string; 
            madarasaName?: string; 
            notes?: string 
          } = {};
          try {
            if (admission.additional_info) {
              additionalData = JSON.parse(admission.additional_info);
            }
          } catch { additionalData = {}; }
          
          const docs = additionalData.documents || {};
          const confirmationDocUrl = (admission as Admission & { confirmation_document_url?: string }).confirmation_document_url;
          
          return (
            <div key={admission.id} className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <div className="flex flex-col gap-4">
                {/* Header with photo and basic info */}
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {admission.image_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-border">
                      <img src={admission.image_url} alt={admission.student_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground text-lg">{admission.student_name}</h4>
                      {admission.approved ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" /> അംഗീകരിച്ചു
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                          കാത്തിരിക്കുന്നു
                        </span>
                      )}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p><strong>രക്ഷിതാവ്:</strong> {admission.guardian_name}</p>
                      <p><strong>ഫോൺ:</strong> {admission.guardian_phone}</p>
                      <p><strong>വയസ്സ്:</strong> {admission.age || '-'}</p>
                      {additionalData.madarasaLevel && <p><strong>മദ്രസ ലെവൽ:</strong> {additionalData.madarasaLevel}</p>}
                      {additionalData.madarasaName && <p><strong>മദ്രസ:</strong> {additionalData.madarasaName}</p>}
                      {admission.address && <p className="sm:col-span-2"><strong>വിലാസം:</strong> {admission.address}</p>}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      സമർപ്പിച്ചത്: {new Date(admission.created_at).toLocaleDateString('ml-IN')}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant={admission.approved ? "outline" : "default"}
                      onClick={() => updateAdmission(admission.id, { approved: !admission.approved })}
                      className="rounded-lg"
                    >
                      {admission.approved ? <><EyeOff className="w-4 h-4 mr-1" />മറയ്ക്കുക</> : <><Eye className="w-4 h-4 mr-1" />അംഗീകരിക്കുക</>}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                      onClick={() => handleDeleteClick(admission.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Documents Section */}
                {(docs.photo || docs.aadhaar || docs.birthCertificate || docs.tc) && (
                  <div className="border-t border-border pt-4">
                    <h5 className="text-sm font-medium text-foreground mb-3">📄 ഡോക്യുമെന്റുകൾ</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {docs.photo && (
                        <a href={docs.photo} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <img src={docs.photo} alt="Photo" className="w-12 h-12 object-cover rounded mb-2" />
                          <span className="text-xs text-muted-foreground">ഫോട്ടോ</span>
                        </a>
                      )}
                      {docs.aadhaar && (
                        <a href={docs.aadhaar} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <FileText className="w-8 h-8 text-primary mb-2" />
                          <span className="text-xs text-muted-foreground">ആധാർ</span>
                        </a>
                      )}
                      {docs.birthCertificate && (
                        <a href={docs.birthCertificate} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <FileText className="w-8 h-8 text-primary mb-2" />
                          <span className="text-xs text-muted-foreground">ജനന സർട്ടിഫിക്കറ്റ്</span>
                        </a>
                      )}
                      {docs.tc && (
                        <a href={docs.tc} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <FileText className="w-8 h-8 text-primary mb-2" />
                          <span className="text-xs text-muted-foreground">TC</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Confirmation Document Section - Only for approved admissions */}
                {admission.approved && (
                  <div className="border-t border-border pt-4">
                    <h5 className="text-sm font-medium text-foreground mb-3">📋 വിദ്യാർത്ഥി പാലിക്കേണ്ട കാര്യങ്ങൾ</h5>
                    
                    {confirmationDocUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-700 dark:text-green-400">ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്തു</p>
                          <p className="text-xs text-green-600 dark:text-green-500">വിദ്യാർത്ഥിക്ക് ഈ ഫയൽ കാണാനും ഡൗൺലോഡ് ചെയ്യാനും കഴിയും</p>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={confirmationDocUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveDocument(admission.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്തിട്ടില്ല</p>
                          <p className="text-xs text-amber-600 dark:text-amber-500">PDF, Image അല്ലെങ്കിൽ DOC ഫയൽ അപ്‌ലോഡ് ചെയ്യുക</p>
                        </div>
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleDocumentUpload(admission.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingDocFor === admission.id}
                          />
                          <Button 
                            size="sm" 
                            className="rounded-lg"
                            disabled={uploadingDocFor === admission.id}
                          >
                            {uploadingDocFor === admission.id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-1" />
                            )}
                            അപ്‌ലോഡ്
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              അപേക്ഷ ഡിലീറ്റ് ചെയ്യണോ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ഈ അപേക്ഷ സ്ഥിരമായി ഡിലീറ്റ് ചെയ്യപ്പെടും. ഇത് പഴയപടി ആക്കാൻ കഴിയില്ല.
              വെബ്സൈറ്റിൽ നിന്നും ഡാറ്റാബേസിൽ നിന്നും ഈ അപേക്ഷ പൂർണ്ണമായും നീക്കം ചെയ്യപ്പെടും.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>റദ്ദാക്കുക</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ഡിലീറ്റ് ചെയ്യുക
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdmissionsManager;