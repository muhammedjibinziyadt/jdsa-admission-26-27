import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Loader2, CheckCircle, Upload, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookStore, Book } from '@/hooks/useBookStore';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

function BuyModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const { placeOrder, uploadPaymentScreenshot } = useBookStore();
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '' });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const UPI_NUMBER = '9048696090';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter valid 10-digit phone';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!screenshot) errs.screenshot = 'Payment screenshot is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    let screenshotUrl: string | null = null;
    if (screenshot) {
      screenshotUrl = await uploadPaymentScreenshot(screenshot);
    }
    await placeOrder({
      book_id: book.id,
      book_name: book.name,
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      payment_screenshot_url: screenshotUrl,
    });
    setSubmitting(false);
    setSuccess(true);
  };

  const handleGPay = () => {
    const upiUrl = `upi://pay?pa=${UPI_NUMBER}@ybl&pn=BookStore&am=${book.price}&cu=INR&tn=Book:${encodeURIComponent(book.name)}`;
    window.open(upiUrl, '_blank');
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-emerald-800">ഓർഡർ വിജയകരം!</h3>
          <p className="text-gray-600">നിങ്ങളുടെ ഓർഡർ ലഭിച്ചു. ഞങ്ങൾ ഉടൻ ബന്ധപ്പെടും.</p>
          <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">അടയ്ക്കുക</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-emerald-800">
          Buy: {book.name} — ₹{book.price}
        </h3>

        {/* Pay Now */}
        <Button onClick={handleGPay} className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-5">
          <CreditCard className="w-5 h-5 mr-2" /> Pay ₹{book.price} via Google Pay / UPI
        </Button>
        <p className="text-xs text-gray-500 text-center">UPI: {UPI_NUMBER}</p>

        <hr />

        <div>
          <Label>Name *</Label>
          <Input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} className="rounded-xl" />
          {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
        </div>
        <div>
          <Label>Phone *</Label>
          <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} type="tel" maxLength={10} className="rounded-xl" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label>Address *</Label>
          <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-emerald-400 outline-none resize-none" rows={3} />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div>
          <Label>Payment Screenshot *</Label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) setScreenshot(e.target.files[0]); }} />
          <div onClick={() => fileRef.current?.click()} className="mt-1 border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-400 transition-colors">
            {screenshot ? (
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm truncate">{screenshot.name}</span>
              </div>
            ) : (
              <div className="text-gray-400">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Upload screenshot</span>
              </div>
            )}
          </div>
          {errors.screenshot && <p className="text-red-500 text-xs mt-1">{errors.screenshot}</p>}
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
            Place Order
          </Button>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default function BookStore() {
  useVisitorTracking('Book Store');
  const { books, loading } = useBookStore();
  const [buyingBook, setBuyingBook] = useState<Book | null>(null);

  const activeBooks = books.filter(b => b.active);

  return (
    <div className="min-h-screen" style={{
      background: `
        linear-gradient(135deg, #f5f0e8 0%, #ede4d3 50%, #f5f0e8 100%)
      `,
    }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-amber-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-amber-200 hover:text-white mb-3 text-sm">
            <ArrowLeft className="w-4 h-4" /> ഹോം പേജിലേക്ക്
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            📚 ബുക്ക് സ്റ്റോർ
          </h1>
          <p className="text-amber-200 mt-1">Book Store - Browse & Purchase</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          </div>
        ) : activeBooks.length === 0 ? (
          <div className="text-center py-16 text-amber-800">
            <p className="text-xl">📚 പുസ്തകങ്ങൾ ഉടൻ ലഭ്യമാകും</p>
            <p className="text-sm text-amber-600 mt-2">Books coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {activeBooks.map(book => (
              <div key={book.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-amber-100 group">
                <div className="aspect-[3/4] bg-amber-50 overflow-hidden">
                  {book.image_url ? (
                    <img src={book.image_url} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">📖</div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">{book.name}</h3>
                  <p className="text-amber-800 font-bold text-lg">₹{book.price}</p>
                  <Button onClick={() => setBuyingBook(book)} className="w-full bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm">
                    <ShoppingCart className="w-4 h-4 mr-1" /> Buy Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {buyingBook && <BuyModal book={buyingBook} onClose={() => setBuyingBook(null)} />}
    </div>
  );
}
