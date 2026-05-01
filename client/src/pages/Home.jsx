import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
