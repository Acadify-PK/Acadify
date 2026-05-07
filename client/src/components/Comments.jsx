import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ courseId, enrolled }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    axios
      .get(`/comments/${courseId}`)
      .then((res) => {
        if (ignore) return;
        setComments(res.data);
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
      setComments((c) => [res.data, ...c]);
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
      setComments((c) => c.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleModerate = async (id, hidden) => {
    try {
      const res = await axios.patch(`/comments/${id}/moderate`, { hidden, reason: hidden ? 'Removed by moderator' : 'Unhidden by moderator' });
      setComments((c) => c.map((x) => (x._id === id ? res.data : x)));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="mt-1 text-sm text-slate-500">Course discussion and questions.</p>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Sign in to participate in the discussion.
            </div>
          ) : !canComment ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Enroll to leave comments.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Share a question or note about this course"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
              <div className="mt-3 text-right">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-70"
                >
                  {submitting ? "Posting..." : "Post comment"}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-20 animate-pulse rounded-2xl border bg-slate-50" />
              ))}
            </div>
          ) : comments.length ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <article key={c._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{c.user?.name || 'Learner'}</p>
                      <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(String(c.user?._id || c.user) === String(user?._id) || user?.role === 'admin') && (
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-sm font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      )}

                      {canModerate && (
                        c.hidden ? (
                          <button
                            onClick={() => handleModerate(c._id, false)}
                            className="text-sm font-semibold text-emerald-700"
                          >
                            Unhide
                          </button>
                        ) : (
                          <button
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
          {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
