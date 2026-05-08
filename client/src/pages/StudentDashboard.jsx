import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import IntegrationsSettings from "../components/IntegrationsSettings";

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

  if (loading) {
    return <div className="p-6">Loading your courses...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Student Dashboard
        </h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === "courses" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            My Courses
          </button>
          <button 
            onClick={() => setActiveTab("integrations")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === "integrations" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            Integrations
          </button>
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
              {course.thumbnail && (
                <img 
                   src={course.thumbnail} 
                   alt={course.title} 
                   className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-lg mb-2 line-clamp-1">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {course.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">Progress</span>
                        <span className="text-xs font-bold text-blue-600">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${course.progressPercent}%` }}
                        />
                    </div>
                </div>

                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Continue Learning
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
