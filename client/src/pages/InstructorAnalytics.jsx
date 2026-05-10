import { useEffect, useState } from "react";
import axios from "../api/axios";

function InstructorAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/analytics")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[400px] bg-[#f7f8fb] dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 dark:border-cyan-500"></div>
    </div>
  );

  if (!data) return (
    <div className="p-6 bg-[#f7f8fb] dark:bg-gray-950 min-h-screen">
      <p className="text-red-500 dark:text-red-400">Error loading analytics data.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb] dark:bg-gray-950">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Instructor Analytics
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Track your course performance and earnings.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Courses</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {data.totalCourses}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Students</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {data.totalStudents}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">Total Revenue</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white">$</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {data.totalRevenue.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Course Performance
              </h2>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-200 dark:border-gray-800">
                          <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-gray-400">Course Name</th>
                          <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-gray-400">Price</th>
                          <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-gray-400 text-center">Enrollments</th>
                          <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-gray-400 text-right">Revenue</th>
                      </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                      {data.courseStats.length === 0 ? (
                          <tr>
                              <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-gray-400">
                                  No courses created yet. 
                              </td>
                          </tr>
                      ) : (
                          data.courseStats.map(c => (
                              <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-gray-800 shadow-none transition-colors">
                                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.title}</td>
                                  <td className="px-6 py-4 text-slate-600 dark:text-gray-400">${c.price}</td>
                                  <td className="px-6 py-4 text-slate-600 dark:text-gray-400 text-center">{c.students}</td>
                                  <td className="px-6 py-4 text-slate-900 dark:text-white font-bold text-right">${c.revenue.toLocaleString()}</td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorAnalytics;
