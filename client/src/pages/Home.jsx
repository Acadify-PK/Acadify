import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Filter, ChevronDown, ChevronUp, Search as SearchIcon, X } from "lucide-react";

function Home() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCourses, setTotalCourses] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "newest",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    axios
      .get("/courses", {
        params: {
          page,
          limit: 8,
          search,
          ...filters,
        },
      })
      .then((res) => {
        if (!ignore) {
          // If user is instructor, filter out their own courses
          let fetchedCourses = res.data.data || [];
          if (user && user.role === "instructor") {
            fetchedCourses = fetchedCourses.filter(
              (course) => String(course.instructor?._id || course.instructor) !== String(user._id)
            );
          }
          setCourses(fetchedCourses);
          setTotalPages(res.data.totalPages || 1);
          setTotalCourses(res.data.total || 0);
          setError("");
        }
      })
      .catch(() => {
        if (!ignore) setError("Courses could not be loaded right now.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, search, filters]);

  const totalLessons = useMemo(
    () =>
      courses.reduce(
        (total, course) => total + (course.lectureCount || 0),
        0,
      ),
    [courses],
  );

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-950 dark:text-gray-100 transition-colors">
      <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Acadify" className="w-8 h-8 object-contain" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-500">
                Acadify
              </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Learn from structured courses built for steady progress.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-gray-400">
              Browse available courses, open a course workspace, enroll, and
              continue through lectures from one focused learning view.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 p-4">
              <p className="text-3xl font-bold text-slate-950 dark:text-white">
                {totalCourses}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Courses</p>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 p-4">
              <p className="text-3xl font-bold text-slate-950 dark:text-white">
                {totalLessons}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Lessons</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Course Catalog
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Select a course to view its curriculum and start learning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:min-w-[300px]">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isFilterOpen || Object.values(filters).some(v => v !== "" && v !== "newest")
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mb-8 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Sort by</span>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((current) => ({ ...current, sort: e.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Min Price</span>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    placeholder="0"
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => {
                      setFilters((current) => ({ ...current, minPrice: e.target.value }));
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 pl-8 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Max Price</span>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    placeholder="Infinity"
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      setFilters((current) => ({ ...current, maxPrice: e.target.value }));
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 pl-8 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rating</span>
                <select
                  value={filters.minRating}
                  onChange={(e) => {
                    setFilters((current) => ({ ...current, minRating: e.target.value }));
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                  setFilters({
                    minPrice: "",
                    maxPrice: "",
                    minRating: "",
                    sort: "newest",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Reset All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/5"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 p-5 text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              No courses yet
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              New courses will appear here when they are published.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group flex min-h-52 flex-col rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 dark:hover:border-cyan-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="rounded-md bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
                      Course {(page - 1) * 8 + index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-400 dark:text-gray-500 transition group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                      Open
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-snug text-slate-950 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-gray-400">
                    {course.description || "Course details will be added soon."}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-amber-600 dark:text-amber-500">
                    ⭐ {Number(course.avgRating || 0).toFixed(1)} ({course.reviewCount || 0})
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-gray-700 pt-4 text-sm text-slate-500 dark:text-gray-400">
                    <span>{course.sectionCount || 0} sections</span>
                    <span className="font-semibold text-slate-700 dark:text-gray-300 transition group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                      View curriculum
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-4 shadow-sm sm:flex-row">
              <div className="text-sm text-slate-500 dark:text-gray-400">
                Page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{" "}
                <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 transition hover:border-cyan-300 dark:hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                      number === page
                        ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
                        : "border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:border-cyan-300 dark:hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 transition hover:border-cyan-300 dark:hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Home;
