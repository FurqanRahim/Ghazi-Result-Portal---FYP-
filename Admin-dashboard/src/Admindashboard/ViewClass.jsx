import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import WelcomeV from "./WelcomeV";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const ViewClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);

  useEffect(() => {
    const fetchClasses = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/class?page=${page}&limit=5`);
        const { classes, totalPages, totalClasses } = response.data;
        if (response.data.status === "success") {
          setClasses(classes);
          setTotalPages(totalPages);
          setTotalClasses(totalClasses);
          toast.success("Classes fetched successfully");
        }
      } catch (error) {
        toast.error("Error fetching classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses(currentPage);
  }, [currentPage]);

  const navigate = useNavigate();

  const handleEdit = (studentId) => {
    navigate(`/edit-class/${studentId}`);
  };

  const handleDelete = async (classId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/classes/${classId}`);
      if (response.data.message) {
        toast.success(response.data.message || "Class deleted successfully!");
        setClasses((prevClasses) => prevClasses.filter((classItem) => classItem._id !== classId));
        setTotalClasses((prevTotal) => prevTotal - 1);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error deleting class";
      console.log("Delete error:", errorMessage);
      alert(errorMessage);
      toast.error(errorMessage);
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

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/api/export-class", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "classData.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err.response?.data?.message || "Export failed");
    }
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
    );
  }

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeV />
      </div>
      <motion.div
        className="relative mt-12 w-full max-w-[1100px] overflow-x-auto shadow-md sm:rounded-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 sm:rounded-lg hover:shadow-lg transition-shadow duration-300"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
        >
          <div className="flex flex-col p-4 space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
            <div>
              <h5 className="text-lg font-semibold dark:text-white hover:text-indigo-500 transition-colors duration-300">
                Classes
              </h5>
              <p className="text-gray-500 dark:text-gray-400">
                Manage all your existing classes or add a new one.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              className="flex bg-indigo-500 items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg shadow hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none dark:focus:ring-indigo-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <Link to="/create-class">Add new Class</Link>
            </motion.button>
          </div>
        </motion.div>

        <motion.table
          className="w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-300 mt-4 border-collapse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium">Class Name</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium">Class Code</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium">Section</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium">Study Time</th>
              <th scope="col" className="px-6 py-4 text-center text-base font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <motion.tr
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                  No classes available
                </td>
              </motion.tr>
            ) : (
              classes.map((classItem, index) => (
                <motion.tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{classItem.className}</td>
                  <td className="px-6 py-4">{classItem.classCode}</td>
                  <td className="px-6 py-4">{classItem.section}</td>
                  <td className="px-6 py-4">{classItem.shift}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        title="edit"
                        onClick={() => handleEdit(classItem._id)}
                        type="button"
                        className="p-2 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-100 transition-all"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem._id)}
                        type="button"
                        title="delete"
                        className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-all"
                      >
                        <FaTrashAlt className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </motion.table>

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
        Total classes:
      </span>
      <span className="font-semibold text-gray-900 dark:text-white">
        &nbsp;{totalClasses}
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

      </motion.div>
    </>
  );
};

export default ViewClass;