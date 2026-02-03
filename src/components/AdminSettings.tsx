import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Check, AlertCircle, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminCredentials } from '@/hooks/useAdminCredentials';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { updating, getCurrentEmail, updateEmail, updatePassword } = useAdminCredentials();
  const { toast } = useToast();

  // Email state
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailVerifyPassword, setEmailVerifyPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Load current email on mount
  useEffect(() => {
    const loadEmail = async () => {
      const email = await getCurrentEmail();
      if (email) {
        setCurrentEmail(email);
      }
    };
    loadEmail();
  }, [getCurrentEmail]);

  // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);

    const result = await updateEmail(newEmail, emailVerifyPassword);
    
    if (result.success) {
      setEmailSuccess(true);
      setCurrentEmail(newEmail);
      setNewEmail('');
      setEmailVerifyPassword('');
      toast({
        title: 'ഇമെയിൽ അപ്‌ഡേറ്റ് ചെയ്തു',
        description: 'നിങ്ങളുടെ ഇമെയിൽ വിജയകരമായി മാറ്റി.',
      });
      setTimeout(() => setEmailSuccess(false), 3000);
    } else {
      setEmailError(result.error || 'അജ്ഞാത പിശക്');
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    const result = await updatePassword(currentPassword, newPassword, confirmPassword);
    
    if (result.success) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്തു',
        description: 'നിങ്ങളുടെ പാസ്‌വേഡ് വിജയകരമായി മാറ്റി.',
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      setPasswordError(result.error || 'അജ്ഞാത പിശക്');
    }
  };

  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    showPassword,
    onToggle,
    id
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    showPassword: boolean;
    onToggle: () => void;
    id: string;
  }) => (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 rounded-xl"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-semibold text-foreground">ക്രമീകരണങ്ങൾ</h2>
      
      {/* Change Email Section */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">ഇമെയിൽ മാറ്റുക</h3>
            <p className="text-sm text-muted-foreground">അഡ്മിൻ ലോഗിൻ ഇമെയിൽ അപ്‌ഡേറ്റ് ചെയ്യുക</p>
          </div>
        </div>

        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentEmail" className="text-sm font-medium text-muted-foreground">
              നിലവിലെ ഇമെയിൽ
            </label>
            <Input
              id="currentEmail"
              type="text"
              value={currentEmail}
              readOnly
              className="bg-muted/50 rounded-xl cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newEmail" className="text-sm font-medium text-muted-foreground">
              പുതിയ ഇമെയിൽ <span className="text-destructive">*</span>
            </label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="പുതിയ ഇമെയിൽ വിലാസം നൽകുക"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="emailPassword" className="text-sm font-medium text-muted-foreground">
              നിലവിലെ പാസ്‌വേഡ് <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="emailPassword"
              value={emailVerifyPassword}
              onChange={setEmailVerifyPassword}
              placeholder="സ്ഥിരീകരിക്കാൻ പാസ്‌വേഡ് നൽകുക"
              showPassword={showEmailPassword}
              onToggle={() => setShowEmailPassword(!showEmailPassword)}
            />
          </div>

          {emailError && (
            <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{emailError}</span>
            </div>
          )}

          {emailSuccess && (
            <div className="flex items-center gap-2 text-primary text-sm p-3 bg-primary/10 rounded-xl">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>ഇമെയിൽ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full rounded-xl" 
            disabled={updating || !newEmail || !emailVerifyPassword}
          >
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                അപ്‌ഡേറ്റ് ചെയ്യുന്നു...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                ഇമെയിൽ അപ്‌ഡേറ്റ് ചെയ്യുക
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">പാസ്‌വേഡ് മാറ്റുക</h3>
            <p className="text-sm text-muted-foreground">അഡ്മിൻ ലോഗിൻ പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക</p>
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPass" className="text-sm font-medium text-muted-foreground">
              നിലവിലെ പാസ്‌വേഡ് <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="currentPass"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="നിലവിലെ പാസ്‌വേഡ് നൽകുക"
              showPassword={showCurrentPassword}
              onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPass" className="text-sm font-medium text-muted-foreground">
              പുതിയ പാസ്‌വേഡ് <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="newPass"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="പുതിയ പാസ്‌വേഡ് നൽകുക"
              showPassword={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
            />
            <p className="text-xs text-muted-foreground">
              കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ, ഒരു നമ്പർ അല്ലെങ്കിൽ പ്രത്യേക അക്ഷരം (!@#$%^&* മുതലായവ)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPass" className="text-sm font-medium text-muted-foreground">
              പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക <span className="text-destructive">*</span>
            </label>
            <PasswordInput
              id="confirmPass"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="പുതിയ പാസ്‌വേഡ് വീണ്ടും നൽകുക"
              showPassword={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 text-primary text-sm p-3 bg-primary/10 rounded-xl">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>പാസ്‌വേഡ് വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full rounded-xl" 
            disabled={updating || !currentPassword || !newPassword || !confirmPassword}
          >
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                അപ്‌ഡേറ്റ് ചെയ്യുന്നു...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
