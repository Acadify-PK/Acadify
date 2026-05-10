import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminModerationLogs() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [courseId, setCourseId] = useState('');
  const [courseIdTerm, setCourseIdTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const handleUpdateStatus = async (userId, update, reason) => {
    try {
      if (!window.confirm(`Are you sure you want to update this user's moderation status?`)) return;
      await axios.patch(`/moderation/user/${userId}`, { ...update, reason });
      alert("User status updated successfully");
      // refresh current page
      setPage(page);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating user status");
    }
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    
    const params = { page, limit: pageSize };
    if (courseId) params.courseId = courseId;
    if (actionFilter !== 'all') params.action = actionFilter;
    if (query) params.q = query;

    axios
      .get('/moderation', { params })
      .then((res) => {
        if (ignore) return;
        setData(res.data.data || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
        setError('');
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || 'Could not load moderation logs');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [courseId, actionFilter, query, page]);

  // debounce searchTerm -> query (500ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(searchTerm);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // debounce courseIdTerm -> courseId (500ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setCourseId(courseIdTerm);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [courseIdTerm]);

  const exportCSV = () => {
    const rows = [
      ['Timestamp','Action','Course','Comment','Moderator','ModeratorRole','Reason','PreviousState','NewState']
    ];

    data.forEach((r) => {
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
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <input value={courseIdTerm} onChange={(e) => { setCourseIdTerm(e.target.value); setPage(1); setIsSearching(true); }} placeholder="Filter by courseId" className="rounded-md border px-3 py-2" />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="all">All actions</option>
            <option value="hide">Hide</option>
            <option value="unhide">Unhide</option>
            <option value="delete">Delete</option>
          </select>
          <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); setIsSearching(true); }} placeholder="Search moderator/comment/reason" className="rounded-md border px-3 py-2 col-span-2" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                <span>Loading...</span>
              </>
            ) : isSearching ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600"></div>
                <span>Searching...</span>
              </>
            ) : (
              <span>{total} logs found</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="rounded-md bg-cyan-700 px-3 py-2 text-sm font-semibold text-white">Export CSV</button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-md bg-rose-50 p-4 text-rose-700">{error}</div>}

        <div className="space-y-3">
          {data.map((log) => (
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
                <div className="mt-1 flex items-center justify-between">
                  <div><strong>Moderator:</strong> {log.moderator?.name || '—'} ({log.moderatorRole})</div>
                  {user?.role === 'admin' && log.comment?.user && (
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleUpdateStatus(log.comment.user, { isShadowBanned: true }, "Manual shadow ban via logs")}
                        className="text-xs font-semibold text-amber-600 hover:underline"
                      >
                        Shadow Ban
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(log.comment.user, { isFlagged: true }, "Flagged via logs")}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Flag Account
                      </button>
                    </div>
                  )}
                </div>
                {log.reason && <div className="mt-1 text-sm text-slate-500"><strong>Reason:</strong> {log.reason}</div>}
                <div className="mt-2 text-xs text-slate-400">Prev: {JSON.stringify(log.previousState || {})} → New: {JSON.stringify(log.newState || {})}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">Page {page} / {pages}</div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border px-3 py-1 disabled:opacity-50">Previous</button>
            <button disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="rounded-md border px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
}
