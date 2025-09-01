import {toast , ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import WelcomeV from "./WelcomeV";
import { FaEye, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ViewCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const[message,setMessage] = useState("");
  useEffect(() => {
    const fetchCourses = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/courses?page=${page}&limit=5`
        );
        const { courses, totalPages, totalCourses } = response.data;
        if (response.data.status === "success") {
          setCourses(courses);
          setTotalPages(totalPages);
          setTotalCourses(totalCourses);
          setMessage("")
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("An error occurred while fetching courses");
        setMessage("An error occurred while fetching courses")
      } finally {
        setLoading(false);
      }
    };
    fetchCourses(currentPage);
  }, [currentPage]);

  const navigate = useNavigate();

  const handleEdit = (studentId) => {
    navigate(`/edit-course/${studentId}`);
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const buttonHover = {
    scale: 1.1,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  };

  // Export to Excel
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/api/export-course", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "courseData.csv");
      document.body.appendChild(link);
      link.click();
      setMessage("");
      link.remove();
    } catch (err) {
      setMessage(err.response?.data?.message || "Export failed")
    }
  };

  const handleDelete = async (courseId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/courses/${courseId}`
      );
      toast.success(response.data.message || "Course deleted successfully!");
      // Update UI after successful deletion
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );

      // Decrement the totalCourses count
      setTotalCourses((prevTotal) => prevTotal - 1);
      setMessage("");
    } catch (error) {
      console.error(
        "Error deleting course:",
        error.response?.data?.error || error.message
      );
      const message =  error.response?.data?.error || "Failed to delete course.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return (
      <span className="flex items-center justify-center">
        <FaSpinner className="animate-spin mr-2" /> loading...
      </span>
    ); // Loading state while fetching data
  }

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeV />
      </div>

      <div className="relative mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {message && <p className="text-red-500 text-sm mb-5">{message}</p>}
        <div className="bg-gray-50 dark:bg-gray-800 sm:rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <h5 className="text-xl font-semibold dark:text-white">Courses</h5>
              <p className="text-gray-500 dark:text-gray-400">
                Manage all your existing Courses or add a new one
              </p>
            </div>
            <motion.button
              type="button"
              className="flex bg-indigo-500 items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:outline-none"
              whileHover={buttonHover}
            >
              <Link to="/create-course">Add New Course</Link>
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-4 dark:text-gray-300">Loading...</div>
        ) : (
          <div className="overflow-x-auto"> {/* Add this wrapper for horizontal scrolling */}
            <motion.table
              className="w-full mt-6 text-sm text-left text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Course Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Course Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <motion.tr
                    key={course._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <td className="px-6 py-4">{course.courseCode}</td>
                    <td className="px-6 py-4">{course.courseName}</td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <motion.button
                        onClick={() => openModal(course)}
                        title="view detail"
                        className="px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-all"
                        whileHover={buttonHover}
                      >
                        <FaEye />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(course._id)}
                        title="edit"
                        className="px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition-all"
                        whileHover={buttonHover}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        title="delete"
                        onClick={() => handleDelete(course._id)}
                        className="px-3 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all"
                        whileHover={buttonHover}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}

        {/* Pagination and Total Courses Section */}
        <div className="mt-4 bg-gray-50 rounded-b-lg shadow-md dark:bg-gray-800">
          <nav
            className="flex flex-wrap items-center justify-between p-4 gap-4 sm:gap-0"
            aria-label="Table navigation"
          >
            {/* View Report Button */}
            <motion.button
              type="button"
              onClick={handleClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-all duration-300"
            >
              View full report
            </motion.button>

            {/* Total Classes Info */}
            <p className="text-sm text-center sm:text-left">
              <span className="font-normal text-gray-500 dark:text-gray-400">
                Total courses:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                &nbsp;{totalCourses}
              </span>
            </p>

            {/* Pagination Controls */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <button
                type="button"
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                First
              </button>
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  disabled={currentPage === page}
                  className={`px-3 py-1 ${
                    currentPage === page
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white"
                  } rounded-md disabled:opacity-50`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
              <button
                type="button"
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </nav>
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
                <p>
                  <strong>credit Hours:</strong> {selectedCourse.creditHours}
                </p>
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 mt-2 space-y-2">
                  {selectedCourse.classes && selectedCourse.classes.length > 0 ? (
                    selectedCourse.classes.map((classItem, index) => (
                      <div key={index}>
                        <p>
                          <strong>Class Name:</strong> {classItem.class.className}-
                          {classItem.class.classCode}-{classItem.class.shift}-
                          {classItem.class.section}
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
};

export default ViewCourse;