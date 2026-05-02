import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Loader2, FolderPlus, FileText, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import { useCommitteeEdit } from '@/hooks/useCommitteeEdit';
import { CommitteeId } from '@/hooks/useCommittees';
import { uploadCommitteeFile } from '@/hooks/useCommitteeTable';
import EditEntryDialog from './EditEntryDialog';

interface Section { id: string; committee_id: string; title: string; description: string | null; sort_order: number; created_at: string; }
interface Entry { id: string; section_id: string; title: string; body: string | null; image_url: string | null; file_url: string | null; entry_date: string; created_at: string; }

interface Props {
  committeeId: string;
  bucket: string; // storage bucket for that committee
}

export default function CustomSections({ committeeId, bucket }: Props) {
  const { canEdit: isAuthenticated } = useCommitteeEdit(committeeId as CommitteeId);
  const [sections, setSections] = useState<Section[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry[]>>({});
  const [loading, setLoading] = useState(true);

  // forms
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [entryDrafts, setEntryDrafts] = useState<Record<string, { title: string; body: string; imageFile: File | null; pdfFile: File | null; uploading: boolean }>>({});
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const { data: secs } = await (supabase as any)
      .from('committee_custom_sections')
      .select('*')
      .eq('committee_id', committeeId)
      .order('sort_order')
      .order('created_at');
    const list = (secs || []) as Section[];
    setSections(list);

    if (list.length) {
      const ids = list.map((s) => s.id);
      const { data: ents } = await (supabase as any)
        .from('committee_custom_entries')
        .select('*')
        .in('section_id', ids)
        .order('entry_date', { ascending: false });
      const grouped: Record<string, Entry[]> = {};
      (ents || []).forEach((e: Entry) => { (grouped[e.section_id] = grouped[e.section_id] || []).push(e); });
      setEntries(grouped);
    } else {
      setEntries({});
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [committeeId]);

  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.title.trim()) return;
    const { error } = await (supabase as any).from('committee_custom_sections').insert({
      committee_id: committeeId,
      title: newSection.title.trim(),
      description: newSection.description.trim() || null,
      sort_order: sections.length,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Section added');
    setNewSection({ title: '', description: '' });
    fetchAll();
  };

  const deleteSection = async (id: string) => {
    if (!window.confirm('Delete this section and all its entries?')) return;
    const { error } = await (supabase as any).from('committee_custom_sections').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    fetchAll();
  };

  const saveSectionEdit = async (vals: Record<string, any>) => {
    if (!editingSection) return;
    const { error } = await (supabase as any).from('committee_custom_sections').update({
      title: vals.title, description: vals.description || null,
    }).eq('id', editingSection.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Updated');
    setEditingSection(null);
    fetchAll();
  };

  const addEntry = async (sectionId: string) => {
    const draft = entryDrafts[sectionId];
    if (!draft || !draft.title.trim()) return;
    setEntryDrafts({ ...entryDrafts, [sectionId]: { ...draft, uploading: true } });
    let image_url: string | null = null;
    let file_url: string | null = null;
    if (draft.imageFile) image_url = await uploadCommitteeFile(bucket, draft.imageFile, 'custom-img');
    if (draft.pdfFile) file_url = await uploadCommitteeFile(bucket, draft.pdfFile, 'custom-file');
    const { error } = await (supabase as any).from('committee_custom_entries').insert({
      section_id: sectionId,
      title: draft.title.trim(),
      body: draft.body.trim() || null,
      image_url,
      file_url,
    });
    if (error) { toast.error(error.message); }
    else {
      toast.success('Entry added');
      setEntryDrafts({ ...entryDrafts, [sectionId]: { title: '', body: '', imageFile: null, pdfFile: null, uploading: false } });
      fetchAll();
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return;
    const { error } = await (supabase as any).from('committee_custom_entries').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    fetchAll();
  };

  const saveEntryEdit = async (vals: Record<string, any>) => {
    if (!editingEntry) return;
    const { error } = await (supabase as any).from('committee_custom_entries').update({
      title: vals.title, body: vals.body || null,
    }).eq('id', editingEntry.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Updated');
    setEditingEntry(null);
    fetchAll();
  };

  const getDraft = (id: string) => entryDrafts[id] || { title: '', body: '', imageFile: null, pdfFile: null, uploading: false };

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>;

  return (
    <>
      {isAuthenticated && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
            <FolderPlus className="w-4 h-4" /> Add a custom section
          </h3>
          <form onSubmit={addSection} className="space-y-2 p-3 bg-slate-50 rounded-xl">
            <Input placeholder="Section title (e.g., Events, Notices)" value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} className="rounded-lg" />
            <Input placeholder="Short description (optional)" value={newSection.description} onChange={(e) => setNewSection({ ...newSection, description: e.target.value })} className="rounded-lg" />
            <Button size="sm" type="submit" className="bg-slate-700 hover:bg-slate-800"><Plus className="w-3.5 h-3.5 mr-1" /> Create section</Button>
          </form>
        </section>
      )}

      {sections.map((s) => {
        const draft = getDraft(s.id);
        const list = entries[s.id] || [];
        return (
          <section key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-800">{s.title}</h3>
                {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
              </div>
              {isAuthenticated && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditingSection(s)} className="p-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteSection(s.id)} className="p-1.5 rounded border border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded-xl">
                <Input placeholder="Entry title" value={draft.title} onChange={(e) => setEntryDrafts({ ...entryDrafts, [s.id]: { ...draft, title: e.target.value } })} className="rounded-lg" />
                <textarea placeholder="Body / details (optional)" value={draft.body} onChange={(e) => setEntryDrafts({ ...entryDrafts, [s.id]: { ...draft, body: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" rows={2} />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Image (optional)</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setEntryDrafts({ ...entryDrafts, [s.id]: { ...draft, imageFile: e.target.files?.[0] || null } })} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-xs">PDF (optional)</Label>
                    <Input type="file" accept="application/pdf" onChange={(e) => setEntryDrafts({ ...entryDrafts, [s.id]: { ...draft, pdfFile: e.target.files?.[0] || null } })} className="rounded-lg" />
                  </div>
                </div>
                <Button size="sm" onClick={() => addEntry(s.id)} disabled={draft.uploading} className="bg-slate-700 hover:bg-slate-800">
                  {draft.uploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Plus className="w-3.5 h-3.5 mr-1" />} Add Entry
                </Button>
              </div>
            )}

            {list.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">എൻട്രികൾ ഇല്ല</p>
            ) : (
              <div className="space-y-2">
                {list.map((en) => (
                  <div key={en.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-800">{en.title}</p>
                        {en.body && <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">{en.body}</p>}
                        <p className="text-[11px] text-gray-400 mt-1">{new Date(en.entry_date).toLocaleDateString('en-IN')}</p>
                      </div>
                      {isAuthenticated && (
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => setEditingEntry(en)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deleteEntry(en.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                    {en.image_url && (
                      <img src={en.image_url} alt={en.title} className="mt-2 rounded-lg max-h-48 object-cover w-full" loading="lazy" />
                    )}
                    {en.file_url && (
                      <div className="mt-2 flex gap-2">
                        <a href={en.file_url} target="_blank" rel="noopener noreferrer" className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">
                          <ExternalLink className="w-3 h-3" /> Open PDF
                        </a>
                        <a href={en.file_url} download className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">
                          <Download className="w-3 h-3" /> Download
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <EditEntryDialog
        open={!!editingSection}
        onOpenChange={(v) => { if (!v) setEditingSection(null); }}
        title="Edit Section"
        fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }]}
        initialValues={editingSection ? { title: editingSection.title, description: editingSection.description || '' } : {}}
        onSave={saveSectionEdit}
      />
      <EditEntryDialog
        open={!!editingEntry}
        onOpenChange={(v) => { if (!v) setEditingEntry(null); }}
        title="Edit Entry"
        fields={[{ key: 'title', label: 'Title' }, { key: 'body', label: 'Body / Details', type: 'textarea' }]}
        initialValues={editingEntry ? { title: editingEntry.title, body: editingEntry.body || '' } : {}}
        onSave={saveEntryEdit}
      />
    </>
  );
}
