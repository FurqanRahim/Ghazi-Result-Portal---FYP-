import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import WelcomeE from "./WelcomeE";
import { useParams } from "react-router-dom";

const UEnrollment = () => {
  const { id } = useParams();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination states for classes
  const [currentClassPage, setCurrentClassPage] = useState(1);
  const [totalClassPages, setTotalClassPages] = useState(1);
  const classPageSize = 5;

  useEffect(() => {
    toast.info("Welcome to Update Enrollment!");
    fetchClasses(currentClassPage, classPageSize);
    fetchEnrollmentDetails();
  }, [currentClassPage]);

  useEffect(() => {
    if (selectedClass) {
      fetchCourses(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async (page, size) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/class?page=${page}&size=${size}`
      );
      setClasses(response.data.classes || []);
      setTotalClassPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching classes", error);
      toast.error("Error fetching classes. Please try again.");
    }
  };

  const fetchCourses = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/courses/class/${classId}`
      );
      console.log(response.data)
      if (response.data.status === "success") {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
        toast.info("No courses available for the selected class.");
      }
    } catch (error) {
      setCourses([])
      console.error("Error fetching courses", error);
      toast.error("Error fetching courses. Please try again.");
    }
  };

  const fetchEnrollmentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/enrollments/${id}`
      );
      const { student, course, class: classId } = response.data.enrollment;
      setRegistrationNumber(student.reg_No);
      setSelectedClass(classId); // Set the class ID to fetch initial courses
      setSelectedCourses(course);
      if (classId) fetchCourses(classId);
    } catch (error) {
      console.error("Error fetching enrollment details", error);
      toast.error("Error fetching enrollment details. Please try again.");
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handlePreviousPage = () => {
    if (currentClassPage > 1) {
      setCurrentClassPage(currentClassPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentClassPage < totalClassPages) {
      setCurrentClassPage(currentClassPage + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!registrationNumber || !selectedClass || selectedCourses.length === 0) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/enrollments/${id}`,
        {
          classId: selectedClass,
          courseIds: selectedCourses,
        }
      );

      if (response.data.message) {
        toast.success("Enrollment updated successfully");
        setMessage("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during update.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
        className="mb-4 sm:mb-0"
      >
        <WelcomeE />
        <motion.form
          className="max-w-sm mx-auto mt-14"
          onSubmit={handleSubmit}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5">
            <label
              htmlFor="student-reg"
              className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2"
            >
              Student Registration No.
            </label>
            <motion.input
              type="text"
              id="student-reg"
              value={registrationNumber}
              disabled
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 dark:text-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="class-select"
              className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2"
            >
              Select Class
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            >
              <option value="">-- Select a Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} {cls.classCode} {cls.shift} {cls.section}
                </option>
              ))}
            </select>
            <div className="flex justify-between mt-3">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentClassPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentClassPage} of {totalClassPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentClassPage === totalClassPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="course-select"
              className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2"
            >
              Select Courses
            </label>
            <div
              id="course-select"
              className="space-y-3 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded border dark:bg-gray-700"
            >
              {courses.length > 0 ? (
                 courses.map((course) => (
                <div key={course._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${course._id}`}
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => handleCourseSelect(course._id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label
                    htmlFor={`${course._id}`}
                    className="ml-2 text-sm font-medium"
                  >
                    {course.courseName}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No courses available for the selected class.
              </p>
            )
            }
            </div>
          </div>
          {message && <p className="text-red-500 mb-5">{message}</p>}
          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Updating ...
              </span>
            ) : (
              "Update Enrollment"
            )}
          </button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default UEnrollment;
