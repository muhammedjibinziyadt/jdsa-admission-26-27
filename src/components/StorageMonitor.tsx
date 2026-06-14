import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { HardDrive, RefreshCw, AlertTriangle, Loader2, FileText } from "lucide-react";

// Approximate free-tier storage cap (1 GB). Displayed value only.
const TOTAL_BYTES = 1024 * 1024 * 1024;

const BUCKETS = [
  { id: "student-documents", label: "Student Documents (Aadhaar / Birth / Photos)" },
  { id: "images",            label: "Site Images & Photos" },
  { id: "committee",         label: "Committee Files" },
  { id: "jawahir",           label: "Al Jawahir (Magazines / Reports)" },
  { id: "samaja",            label: "Samaja Reports" },
  { id: "library",           label: "Library Files" },
  { id: "attendance",        label: "Attendance Files" },
  { id: "photoshop",         label: "Photoshop Class Uploads & Posters" },
  { id: "bookstore",         label: "Book Store Uploads" },
];

interface FileEntry { path: string; size: number; bucket: string; }
interface BucketStat { id: string; label: string; bytes: number; count: number; }

const fmt = (n: number) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

async function listAll(bucket: string, prefix = ""): Promise<FileEntry[]> {
  const out: FileEntry[] = [];
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000, sortBy: { column: "name", order: "asc" },
  });
  if (error || !data) return out;
  for (const item of data) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    const isFolder = !item.metadata || item.id === null;
    if (isFolder) {
      const nested = await listAll(bucket, path);
      out.push(...nested);
    } else {
      const size = Number((item.metadata as { size?: number } | null)?.size ?? 0);
      out.push({ path, size, bucket });
    }
  }
  return out;
}

const StorageMonitor = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BucketStat[]>([]);
  const [topFiles, setTopFiles] = useState<FileEntry[]>([]);

  const scan = async () => {
    setLoading(true);
    try {
      const results: BucketStat[] = [];
      const allFiles: FileEntry[] = [];
      for (const b of BUCKETS) {
        const files = await listAll(b.id);
        const bytes = files.reduce((s, f) => s + f.size, 0);
        results.push({ id: b.id, label: b.label, bytes, count: files.length });
        allFiles.push(...files);
      }
      results.sort((a, b) => b.bytes - a.bytes);
      setStats(results);
      setTopFiles(allFiles.sort((a, b) => b.size - a.size).slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { scan(); }, []);

  const used = stats.reduce((s, b) => s + b.bytes, 0);
  const pct = Math.min(100, (used / TOTAL_BYTES) * 100);
  const remaining = Math.max(0, TOTAL_BYTES - used);
  const zone: "green" | "yellow" | "red" =
    pct >= 86 ? "red" : pct >= 61 ? "yellow" : "green";
  const zoneColor =
    zone === "red" ? "bg-destructive" : zone === "yellow" ? "bg-amber-500" : "bg-emerald-500";
  const zoneText =
    zone === "red" ? "text-destructive" : zone === "yellow" ? "text-amber-600" : "text-emerald-600";

  // Circular chart
  const R = 60, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <HardDrive className="w-6 h-6 text-primary" />
          <div>
            <h2 className="font-display text-2xl font-bold">Storage Monitor</h2>
            <p className="text-sm text-muted-foreground">Track file uploads & storage usage</p>
          </div>
        </div>
        <Button onClick={scan} disabled={loading} variant="outline" className="rounded-xl">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {pct >= 80 && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          pct >= 90 ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-700"
        }`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm font-medium">
            {pct >= 90
              ? `Critical: Storage usage is at ${pct.toFixed(1)}%. Free up space immediately.`
              : `Warning: Storage usage is at ${pct.toFixed(1)}%. Consider archiving old files.`}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Overall Usage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Total</div>
                <div className="font-semibold">{fmt(TOTAL_BYTES)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Used</div>
                <div className={`font-semibold ${zoneText}`}>{fmt(used)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Remaining</div>
                <div className="font-semibold">{fmt(remaining)}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Usage</span>
                <span className={`font-semibold ${zoneText}`}>{pct.toFixed(1)}%</span>
              </div>
              <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
                <div className={`h-full transition-all ${zoneColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Usage Chart</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
              <circle
                cx="80" cy="80" r={R} fill="none" strokeWidth="14" strokeLinecap="round"
                stroke={zone === "red" ? "hsl(0 84% 60%)" : zone === "yellow" ? "hsl(38 92% 50%)" : "hsl(158 64% 35%)"}
                strokeDasharray={`${dash} ${C - dash}`}
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
              <text x="80" y="76" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="700">
                {pct.toFixed(0)}%
              </text>
              <text x="80" y="96" textAnchor="middle" className="fill-muted-foreground" fontSize="11">
                {fmt(used)}
              </text>
            </svg>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Category Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {loading && stats.length === 0 && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Scanning buckets...
            </div>
          )}
          {stats.map(s => {
            const localPct = used > 0 ? (s.bytes / used) * 100 : 0;
            return (
              <div key={s.id}>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground">{fmt(s.bytes)} · {s.count} files</span>
                </div>
                <Progress value={localPct} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Largest Files</CardTitle></CardHeader>
        <CardContent>
          {topFiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files found.</p>
          ) : (
            <div className="divide-y">
              {topFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      <span className="text-muted-foreground">{f.bucket}/</span>{f.path}
                    </span>
                  </div>
                  <span className="font-medium flex-shrink-0">{fmt(f.size)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageMonitor;
