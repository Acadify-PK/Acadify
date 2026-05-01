import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import InstructorDashboard from "./pages/InstructorDashboard";

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
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
