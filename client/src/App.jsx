import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import InstructorDashboard from "./pages/InstructorDashboard";
import CourseBuilder from "./pages/CourseBuilder";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorAnalytics from "./pages/InstructorAnalytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/analytics"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <InstructorAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/course/:id"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <CourseBuilder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
