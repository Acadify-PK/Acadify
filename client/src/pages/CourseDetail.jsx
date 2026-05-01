import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  // ⚠️ TEMP USER (until auth is built)
  const userId = "123";

  // Fetch course data
  useEffect(() => {
    axios
      .get(`/courses/full/${id}`)
      .then((res) => {
        setCourse(res.data);

        // Set default lecture
        if (
          res.data.sections.length > 0 &&
          res.data.sections[0].lectures.length > 0
        ) {
          setActiveLecture(res.data.sections[0].lectures[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Check enrollment
  useEffect(() => {
    axios
      .get("/enrollments/check", {
        params: { userId, courseId: id },
      })
      .then((res) => setEnrolled(res.data.enrolled))
      .catch((err) => console.error(err));
  }, [id]);

  // Handle enroll
  const handleEnroll = async () => {
    try {
      await axios.post("/enrollments", {
        userId,
        courseId: id,
      });

      setEnrolled(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {/* LEFT SIDE: VIDEO */}
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-2">
          {activeLecture?.title || "Select a lecture"}
        </h1>

        <p className="text-gray-500 mb-4">{course.title}</p>

        {/* Enroll Button */}
        {!enrolled && (
          <button
            onClick={handleEnroll}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enroll Now
          </button>
        )}

        {enrolled ? (
          activeLecture ? (
            <video
              key={activeLecture._id}
              controls
              className="w-full rounded-lg"
            >
              <source src={activeLecture.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Select a lecture to start</p>
          )
        ) : (
          <p className="text-red-500">Please enroll to watch this course</p>
        )}
      </div>

      {/* RIGHT SIDE: COURSE CONTENT */}
      <div className="col-span-1 border-l pl-4">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>

        {course.sections.map((section) => (
          <div key={section._id} className="mb-4">
            <h3 className="font-semibold mb-2">{section.title}</h3>

            <ul className="space-y-1">
              {section.lectures.map((lecture) => (
                <li
                  key={lecture._id}
                  onClick={() => {
                    if (enrolled) setActiveLecture(lecture);
                  }}
                  className={`cursor-pointer p-2 rounded
                    ${
                      activeLecture?._id === lecture._id
                        ? "bg-blue-100 font-medium"
                        : "hover:bg-gray-100"
                    }
                    ${!enrolled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
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
