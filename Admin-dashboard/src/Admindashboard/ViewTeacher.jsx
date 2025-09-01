import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import WelcomeV from "./WelcomeV";
import axios from "axios";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaSpinner } from "react-icons/fa";

const ViewTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  useEffect(() => {
    const notify = () =>
      toast.success("View all Existing Records of Teachers!");
    notify();

    // Fetch data from the API
    const fetchTeachers = async (page) => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/teachers?page=${page}&limit=10`
        ); // Update with your API URL if needed
        const { teachers, totalPages, totalTeachers } = response.data;

        setTeachers(teachers);
        setTotalPages(totalPages);
        setTotalTeachers(totalTeachers);
        setLoading(false)
      } catch (error) {
        toast.error("Failed to fetch teachers!");
        console.error("Error fetching teachers:", error);
        setLoading(false)
      }
    };

    fetchTeachers(currentPage);
  }, [currentPage]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/export-teacher",
        {
          responseType: "blob", // Ensures the response is treated as a Blob
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TeachersData.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err);
    }
  };

  const navigate = useNavigate();
  
    const handleEdit = (studentId) => {
      navigate(`/edit-teacher/${studentId}`);
    };
    const handleDelete = async (teacherId) => {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:8080/api/auth/teachers/${teacherId}`);
        toast.success(response.data.message || 'Teacher deleted successfully!');
        
        // Update UI after successful deletion
        setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher._id !== teacherId));
    
        // Decrement the totalTeachers count
        setTotalTeachers((prevTotal) => prevTotal - 1);
      } catch (error) {
        console.error('Error deleting teacher:', error.response?.data?.error || error.message);
        toast.error(error.response?.data?.error || 'Failed to delete Teacher.');
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
      <motion.div
        className="relative mt-12 mx-auto max-w-full overflow-x-auto shadow-md sm:rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 sm:rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-start sm:items-center justify-between p-4">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">
                Teachers
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage all your existing teachers or add a new one
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <Link to="/create-teacher">Add new Teacher</Link>
            </motion.button>
          </div>
        </motion.div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-3">
                Email
              </th>
              <th scope="col" className="px-4 py-3">
                Role
              </th>
              <th scope="col" className="px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <motion.tr
                  key={teacher._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-4">{teacher.name}</td>
                  <td className="px-4 py-4">{teacher.email}</td>
                  <td className="px-4 py-4">{teacher.role}</td>
                  <td className="px-4 py-4 flex space-x-2">
                    <button
                                          onClick={() => handleEdit(teacher._id)}
                                          className="text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                                          aria-label="Edit student"
                                        >
                                          <FaEdit />
                                        </button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      title="delete"
                      className="text-red-600 dark:text-red-400 cursor-pointer"
                      onClick={() => handleDelete(teacher._id)}
                    >
                      <AiFillDelete size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
               Total Teachers:
             </span>
             <span className="font-semibold text-gray-900 dark:text-white">
               &nbsp;{totalTeachers}
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

export default ViewTeacher;
