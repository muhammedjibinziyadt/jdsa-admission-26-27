import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Loader2, Camera, Calendar, Lightbulb, Trophy, Upload } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useCommitteeTable, uploadCommitteeFile } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';

interface Photo { id: string; caption: string | null; photo_url: string; week_date: string; }
interface Booking { id: string; title: string; booked_by: string | null; booking_date: string; details: string | null; }
interface Initiative { id: string; title: string; description: string | null; entry_date: string; }
interface Award { id: string; winner_name: string; award_title: string; award_month: string; notes: string | null; }

export default function SamajaBody() {
  const { isAuthenticated } = useAdminAuth();
  const photos = useCommitteeTable<Photo>('samaja_photos', 'week_date');
  const bookings = useCommitteeTable<Booking>('samaja_bookings', 'booking_date');
  const initiatives = useCommitteeTable<Initiative>('samaja_initiatives', 'entry_date');
  const awards = useCommitteeTable<Award>('samaja_awards');

  const [photoForm, setPhotoForm] = useState({ caption: '', week_date: new Date().toISOString().slice(0, 10) });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bookForm, setBookForm] = useState({ title: '', booked_by: '', booking_date: new Date().toISOString().slice(0, 10), details: '' });
  const [initForm, setInitForm] = useState({ title: '', description: '' });
  const [awardForm, setAwardForm] = useState({ winner_name: '', award_title: '', award_month: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }), notes: '' });

  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editInit, setEditInit] = useState<Initiative | null>(null);
  const [editAward, setEditAward] = useState<Award | null>(null);

  return (
    <>
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Camera className="w-4 h-4" /> ആഴ്ചയിലെ ഫോട്ടോകൾ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!photoFile) return;
            setUploading(true);
            const url = await uploadCommitteeFile('samaja', photoFile, 'photos');
            if (url) { const ok = await photos.insert({ caption: photoForm.caption || null, photo_url: url, week_date: photoForm.week_date }); if (ok) { setPhotoForm({ caption: '', week_date: new Date().toISOString().slice(0, 10) }); setPhotoFile(null); } }
            setUploading(false);
          }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className="rounded-lg" />
            <Input placeholder="Caption (optional)" value={photoForm.caption} onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })} className="rounded-lg" />
            <Input type="date" value={photoForm.week_date} onChange={(e) => setPhotoForm({ ...photoForm, week_date: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-700">{uploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1" />} Upload</Button>
          </form>
        )}
        {photos.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">ഫോട്ടോകൾ ഇല്ല</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{photos.rows.map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group relative">
              <img src={p.photo_url} alt={p.caption || 'photo'} className="w-full aspect-square object-cover" />
              {p.caption && <p className="text-xs p-1.5 truncate text-gray-700">{p.caption}</p>}
              <p className="text-[10px] text-gray-400 px-1.5 pb-1">{new Date(p.week_date).toLocaleDateString('en-IN')}</p>
              {isAuthenticated && (
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setEditPhoto(p)} className="bg-blue-500 text-white p-1 rounded-full"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => photos.remove(p.id)} className="bg-rose-500 text-white p-1 rounded-full"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Calendar className="w-4 h-4" /> ബുക്കിംഗ് വിവരങ്ങൾ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!bookForm.title.trim()) return; const ok = await bookings.insert({ title: bookForm.title, booked_by: bookForm.booked_by || null, booking_date: bookForm.booking_date, details: bookForm.details || null }); if (ok) setBookForm({ title: '', booked_by: '', booking_date: new Date().toISOString().slice(0, 10), details: '' }); }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <Input placeholder="Booking title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} className="rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Booked by" value={bookForm.booked_by} onChange={(e) => setBookForm({ ...bookForm, booked_by: e.target.value })} className="rounded-lg" />
              <Input type="date" value={bookForm.booking_date} onChange={(e) => setBookForm({ ...bookForm, booking_date: e.target.value })} className="rounded-lg" />
            </div>
            <Input placeholder="Details" value={bookForm.details} onChange={(e) => setBookForm({ ...bookForm, details: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {bookings.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">ബുക്കിംഗുകൾ ഇല്ല</p> : (
          <div className="space-y-2">{bookings.rows.map((b) => (
            <div key={b.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{b.title}</p>{b.booked_by && <p className="text-xs text-gray-600">By: {b.booked_by}</p>}{b.details && <p className="text-xs text-gray-500">{b.details}</p>}<p className="text-xs text-gray-400 mt-1">{new Date(b.booking_date).toLocaleDateString('en-IN')}</p></div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditBooking(b)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => bookings.remove(b.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4" /> പദ്ധതികൾ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!initForm.title.trim()) return; const ok = await initiatives.insert({ title: initForm.title, description: initForm.description || null }); if (ok) setInitForm({ title: '', description: '' }); }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <Input placeholder="Title" value={initForm.title} onChange={(e) => setInitForm({ ...initForm, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Description" value={initForm.description} onChange={(e) => setInitForm({ ...initForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {initiatives.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പദ്ധതികൾ ഇല്ല</p> : (
          <div className="space-y-2">{initiatives.rows.map((i) => (
            <div key={i.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{i.title}</p>{i.description && <p className="text-xs text-gray-600">{i.description}</p>}</div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditInit(i)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => initiatives.remove(i.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Trophy className="w-4 h-4" /> മാസത്തിലെ വിജയികൾ</h3>
        {isAuthenticated && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!awardForm.winner_name.trim()) return; const ok = await awards.insert({ winner_name: awardForm.winner_name, award_title: awardForm.award_title, award_month: awardForm.award_month, notes: awardForm.notes || null }); if (ok) setAwardForm({ winner_name: '', award_title: '', award_month: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }), notes: '' }); }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <Input placeholder="Winner name" value={awardForm.winner_name} onChange={(e) => setAwardForm({ ...awardForm, winner_name: e.target.value })} className="rounded-lg" />
            <Input placeholder="Award title" value={awardForm.award_title} onChange={(e) => setAwardForm({ ...awardForm, award_title: e.target.value })} className="rounded-lg" />
            <Input placeholder="Month (e.g., April 2026)" value={awardForm.award_month} onChange={(e) => setAwardForm({ ...awardForm, award_month: e.target.value })} className="rounded-lg" />
            <Input placeholder="Notes" value={awardForm.notes} onChange={(e) => setAwardForm({ ...awardForm, notes: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {awards.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">വിജയികൾ ഇല്ല</p> : (
          <div className="space-y-2">{awards.rows.map((a) => (
            <div key={a.id} className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 flex justify-between gap-3">
              <div className="flex items-start gap-2 flex-1 min-w-0"><Trophy className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /><div className="min-w-0"><p className="font-semibold text-sm text-amber-900">{a.winner_name}</p><p className="text-xs text-amber-700">{a.award_title} • {a.award_month}</p>{a.notes && <p className="text-xs text-gray-600 mt-0.5">{a.notes}</p>}</div></div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditAward(a)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => awards.remove(a.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      <EditEntryDialog
        open={!!editPhoto}
        onOpenChange={(v) => { if (!v) setEditPhoto(null); }}
        title="Edit Photo Caption"
        fields={[{ key: 'caption', label: 'Caption' }, { key: 'week_date', label: 'Date', type: 'date' }]}
        initialValues={editPhoto ? { caption: editPhoto.caption || '', week_date: editPhoto.week_date } : {}}
        onSave={async (vals) => { if (editPhoto) await photos.update(editPhoto.id, { caption: vals.caption || null, week_date: vals.week_date } as any); }}
      />
      <EditEntryDialog
        open={!!editBooking}
        onOpenChange={(v) => { if (!v) setEditBooking(null); }}
        title="Edit Booking"
        fields={[{ key: 'title', label: 'Title' }, { key: 'booked_by', label: 'Booked by' }, { key: 'booking_date', label: 'Date', type: 'date' }, { key: 'details', label: 'Details', type: 'textarea' }]}
        initialValues={editBooking ? { title: editBooking.title, booked_by: editBooking.booked_by || '', booking_date: editBooking.booking_date, details: editBooking.details || '' } : {}}
        onSave={async (vals) => { if (editBooking) await bookings.update(editBooking.id, { title: vals.title, booked_by: vals.booked_by || null, booking_date: vals.booking_date, details: vals.details || null } as any); }}
      />
      <EditEntryDialog
        open={!!editInit}
        onOpenChange={(v) => { if (!v) setEditInit(null); }}
        title="Edit Initiative"
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editInit ? { title: editInit.title, description: editInit.description || '', entry_date: editInit.entry_date } : {}}
        onSave={async (vals) => { if (editInit) await initiatives.update(editInit.id, { title: vals.title, description: vals.description || null, entry_date: vals.entry_date } as any); }}
      />
      <EditEntryDialog
        open={!!editAward}
        onOpenChange={(v) => { if (!v) setEditAward(null); }}
        title="Edit Award"
        fields={[{ key: 'winner_name', label: 'Winner' }, { key: 'award_title', label: 'Award Title' }, { key: 'award_month', label: 'Month' }, { key: 'notes', label: 'Notes', type: 'textarea' }]}
        initialValues={editAward ? { winner_name: editAward.winner_name, award_title: editAward.award_title, award_month: editAward.award_month, notes: editAward.notes || '' } : {}}
        onSave={async (vals) => { if (editAward) await awards.update(editAward.id, { winner_name: vals.winner_name, award_title: vals.award_title, award_month: vals.award_month, notes: vals.notes || null } as any); }}
      />
    </>
  );
}
