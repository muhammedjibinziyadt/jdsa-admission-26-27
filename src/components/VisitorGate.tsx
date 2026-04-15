import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail } from 'lucide-react';

interface VisitorGateProps {
  onSubmit: (name: string, email: string) => void;
}

export default function VisitorGate({ onSubmit }: VisitorGateProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const errs: { name?: string; email?: string } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) errs.name = 'Name is required';
    else if (trimmedName.length > 100) errs.name = 'Name is too long';

    if (!trimmedEmail) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) errs.email = 'Invalid email';
    else if (trimmedEmail.length > 255) errs.email = 'Email is too long';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(name.trim(), email.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[90%] max-w-md p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            സ്വാഗതം | Welcome
          </h2>
          <p className="text-sm text-muted-foreground">
            Please enter your details to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5" /> Name *
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              className="rounded-xl"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5" /> Email *
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={255}
              className="rounded-xl"
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>

          <Button type="submit" className="w-full rounded-xl mt-2">
            Continue →
          </Button>
        </form>
      </div>
    </div>
  );
}
