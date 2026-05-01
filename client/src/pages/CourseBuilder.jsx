import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../api/axios";

const isYouTubeUrl = (url = "") =>
  url.includes("youtube.com") || url.includes("youtu.be");

const initialLectureData = {
  title: "",
  videoUrl: "",
  sectionId: "",
};

function CourseBuilder() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lectureData, setLectureData] = useState(initialLectureData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [addingLecture, setAddingLecture] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const fetchCourse = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const res = await axios.get(`/courses/full/${id}`);
        setCourse(res.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Course could not be loaded. Please try again.",
        );
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    let ignore = false;

    axios
      .get(`/courses/full/${id}`)
      .then((res) => {
        if (!ignore) {
          setCourse(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Course could not be loaded. Please try again.",
          );
          console.error(err.response?.data || err.message);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAddSection = async (e) => {
    e.preventDefault();

    if (!sectionTitle.trim()) return;

    try {
      setAddingSection(true);
      setError("");
      setStatus("");

      const res = await axios.post("/sections", {
        title: sectionTitle,
        courseId: id,
      });

      setSectionTitle("");
      setLectureData((current) => ({
        ...current,
        sectionId: current.sectionId || res.data._id,
      }));
      setStatus("Section added.");
      await fetchCourse({ silent: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Section could not be added. Please try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setAddingSection(false);
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();

    const { title, videoUrl, sectionId } = lectureData;
    if (!title.trim() || !videoUrl.trim() || !sectionId) return;

    try {
      setAddingLecture(true);
      setError("");
      setStatus("");

      await axios.post("/lectures", {
        title,
        videoUrl,
        sectionId,
      });

      setLectureData({ title: "", videoUrl: "", sectionId });
      setStatus("Lecture added.");
      await fetchCourse({ silent: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Lecture could not be added. Please try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setAddingLecture(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError("");
      setStatus("");

      await axios.patch(`/courses/${id}/publish`);
      setStatus("Course published. It is now visible to students.");
      await fetchCourse({ silent: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Course could not be published. Please try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setPublishing(false);
    }
  };

  const sectionCount = course?.sections?.length || 0;
  const lectureCount =
    course?.sections?.reduce(
      (total, section) => total + (section.lectures?.length || 0),
      0,
    ) || 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] p-5 text-slate-950 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="h-[520px] animate-pulse rounded-lg bg-white" />
            <div className="h-[520px] animate-pulse rounded-lg bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] p-5 text-slate-950 sm:p-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p>{error || "Course not found."}</p>
          <Link
            to="/instructor"
            className="mt-4 inline-flex rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Link
            to="/instructor"
            className="inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            Back to dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Course Builder
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {course.description ||
                  "Add sections and lectures to shape the course experience."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold">{sectionCount}</p>
                <p className="mt-1 text-sm text-slate-500">Sections</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold">{lectureCount}</p>
                <p className="mt-1 text-sm text-slate-500">Lectures</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-5">
          <form
            onSubmit={handleAddSection}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Add Section
            </p>
            <h2 className="mt-2 text-xl font-bold">Course section</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sections organize lectures into a learner-friendly path.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Section title
              </span>
              <input
                value={sectionTitle}
                onChange={(e) => {
                  setSectionTitle(e.target.value);
                  setError("");
                  setStatus("");
                }}
                placeholder="Introduction"
                required
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <button
              type="submit"
              disabled={addingSection}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-70"
            >
              {addingSection ? "Adding..." : "Add Section"}
            </button>
          </form>

          <form
            onSubmit={handleAddLecture}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Add Lecture
            </p>
            <h2 className="mt-2 text-xl font-bold">Video lecture</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a playable video to an existing section.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Section
              </span>
              <select
                value={lectureData.sectionId}
                onChange={(e) => {
                  setLectureData({ ...lectureData, sectionId: e.target.value });
                  setError("");
                  setStatus("");
                }}
                required
                disabled={sectionCount === 0}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select Section</option>
                {course.sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Lecture title
              </span>
              <input
                value={lectureData.title}
                onChange={(e) => {
                  setLectureData({ ...lectureData, title: e.target.value });
                  setError("");
                  setStatus("");
                }}
                placeholder="What is React?"
                required
                disabled={sectionCount === 0}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Video URL
              </span>
              <input
                value={lectureData.videoUrl}
                onChange={(e) => {
                  setLectureData({ ...lectureData, videoUrl: e.target.value });
                  setError("");
                  setStatus("");
                }}
                placeholder="Video URL (YouTube or .mp4)"
                required
                disabled={sectionCount === 0}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="mt-2 block text-xs text-slate-400">
                Supports YouTube links and direct MP4 URLs.
              </span>
            </label>

            <button
              type="submit"
              disabled={sectionCount === 0 || addingLecture}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {addingLecture ? "Adding..." : "Add Lecture"}
            </button>
          </form>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white shadow-sm lg:sticky lg:top-5 lg:self-start">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Course Structure</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Live preview of sections and lectures.
                </p>
              </div>
              <span
                className={`rounded-md px-3 py-1 text-xs font-bold ${
                  course.published
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {course.published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handlePublish}
                disabled={course.published || publishing}
                className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {course.published
                  ? "Already Published"
                  : publishing
                    ? "Publishing..."
                    : "Publish Course"}
              </button>

              {refreshing && (
                <span className="rounded-md bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">
                  Updating structure
                </span>
              )}
            </div>

            {status && (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {status}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}
          </div>

          <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-5">
            {sectionCount === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <h3 className="font-bold text-slate-900">No sections yet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add your first section to begin shaping the course.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.sections.map((section, sectionIndex) => (
                  <section
                    key={section._id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Section {sectionIndex + 1}
                    </p>
                    <h3 className="mt-1 font-bold text-slate-900">
                      {section.title}
                    </h3>

                    {section.lectures?.length ? (
                      <ul className="mt-3 space-y-2">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <li
                            key={lecture._id}
                            className="flex items-start gap-3 rounded-md bg-white px-3 py-3 text-sm text-slate-700"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-xs font-bold text-white">
                              {lectureIndex + 1}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold">
                                {lecture.title}
                              </span>
                              <span className="mt-1 block truncate text-xs text-slate-400">
                                {isYouTubeUrl(lecture.videoUrl)
                                  ? "YouTube"
                                  : "MP4"}{" "}
                                · {lecture.videoUrl}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 rounded-md bg-white px-3 py-3 text-sm text-slate-500">
                        No lectures in this section yet.
                      </p>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CourseBuilder;
