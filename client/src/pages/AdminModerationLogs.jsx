import { useEffect, useMemo, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminModerationLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [courseId, setCourseId] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [query, setQuery] = useState('');

  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    axios
      .get('/moderation', { params: courseId ? { courseId } : {} })
      .then((res) => {
        if (ignore) return;
        setLogs(res.data || []);
        setError('');
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || 'Could not load moderation logs');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [courseId]);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (actionFilter !== 'all' && l.action !== actionFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(
          (l.moderator?.name || '').toLowerCase().includes(q)
          || (l.comment?.content || '').toLowerCase().includes(q)
          || (l.reason || '').toLowerCase().includes(q)
        )) return false;
      }
      return true;
    });
  }, [logs, actionFilter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const rows = [
      ['Timestamp','Action','Course','Comment','Moderator','ModeratorRole','Reason','PreviousState','NewState']
    ];

    filtered.forEach((r) => {
      rows.push([
        new Date(r.createdAt).toISOString(),
        r.action,
        r.course,
        (r.comment?.content || '').replace(/\n/g, ' '),
        r.moderator?.name || '',
        r.moderatorRole || '',
        (r.reason || '').replace(/\n/g, ' '),
        JSON.stringify(r.previousState || {}),
        JSON.stringify(r.newState || {}),
      ]);
    });

    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moderation-logs-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Moderation Audit Logs</h1>
          <div className="text-sm text-slate-600">Signed in as {user?.name} ({user?.role})</div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Filter by courseId" className="rounded-md border px-3 py-2" />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="all">All actions</option>
            <option value="hide">Hide</option>
            <option value="unhide">Unhide</option>
            <option value="delete">Delete</option>
          </select>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search moderator/comment/reason" className="rounded-md border px-3 py-2 col-span-2" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">{loading ? 'Loading...' : `${filtered.length} logs`}</div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setPage(1); exportCSV(); }} className="rounded-md bg-cyan-700 px-3 py-2 text-sm font-semibold text-white">Export CSV</button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-md bg-rose-50 p-4 text-rose-700">{error}</div>}

        <div className="space-y-3">
          {pageItems.map((log) => (
            <div key={log._id} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-slate-500">{new Date(log.createdAt).toLocaleString()}</div>
                  <div className="mt-1 font-semibold">{log.action.toUpperCase()}</div>
                </div>
                <div className="text-sm text-slate-500">Course: {log.course}</div>
              </div>

              <div className="mt-3 text-sm text-slate-700">
                <div><strong>Comment:</strong> {log.comment?.content || '[deleted]'}</div>
                <div className="mt-1"><strong>Moderator:</strong> {log.moderator?.name || '—'} ({log.moderatorRole})</div>
                {log.reason && <div className="mt-1 text-sm text-slate-500"><strong>Reason:</strong> {log.reason}</div>}
                <div className="mt-2 text-xs text-slate-400">Prev: {JSON.stringify(log.previousState || {})} → New: {JSON.stringify(log.newState || {})}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">Page {page} / {pageCount}</div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border px-3 py-1 disabled:opacity-50">Previous</button>
            <button disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="rounded-md border px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
}
