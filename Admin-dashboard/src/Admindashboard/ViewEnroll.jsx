import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaEdit, FaFilter, FaTrashAlt, FaTimes } from "react-icons/fa";
import WelcomeV from "./WelcomeV";
import { Link, useNavigate } from "react-router-dom";

const ViewEnroll = () => {
  const [enroll, setEnroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEnrollments();
  }, []);

  const fetchAllEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/enrolled-students");
      if (response.data.status === "success") {
        setEnroll(response.data.enrollments);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Failed to fetch enrollments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredEnrollments = async () => {
    if (!startDate || !endDate) {
      toast.error("Both Start Date and End Date are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/enrollments", {
        params: { startDate, endDate },
      });

      if (response.data.success) {
        setEnroll(response.data.enrollments);
      } else {
        setEnroll([]);
        toast.error(response.data.error || "Failed to fetch enrollments.");
      }
    } catch (error) {
      console.error("Error fetching filtered enrollments:", error);
      toast.error("Error fetching filtered enrollments.");
    } finally {
      setLoading(false);
    }
  };

  const removeFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchAllEnrollments();
  };

  const handleEdit = (id) => {
    navigate(`/edit-enrollment/${id}`);
  };

  const handleDelete = async (enrollmentId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/enrollments/${enrollmentId}`);
      if (response.data.status === "success") {
        toast.success(response.data.message || "Enrollment deleted successfully!");
        setEnroll((prevEnrollments) => prevEnrollments.filter((enrollment) => enrollment._id !== enrollmentId));
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to delete enrollment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <motion.div
          className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        ></motion.div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeV />
      </div>

      <motion.div
        className="relative mt-12 w-full overflow-x-auto shadow-lg sm:rounded-lg bg-gray-50 dark:bg-gray-800"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Date Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
          <div className="relative group">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 dark:text-gray-500 transition" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition"
            />
          </div>
          <div className="relative group">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 dark:text-gray-500 transition" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={fetchFilteredEnrollments}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow hover:opacity-90 focus:ring-2 focus:ring-blue-500 dark:from-blue-400 dark:to-blue-600"
          >
            <FaFilter />
            <span>Filter</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={removeFilter}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white shadow hover:opacity-90 focus:ring-2 focus:ring-red-500 dark:from-red-400 dark:to-red-600"
          >
            <FaTimes />
            <span>Remove Filter</span>
          </motion.button>
        </div>

        <div className="flex flex-col space-y-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h5 className="font-bold text-gray-900 dark:text-white">Classes</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage all your existing enrollments or add a new one.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg shadow hover:opacity-90 dark:from-indigo-400 dark:to-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            <Link to="/create-enrollment">Enroll New Student</Link>
          </motion.button>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-auto max-h-[500px]">
          <motion.table
            className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
              <tr>
                {[
                  "Reg_No",
                  "Student Name",
                  "Course Code",
                  "Course Name",
                  "Year",
                  "Class Name",
                  "Class Code",
                  "Section",
                  "Study Time",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 sm:px-6 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(enroll) && enroll.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center">
                    No enrollments available
                  </td>
                </tr>
              ) : (
                Array.isArray(enroll) &&
                enroll.map((enrollment, index) => (
                  <motion.tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-4 py-2 sm:px-6">{enrollment.student.reg_No}</td>
                    <td className="px-4 py-2 sm:px-6">{enrollment.student.name}</td>
                    <td className="px-4 py-2 sm:px-6">
                      {Array.isArray(enrollment.course) ? (
                        <ul>
                          {enrollment.course.map((course, i) => (
                            <li key={i}>{course.courseCode}</li>
                          ))}
                        </ul>
                      ) : (
                        `${enrollment.course.courseCode}`
                      )}
                    </td>
                    <td className="px-4 py-2 sm:px-6">
                      {Array.isArray(enrollment.course) ? (
                        <ul>
                          {enrollment.course.map((course, i) => (
                            <li key={i}>{course.courseName}</li>
                          ))}
                        </ul>
                      ) : (
                        `${enrollment.course.courseName}`
                      )}
                    </td>
                    <td className="px-4 py-2 sm:px-6">
                      {Array.isArray(enrollment.course)
                        ? enrollment.course[0]?.year
                        : enrollment.course.year}
                    </td>
                    <td className="px-4 py-2 sm:px-6">{enrollment.class.className}</td>
                    <td className="px-4 py-2 sm:px-6">{enrollment.class.classCode}</td>
                    <td className="px-4 py-2 sm:px-6">{enrollment.class.section}</td>
                    <td className="px-4 py-2 sm:px-6">{enrollment.class.shift}</td>
                    <td className="px-4 py-2 text-right sm:px-6">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => handleEdit(enrollment._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          <FaEdit size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(enrollment._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 dark:text-red-500 hover:underline"
                        >
                          <FaTrashAlt size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </motion.table>
        </div>
      </motion.div>
    </>
  );
};

export default ViewEnroll;