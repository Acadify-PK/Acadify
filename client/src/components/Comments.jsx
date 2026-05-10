import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ courseId, enrolled, course }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    axios
      .get(`/comments/${courseId}`, {
        params: {
          page,
          limit: pageSize,
          ...(query ? { q: query } : {}),
        },
      })
      .then((res) => {
        if (ignore) return;
        setComments(res.data.data || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
        setError("");
      })
      .catch(() => {
        if (!ignore) setError("Comments could not be loaded right now.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [courseId, page, query]);

  // debounce searchTerm -> query
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(searchTerm);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [courseId]);

  const isCourseInstructor = Boolean(
    user && course && String(course.instructor?._id || course.instructor) === String(user._id),
  );

  const canModerate = Boolean(user && (user.role === "admin" || isCourseInstructor));
  const canComment = Boolean(user && (enrolled || user.role === "admin"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post("/comments", { courseId, content: content.trim() });
      if (page === 1 && !query) {
        const nextTotal = total + 1;
        setComments((current) => [res.data, ...current].slice(0, pageSize));
        setTotal(nextTotal);
        setPages(Math.max(1, Math.ceil(nextTotal / pageSize)));
      } else {
        setPage(1);
      }
      setContent("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/comments/${id}`);
      setComments((current) => current.filter((x) => x._id !== id));
      setTotal((current) => {
        const nextTotal = Math.max(0, current - 1);
        setPages(Math.max(1, Math.ceil(nextTotal / pageSize)));
        return nextTotal;
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleModerate = async (id, hidden) => {
    try {
      const res = await axios.patch(`/comments/${id}/moderate`, {
        hidden,
        reason: hidden ? "Removed by moderator" : "Unhidden by moderator",
      });

      setComments((current) => current.map((x) => (x._id === id ? res.data : x)));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors">
        <div className="border-b border-slate-200 dark:border-gray-800 p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Comments</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Course discussion and questions.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_auto]">
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                  setIsSearching(true);
                }}
                placeholder="Search comments or learners"
                className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm outline-none transition placeholder:text-slate-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/40"
              />
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-4 py-2 text-sm text-slate-600 dark:text-gray-400">
                {isSearching ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border border-cyan-200 border-t-cyan-600"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    {total} comment{total === 1 ? "" : "s"}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 p-4 text-sm text-slate-600 dark:text-gray-400">
              Sign in to participate in the discussion.
            </div>
          ) : !canComment ? (
            <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 p-4 text-sm text-slate-600 dark:text-gray-400">
              Enroll to leave comments.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Share a question or note about this course"
                className="w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm outline-none text-gray-900 dark:text-white focus:border-cyan-500"
              />
              <div className="mt-3 text-right">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-700 hover:bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-70 transition-colors"
                >
                  {submitting ? "Posting..." : "Post comment"}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-20 animate-pulse rounded-2xl border dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50" />
              ))}
            </div>
          ) : comments.length ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <article key={c._id} className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{c.user?.name || "Learner"}</p>
                      <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(String(c.user?._id || c.user) === String(user?._id) || user?.role === "admin") && (
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id)}
                          className="text-sm font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      )}

                      {canModerate && (
                        c.hidden ? (
                          <button
                            type="button"
                            onClick={() => handleModerate(c._id, false)}
                            className="text-sm font-semibold text-emerald-700"
                          >
                            Unhide
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleModerate(c._id, true)}
                            className="text-sm font-semibold text-rose-600"
                          >
                            Moderate
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  {c.hidden ? (
                    <p className="mt-3 text-sm text-slate-500 italic">Comment removed by moderator.</p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-700">{c.content}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm text-slate-500">
              No comments yet. Start the discussion by posting a comment.
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <div className="text-sm text-slate-600">
              Page {page} / {pages}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-md border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((current) => Math.min(pages, current + 1))}
                className="rounded-md border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
