import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Loader2, Camera, Lightbulb, Trophy, Upload, BookText } from 'lucide-react';
import { useCommitteeEdit } from '@/hooks/useCommitteeEdit';
import { useCommitteeTable, uploadCommitteeFile } from '@/hooks/useCommitteeTable';
import EditEntryDialog from '@/components/committee/EditEntryDialog';

interface Photo { id: string; caption: string | null; photo_url: string; week_date: string; }
interface Initiative { id: string; title: string; description: string | null; entry_date: string; }
interface Award { id: string; winner_name: string; award_title: string; award_month: string; notes: string | null; }
interface Report { id: string; title: string; entry_date: string; attended: string | null; absent: string | null; speakers: string | null; details: string | null; }

export default function SamajaBody() {
  const { canEdit } = useCommitteeEdit('samaja');
  const photos = useCommitteeTable<Photo>('samaja_photos', 'week_date');
  const initiatives = useCommitteeTable<Initiative>('samaja_initiatives', 'entry_date');
  const awards = useCommitteeTable<Award>('samaja_awards');
  const reports = useCommitteeTable<Report>('samaja_reports', 'entry_date');

  const [photoForm, setPhotoForm] = useState({ caption: '', week_date: new Date().toISOString().slice(0, 10) });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [initForm, setInitForm] = useState({ title: '', description: '' });
  const [awardForm, setAwardForm] = useState({ winner_name: '', award_title: '', award_month: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }), notes: '' });
  const [reportForm, setReportForm] = useState({ title: '', entry_date: new Date().toISOString().slice(0, 10), attended: '', absent: '', speakers: '', details: '' });

  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [editInit, setEditInit] = useState<Initiative | null>(null);
  const [editAward, setEditAward] = useState<Award | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [openReport, setOpenReport] = useState<Report | null>(null);

  return (
    <>
      {/* PHOTOS */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Camera className="w-4 h-4" /> ആഴ്ചയിലെ ഫോട്ടോകൾ</h3>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!photoFile) return;
            setUploading(true);
            const url = await uploadCommitteeFile('samaja', photoFile, 'photos');
            if (url) { const ok = await photos.insert({ caption: photoForm.caption || null, photo_url: url, week_date: photoForm.week_date } as any); if (ok) { setPhotoForm({ caption: '', week_date: new Date().toISOString().slice(0, 10) }); setPhotoFile(null); } }
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
              {canEdit && (
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setEditPhoto(p)} className="bg-blue-500 text-white p-1 rounded-full"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => photos.remove(p.id)} className="bg-rose-500 text-white p-1 rounded-full"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* REPORT BOOK */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><BookText className="w-4 h-4" /> റിപ്പോർട്ട് ബുക്ക്</h3>
        {canEdit && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!reportForm.title.trim()) return;
            const ok = await reports.insert({
              title: reportForm.title,
              entry_date: reportForm.entry_date,
              attended: reportForm.attended || null,
              absent: reportForm.absent || null,
              speakers: reportForm.speakers || null,
              details: reportForm.details || null,
            } as any);
            if (ok) setReportForm({ title: '', entry_date: new Date().toISOString().slice(0, 10), attended: '', absent: '', speakers: '', details: '' });
          }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <Input placeholder="Report title (e.g., Weekly Meeting)" value={reportForm.title} onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })} className="rounded-lg" />
            <Input type="date" value={reportForm.entry_date} onChange={(e) => setReportForm({ ...reportForm, entry_date: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Who attended" value={reportForm.attended} onChange={(e) => setReportForm({ ...reportForm, attended: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm" rows={2} />
            <textarea placeholder="Who did not attend" value={reportForm.absent} onChange={(e) => setReportForm({ ...reportForm, absent: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm" rows={2} />
            <textarea placeholder="Who gave speech" value={reportForm.speakers} onChange={(e) => setReportForm({ ...reportForm, speakers: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm" rows={2} />
            <textarea placeholder="Program details" value={reportForm.details} onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm" rows={3} />
            <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add Report</Button>
          </form>
        )}
        {reports.loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : reports.rows.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">റിപ്പോർട്ടുകൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2">{reports.rows.map((r) => (
            <div key={r.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <button onClick={() => setOpenReport(r)} className="text-left flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{r.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(r.entry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </button>
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditReport(r)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => reports.remove(r.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* INITIATIVES */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4" /> പദ്ധതികൾ</h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!initForm.title.trim()) return; const ok = await initiatives.insert({ title: initForm.title, description: initForm.description || null } as any); if (ok) setInitForm({ title: '', description: '' }); }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <Input placeholder="Title" value={initForm.title} onChange={(e) => setInitForm({ ...initForm, title: e.target.value })} className="rounded-lg" />
            <textarea placeholder="Description" value={initForm.description} onChange={(e) => setInitForm({ ...initForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm" rows={2} />
            <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </form>
        )}
        {initiatives.rows.length === 0 ? <p className="text-center text-sm text-gray-400 py-4">പദ്ധതികൾ ഇല്ല</p> : (
          <div className="space-y-2">{initiatives.rows.map((i) => (
            <div key={i.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{i.title}</p>{i.description && <p className="text-xs text-gray-600">{i.description}</p>}</div>
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditInit(i)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => initiatives.remove(i.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {/* AWARDS */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-4"><Trophy className="w-4 h-4" /> മാസത്തിലെ വിജയികൾ</h3>
        {canEdit && (
          <form onSubmit={async (e) => { e.preventDefault(); if (!awardForm.winner_name.trim()) return; const ok = await awards.insert({ winner_name: awardForm.winner_name, award_title: awardForm.award_title, award_month: awardForm.award_month, notes: awardForm.notes || null } as any); if (ok) setAwardForm({ winner_name: '', award_title: '', award_month: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }), notes: '' }); }} className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl">
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
              {canEdit && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditAward(a)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => awards.remove(a.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}</div>
        )}
      </section>

      {openReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpenReport(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-blue-700 font-semibold mb-1">{new Date(openReport.entry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <h4 className="text-lg font-bold text-gray-900 mb-3">{openReport.title}</h4>
            {openReport.attended && <div className="mb-2"><p className="text-xs font-semibold text-emerald-700">Attended</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{openReport.attended}</p></div>}
            {openReport.absent && <div className="mb-2"><p className="text-xs font-semibold text-rose-700">Absent</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{openReport.absent}</p></div>}
            {openReport.speakers && <div className="mb-2"><p className="text-xs font-semibold text-indigo-700">Speakers</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{openReport.speakers}</p></div>}
            {openReport.details && <div className="mb-2"><p className="text-xs font-semibold text-gray-700">Program Details</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{openReport.details}</p></div>}
            <div className="mt-4 text-right"><Button size="sm" variant="outline" onClick={() => setOpenReport(null)}>Close</Button></div>
          </div>
        </div>
      )}

      <EditEntryDialog open={!!editPhoto} onOpenChange={(v) => { if (!v) setEditPhoto(null); }} title="Edit Photo Caption"
        fields={[{ key: 'caption', label: 'Caption' }, { key: 'week_date', label: 'Date', type: 'date' }]}
        initialValues={editPhoto ? { caption: editPhoto.caption || '', week_date: editPhoto.week_date } : {}}
        onSave={async (vals) => { if (editPhoto) await photos.update(editPhoto.id, { caption: vals.caption || null, week_date: vals.week_date } as any); }} />
      <EditEntryDialog open={!!editInit} onOpenChange={(v) => { if (!v) setEditInit(null); }} title="Edit Initiative"
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'entry_date', label: 'Date', type: 'date' }]}
        initialValues={editInit ? { title: editInit.title, description: editInit.description || '', entry_date: editInit.entry_date } : {}}
        onSave={async (vals) => { if (editInit) await initiatives.update(editInit.id, { title: vals.title, description: vals.description || null, entry_date: vals.entry_date } as any); }} />
      <EditEntryDialog open={!!editAward} onOpenChange={(v) => { if (!v) setEditAward(null); }} title="Edit Award"
        fields={[{ key: 'winner_name', label: 'Winner' }, { key: 'award_title', label: 'Award Title' }, { key: 'award_month', label: 'Month' }, { key: 'notes', label: 'Notes', type: 'textarea' }]}
        initialValues={editAward ? { winner_name: editAward.winner_name, award_title: editAward.award_title, award_month: editAward.award_month, notes: editAward.notes || '' } : {}}
        onSave={async (vals) => { if (editAward) await awards.update(editAward.id, { winner_name: vals.winner_name, award_title: vals.award_title, award_month: vals.award_month, notes: vals.notes || null } as any); }} />
      <EditEntryDialog open={!!editReport} onOpenChange={(v) => { if (!v) setEditReport(null); }} title="Edit Report"
        fields={[{ key: 'title', label: 'Title' }, { key: 'entry_date', label: 'Date', type: 'date' }, { key: 'attended', label: 'Attended', type: 'textarea' }, { key: 'absent', label: 'Absent', type: 'textarea' }, { key: 'speakers', label: 'Speakers', type: 'textarea' }, { key: 'details', label: 'Details', type: 'textarea' }]}
        initialValues={editReport ? { title: editReport.title, entry_date: editReport.entry_date, attended: editReport.attended || '', absent: editReport.absent || '', speakers: editReport.speakers || '', details: editReport.details || '' } : {}}
        onSave={async (vals) => { if (editReport) await reports.update(editReport.id, { title: vals.title, entry_date: vals.entry_date, attended: vals.attended || null, absent: vals.absent || null, speakers: vals.speakers || null, details: vals.details || null } as any); }} />
    </>
  );
}
