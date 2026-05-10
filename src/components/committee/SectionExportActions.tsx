import { useState } from 'react';
import { Eye, Download, Printer, X } from 'lucide-react';
import {
  generateSectionPDF,
  downloadSectionPDF,
  printSectionPDF,
  SectionPDFOptions,
} from '@/utils/generateSectionPDF';

interface Props extends SectionPDFOptions {
  filename?: string;
}

/**
 * Inline View / Download PDF / Print actions for any committee section.
 * Place at top-right of each section header.
 */
export default function SectionExportActions({ filename, ...opts }: Props) {
  const [open, setOpen] = useState(false);
  const safeName = (filename || opts.sectionTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const build = () => generateSectionPDF(opts);

  const btn = 'inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-white bg-white/60';

  return (
    <div className="flex flex-wrap gap-1.5 ml-auto">
      <button onClick={() => setOpen(true)} className={btn} title="View"><Eye className="w-3 h-3" /> View</button>
      <button onClick={() => downloadSectionPDF(build(), safeName)} className={btn} title="Download PDF"><Download className="w-3 h-3" /> PDF</button>
      <button onClick={() => printSectionPDF(build())} className={btn} title="Print"><Printer className="w-3 h-3" /> Print</button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <div>
                <h4 className="text-base font-bold text-gray-900">{opts.sectionTitle}</h4>
                {opts.committeeName && <p className="text-xs text-gray-500">{opts.committeeName}</p>}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => downloadSectionPDF(build(), safeName)} className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={() => printSectionPDF(build())} className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              {opts.rows.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No records.</p>
              ) : (
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {opts.columns.map((c, i) => (
                        <th key={i} className="text-left px-2 py-2 font-semibold text-gray-700 border border-gray-200">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {opts.rows.map((r, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                        {r.map((v, ci) => (
                          <td key={ci} className="px-2 py-1.5 align-top text-gray-700 border border-gray-200 whitespace-pre-wrap">{v == null || v === '' ? '—' : String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
