import { useTimetables, TimetableEntry } from '@/hooks/useTimetables';
import { Clock, Phone, Keyboard, Sparkles } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const categoryConfig = {
  calling: { label: 'Calling Time Table', labelMl: 'കോളിംഗ് ടൈം ടേബിൾ', icon: Phone, color: 'emerald' },
  typing: { label: 'Computer Typing Time Table', labelMl: 'കമ്പ്യൂട്ടർ ടൈപ്പിംഗ് ടൈം ടേബിൾ', icon: Keyboard, color: 'blue' },
  cleaning: { label: 'Cleaning Time Table', labelMl: 'ക്ലീനിംഗ് ടൈം ടേബിൾ', icon: Sparkles, color: 'amber' },
};

const colorMap: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', headerBg: 'bg-emerald-600' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', headerBg: 'bg-blue-600' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', headerBg: 'bg-amber-600' },
};

function TimetableCard({ category, entries }: { category: 'calling' | 'typing' | 'cleaning'; entries: TimetableEntry[] }) {
  const config = categoryConfig[category];
  const colors = colorMap[config.color];
  const Icon = config.icon;

  const groupedByDay: Record<string, TimetableEntry[]> = {};
  entries.forEach(e => {
    if (!groupedByDay[e.day]) groupedByDay[e.day] = [];
    groupedByDay[e.day].push(e);
  });

  const sortedDays = DAYS.filter(d => groupedByDay[d]);

  if (entries.length === 0) return null;

  return (
    <div className={`rounded-2xl border ${colors.border} overflow-hidden shadow-sm`}>
      <div className={`${colors.headerBg} text-white px-6 py-4 flex items-center gap-3`}>
        <Icon className="w-5 h-5" />
        <div>
          <h3 className="font-bold text-lg">{config.labelMl}</h3>
          <p className="text-white/80 text-sm">{config.label}</p>
        </div>
      </div>
      <div className={`${colors.bg} p-4`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${colors.text} border-b ${colors.border}`}>
                <th className="text-left py-2 px-3 font-semibold">Day</th>
                <th className="text-left py-2 px-3 font-semibold">Time</th>
                <th className="text-left py-2 px-3 font-semibold">Activity</th>
              </tr>
            </thead>
            <tbody>
              {sortedDays.map(day =>
                groupedByDay[day].map((entry, idx) => (
                  <tr key={entry.id} className="border-b border-white/50 last:border-0">
                    {idx === 0 && (
                      <td className={`py-2 px-3 font-medium ${colors.text}`} rowSpan={groupedByDay[day].length}>
                        {day}
                      </td>
                    )}
                    <td className="py-2 px-3 text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.time_slot}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-800">{entry.activity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function TimetableDisplay() {
  const { entries, loading } = useTimetables();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const calling = entries.filter(e => e.category === 'calling');
  const typing = entries.filter(e => e.category === 'typing');
  const cleaning = entries.filter(e => e.category === 'cleaning');

  if (calling.length === 0 && typing.length === 0 && cleaning.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>ടൈം ടേബിൾ ഇതുവരെ ചേർത്തിട്ടില്ല</p>
        <p className="text-sm">No timetable entries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TimetableCard category="calling" entries={calling} />
      <TimetableCard category="typing" entries={typing} />
      <TimetableCard category="cleaning" entries={cleaning} />
    </div>
  );
}
