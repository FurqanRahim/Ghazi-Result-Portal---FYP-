import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WelcomeV from "./WelcomeV";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = async (page) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/students?page=${page}&limit=10`);
      const { students, totalPages, totalStudents } = response.data;

      setStudents(students);
      setTotalPages(totalPages);
      setTotalStudents(totalStudents);
      setIsLoading(false)
    } catch (error) {
      toast.error("Failed to fetch students!");
      console.error("Error fetching students:", error);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const notify = () => toast.success("View all Existing Records of students!");
    notify();
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/api/auth/export-student", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "StudentssData.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err.response?.data?.message || "Export failed");
    }
  };

  const navigate = useNavigate();

  const handleEdit = (studentId) => {
    navigate(`/edit-student/${studentId}`);
  };

  const handleDelete = async (studentId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/auth/students/${studentId}`);
      if (response.data.message) {
        toast.success(response.data.message);
        fetchStudents(currentPage); // Refresh data after deletion
        closeModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting student");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (studentId) => {
    setStudentIdToDelete(studentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStudentIdToDelete(null);
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

    
      if (isLoading) {
        return <span className="flex items-center justify-center">
        <FaSpinner className="animate-spin mr-2" /> loading...
      </span>; // Loading state while fetching data
      }

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeV />
      </div>

      <motion.div className="relative mt-12 mx-auto max-w-full overflow-x-auto shadow-md sm:rounded-lg">
        <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-start sm:items-center justify-between p-4">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">Students</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage all your existing students or add a new one
              </p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-all duration-300"
            >
              <Link to="/create-student">Add new student</Link>
            </button>
          </div>
        </div>

        <motion.table
          className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Reg-No</th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Role</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <motion.tr
                  key={student._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition hover:bg-gray-100 dark:hover:bg-gray-600"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-4">{student.reg_No}</td>
                  <td className="px-4 py-4">{student.name}</td>
                  <td className="px-4 py-4">{student.email}</td>
                  <td className="px-4 py-4">{student.role}</td>
                  <td className="px-4 py-4 text-right flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(student._id)}
                      className="text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                      aria-label="Edit student"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openModal(student._id)}
                      className="text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
                      aria-label="Delete student"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No students found.
                </td>
              </tr>
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
               Total Students:
             </span>
             <span className="font-semibold text-gray-900 dark:text-white">
               &nbsp;{totalStudents}
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

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleDelete(studentIdToDelete)}
        studentId={studentIdToDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default ViewStudent;
