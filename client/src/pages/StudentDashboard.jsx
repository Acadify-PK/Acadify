import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import IntegrationsSettings from "../components/IntegrationsSettings";
import { BookOpen, Zap, CheckCircle, TrendingUp, ChevronRight, Layout, Settings } from "lucide-react";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/enrollments/me")
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.progressPercent === 100).length,
    inProgress: courses.filter(c => c.progressPercent > 0 && c.progressPercent < 100).length,
    avgProgress: courses.length ? Math.round(courses.reduce((acc, curr) => acc + curr.progressPercent, 0) / courses.length) : 0
  };

  if (loading) {
    return <div className="p-6">Loading your courses...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your learning progress.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
          <button 
            onClick={() => setActiveTab("courses")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === "courses" ? "bg-white shadow-sm text-blue-600 ring-1 ring-black/5" : "text-gray-600 hover:text-gray-900"}`}
          >
            <BookOpen className="w-4 h-4" />
            My Courses
          </button>
          <button 
            onClick={() => setActiveTab("integrations")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === "integrations" ? "bg-white shadow-sm text-blue-600 ring-1 ring-black/5" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Settings className="w-4 h-4" />
            Integrations
          </button>
        </div>
      </div>

      {activeTab === "courses" && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Courses", value: stats.total, icon: BookOpen, color: "bg-blue-50 text-blue-700" },
            { label: "In Progress", value: stats.inProgress, icon: Zap, color: "bg-yellow-50 text-yellow-700" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-green-50 text-green-700" },
            { label: "Avg. Progress", value: `${stats.avgProgress}%`, icon: TrendingUp, color: "bg-purple-50 text-purple-700" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "integrations" ? (
        <IntegrationsSettings />
      ) : courses.length === 0 ? (
        <div className="text-center py-10 border rounded-xl bg-gray-50">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <button 
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Browse Courses
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course._id} className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              {course.thumbnail ? (
                <div className="relative h-48 overflow-hidden">
                  <img 
                     src={course.thumbnail} 
                     alt={course.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.progressPercent === 100 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {course.progressPercent === 100 ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold opacity-20">{course.title.charAt(0)}</span>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{course.category || 'Course'}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{course.level || 'Beginner'}</span>
                </div>

                <h2 className="font-bold text-xl mb-2 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-grow">
                  {course.description}
                </p>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-900">Your Progress</span>
                        <span className="text-sm font-black text-blue-600">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${course.progressPercent}%` }}
                        />
                    </div>
                </div>

                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="w-full bg-gray-900 group-hover:bg-blue-600 text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-black/5 hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {course.progressPercent === 0 ? 'Start Learning' : 'Continue Learning'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
