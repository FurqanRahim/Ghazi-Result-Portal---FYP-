import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

const cardColors = [
  "bg-blue-500", "bg-green-500", "bg-red-500", 
  "bg-yellow-500", "bg-purple-500", "bg-pink-500"
];

export default function TeacherCourses({ teacherId }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/teacher/${teacherId}/sessions`)
      .then(res => setSessions(res.data.sessions))
      .catch(() => setSessions([]));
  }, [teacherId]);

  useEffect(() => {
    if (selectedSession) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/teacher/${teacherId}?session=${selectedSession}`)
        .then(res => setCourses(res.data.courses))
        .catch(() => setCourses([]))
        .finally(() => setLoading(false));
    }
  }, [selectedSession, teacherId]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <>
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      <motion.div
              className="w-lg relative top-2 mb-8 bg-white dark:bg-gray-800 p-2"
              initial={{ opacity: 0, y: 20 }}  // Start with a slight vertical shift and hidden
              animate={{ opacity: 1, y: 0 }}   // Fade in and move into position
              transition={{ duration: 1.2 }}    // Smooth transition for fade-in
              whileHover={{ scale: 1.05 }}     // Slight scale-up on hover for interaction
              whileTap={{ scale: 0.98 }}       // Scale down on tap for visual feedback
            >
      <h1 className="text-3xl font-bold text-center mb-6">📚 Teacher's Courses</h1>
      </motion.div>
      {/* Session Dropdown */}
      <div className="mb-6 flex justify-center">
        <select
          className="p-3 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-white w-full max-w-md transition-all focus:ring-2 focus:ring-blue-400"
          value={selectedSession || ""}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="" disabled>Select a Year</option>
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <option key={index} value={session}>{session}</option>
            ))
          ) : (
            <option value="" disabled>No Data found</option>
          )}
        </select>
      </div>

      {/* Courses Display */}
      <div className="text-center">
        {selectedSession ? (
          loading ? (
            <motion.div
              className="flex justify-center items-center h-32"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : courses.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  onClick={() => openModal(course)}
                  className={`p-5 rounded-lg shadow-md border dark:border-gray-700 text-white flex items-center space-x-4 transition-all hover:scale-105 cursor-pointer ${cardColors[index % cardColors.length]}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                   <AcademicCapIcon className="w-10 h-10 text-white" />                   <div>
                    <h3 className="text-lg font-bold">{course.courseName}</h3>
                    <p className="text-sm">Code: {course.courseCode}</p>
                    <p className="text-sm">Year: {course.year}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No courses found for this Year.</p>
          )
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Please select a Year to display courses.</p>
        )}
      </div>
    </div>

    {/* Modal */}
    <AnimatePresence>
        {showModal && selectedCourse && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xl w-full p-6 relative"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Course Details
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>
                  <strong>Course Code:</strong> {selectedCourse.courseCode}
                </p>
                <p>
                  <strong>Course Name:</strong> {selectedCourse.courseName}
                </p>
                <p>
                  <strong>Year:</strong> {selectedCourse.year}
                </p>
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 mt-2 space-y-2">
                  {selectedCourse.classes && selectedCourse.classes.length > 0 ? (
                    selectedCourse.classes.map((classItem, index) => (
                      <div key={index}>
                        <p>
                          <strong>Class Name:</strong> {classItem.class.className}-{classItem.class.classCode}-{classItem.class.shift}-{classItem.class.section}
                        </p>
                        <p>
                          <strong>Teacher:</strong>{" "}
                          {classItem.teacher ? classItem.teacher.name : "N/A"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No classes available
                    </p>
                  )}
                </div>
              </div>
              <motion.button
                onClick={closeModal}
                className="absolute top-2 right-2 px-3 py-1 text-xl font-medium text-red-500 hover:text-red-700 transition-all"
                whileHover={{ scale: 1.2 }}
              >
                &times;
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
    
  );
}
