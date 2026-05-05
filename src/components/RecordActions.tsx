import { Eye, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { downloadPDF, printPDF, RecordPDFData, generateRecordPDF } from '@/utils/generateRecordPDF';
import { useState } from 'react';

interface Props {
  data: RecordPDFData;
  filename: string;
  compact?: boolean;
}

export default function RecordActions({ data, filename, compact }: Props) {
  const [open, setOpen] = useState(false);

  const build = (): jsPDF => generateRecordPDF(data);

  const cls = compact
    ? 'text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-white'
    : 'text-xs inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50';

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setOpen(true); }} className={cls} title="View">
        <Eye className="w-3.5 h-3.5" /> View
      </button>
      <button onClick={(e) => { e.stopPropagation(); downloadPDF(build(), filename); }} className={cls} title="Download PDF">
        <Download className="w-3.5 h-3.5" /> PDF
      </button>
      <button onClick={(e) => { e.stopPropagation(); printPDF(build()); }} className={cls} title="Print">
        <Printer className="w-3.5 h-3.5" /> Print
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{data.heading}</h4>
            {data.subheading && <p className="text-xs text-gray-500 mb-1">{data.subheading}</p>}
            {data.date && <p className="text-xs text-emerald-700 mb-3">{data.date}</p>}
            <div className="space-y-2">
              {data.fields.filter(f => f.value != null && f.value !== '').map((f, i) => (
                <div key={i}>
                  <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">{f.label}</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{String(f.value)}</p>
                </div>
              ))}
              {data.body && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500 mb-1">Details</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.body}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => downloadPDF(build(), filename)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button onClick={() => printPDF(build())} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button onClick={() => setOpen(false)} className="text-xs px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
