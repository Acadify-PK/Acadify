import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);

  useEffect(() => {
    axios
      .get(`/courses/full/${id}`)
      .then((res) => {
        setCourse(res.data);

        // Set first lecture as default
        if (
          res.data.sections.length > 0 &&
          res.data.sections[0].lectures.length > 0
        ) {
          setActiveLecture(res.data.sections[0].lectures[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {/* LEFT: Video Player */}
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-4">
          {activeLecture?.title || "Select a lecture"}
        </h1>

        {activeLecture && (
          <video key={activeLecture._id} controls className="w-full rounded-lg">
            <source src={activeLecture.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* RIGHT: Course Content */}
      <div className="col-span-1 border-l pl-4">
        <h2 className="text-xl font-semibold mb-4">{course.title}</h2>

        {course.sections.map((section) => (
          <div key={section._id} className="mb-4">
            <h3 className="font-semibold mb-2">{section.title}</h3>

            <ul className="space-y-1">
              {section.lectures.map((lecture) => (
                <li
                  key={lecture._id}
                  onClick={() => setActiveLecture(lecture)}
                  className={`cursor-pointer p-2 rounded 
                    ${
                      activeLecture?._id === lecture._id
                        ? "bg-blue-100 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                >
                  ▶ {lecture.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;
