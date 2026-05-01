import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`/courses/full/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Course Title */}
      <h1 className="text-3xl font-bold mb-6">
        {course.title}
      </h1>

      {/* Sections */}
      {course.sections.map((section) => (
        <div key={section._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {section.title}
          </h2>

          {/* Lectures */}
          <ul className="ml-4 space-y-1">
            {section.lectures.map((lecture) => (
              <li key={lecture._id} className="text-gray-700">
                ▶ {lecture.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default CourseDetail;