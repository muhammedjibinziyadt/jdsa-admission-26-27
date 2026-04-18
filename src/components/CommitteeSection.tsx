import { useCommittee } from '@/hooks/useCommittee';
import { Loader2, TrendingUp, TrendingDown, Wallet, Package, FileText, ImageOff, Download, ExternalLink, Users } from 'lucide-react';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function CommitteeSection() {
  const { loading, finances, items, settings, totals, balance } = useCommittee();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Committee Photo */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-semibold text-emerald-800">കമ്മിറ്റി അംഗങ്ങൾ</h3>
        </div>
        {settings?.group_photo_url ? (
          <img src={settings.group_photo_url} alt="Committee Members" className="w-full h-auto object-cover" />
        ) : (
          <div className="aspect-[16/9] bg-emerald-50 flex flex-col items-center justify-center text-emerald-400 gap-2">
            <ImageOff className="w-10 h-10" />
            <p className="text-sm">ഫോട്ടോ ഇതുവരെ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല</p>
          </div>
        )}
      </section>

      {/* Income & Expense */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-semibold text-emerald-800">വരവ് & ചെലവ്</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs mb-1"><TrendingUp className="w-3 h-3" />Income</div>
            <p className="text-sm font-bold text-emerald-700 break-all">{fmt(totals.income)}</p>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-600 text-xs mb-1"><TrendingDown className="w-3 h-3" />Expense</div>
            <p className="text-sm font-bold text-rose-700 break-all">{fmt(totals.expense)}</p>
          </div>
          <div className={`rounded-xl border p-3 text-center ${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className={`flex items-center justify-center gap-1 text-xs mb-1 ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'}`}><Wallet className="w-3 h-3" />Balance</div>
            <p className={`text-sm font-bold break-all ${balance >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>{fmt(balance)}</p>
          </div>
        </div>

        {finances.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">റെക്കോർഡുകൾ ഇല്ല</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {finances.map(f => (
              <div key={f.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{f.title}</p>
                  <p className="text-xs text-gray-500">{new Date(f.entry_date).toLocaleDateString('en-IN')}</p>
                  {f.description && <p className="text-xs text-gray-500 truncate">{f.description}</p>}
                </div>
                <span className={`text-sm font-semibold whitespace-nowrap ${f.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {f.type === 'income' ? '+' : '−'} {fmt(Number(f.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Office Items */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-semibold text-emerald-800">ഓഫീസ് ഇനങ്ങൾ</h3>
        </div>
        {items.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">ഇനങ്ങൾ ഇല്ല</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map(item => (
              <div key={item.id} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.name} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-emerald-50 flex items-center justify-center text-emerald-300">
                    <Package className="w-8 h-8" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  {item.quantity != null && <p className="text-xs text-gray-500">എണ്ണം: {item.quantity}</p>}
                  {item.notes && <p className="text-xs text-gray-500 truncate">{item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Constitution */}
      <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-semibold text-emerald-800">ഭരണഘടന</h3>
        </div>
        {settings?.constitution_url ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <a href={settings.constitution_url} target="_blank" rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
              <ExternalLink className="w-4 h-4" /> വ്യൂ
            </a>
            <a href={settings.constitution_url} download
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-colors">
              <Download className="w-4 h-4" /> ഡൗൺലോഡ്
            </a>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 py-4">ഭരണഘടന ഇതുവരെ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല</p>
        )}
      </section>
    </div>
  );
}
