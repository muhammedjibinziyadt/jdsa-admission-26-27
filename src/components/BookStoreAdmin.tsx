import { useState, useRef } from 'react';
import { useBookStore, Book } from '@/hooks/useBookStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit3, Save, X, Loader2, Upload, Eye, Package, ShoppingCart } from 'lucide-react';

export default function BookStoreAdmin() {
  const { books, orders, loading, addBook, updateBook, deleteBook, uploadBookImage, deleteOrder } = useBookStore();
  const [tab, setTab] = useState<'books' | 'orders'>('books');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', price: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewOrder, setViewOrder] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadBookImage(file);
    if (url) setForm(p => ({ ...p, image_url: url }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editingId) {
      await updateBook(editingId, { name: form.name, price: parseFloat(form.price) || 0, image_url: form.image_url || null });
    } else {
      await addBook({ name: form.name, price: parseFloat(form.price) || 0, image_url: form.image_url || null });
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', price: '', image_url: '' });
  };

  const startEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({ name: book.name, price: String(book.price), image_url: book.image_url || '' });
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const selectedOrder = orders.find(o => o.id === viewOrder);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">ബുക്ക് സ്റ്റോർ മാനേജ്മെന്റ്</h2>

      <div className="flex gap-2">
        <Button variant={tab === 'books' ? 'default' : 'outline'} onClick={() => setTab('books')} className="rounded-xl">
          <Package className="w-4 h-4 mr-2" /> Books ({books.length})
        </Button>
        <Button variant={tab === 'orders' ? 'default' : 'outline'} onClick={() => setTab('orders')} className="rounded-xl">
          <ShoppingCart className="w-4 h-4 mr-2" /> Orders ({orders.length})
        </Button>
      </div>

      {tab === 'books' && (
        <>
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', price: '', image_url: '' }); }} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Book
          </Button>

          {showForm && (
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
              <h3 className="font-medium">{editingId ? 'Edit Book' : 'New Book'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Book Name</label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-xl" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Price (₹)</label>
                  <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="rounded-xl" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Book Image</label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-xl">
                      {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Upload Image
                    </Button>
                    {form.image_url && <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editingId ? 'Update' : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-xl">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map(book => (
              <div key={book.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-soft">
                {book.image_url && <img src={book.image_url} alt={book.name} className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <h4 className="font-semibold">{book.name}</h4>
                  <p className="text-primary font-bold">₹{book.price}</p>
                  <div className="flex gap-1 mt-3">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(book)}><Edit3 className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteBook(book.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          {viewOrder && selectedOrder ? (
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Order Details</h3>
                <Button variant="ghost" onClick={() => setViewOrder(null)}><X className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Book:</span> <span className="font-medium">{selectedOrder.book_name}</span></div>
                <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selectedOrder.customer_name}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedOrder.phone}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}</span></div>
                <div className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> <span className="font-medium">{selectedOrder.address}</span></div>
              </div>
              {selectedOrder.payment_screenshot_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Screenshot:</p>
                  <img src={selectedOrder.payment_screenshot_url} alt="Payment" className="max-w-xs rounded-lg border" />
                </div>
              )}
              <Button variant="destructive" size="sm" onClick={() => { deleteOrder(selectedOrder.id); setViewOrder(null); }} className="rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Order
              </Button>
            </div>
          ) : (
            <>
              {orders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Book</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-t border-border/50 hover:bg-muted/30">
                          <td className="p-3">{order.customer_name}</td>
                          <td className="p-3">{order.book_name}</td>
                          <td className="p-3">{order.phone}</td>
                          <td className="p-3">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="p-3 text-right">
                            <Button size="sm" variant="ghost" onClick={() => setViewOrder(order.id)}><Eye className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteOrder(order.id)}><Trash2 className="w-4 h-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
