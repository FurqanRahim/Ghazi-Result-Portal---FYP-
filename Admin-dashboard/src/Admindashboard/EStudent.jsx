import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import WelcomeC from "./WelcomeC";
import { FaSpinner } from "react-icons/fa";
import WelcomeE from "./WelcomeE";

const EStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    reg_No: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/students/${id}`);
        setStudent(response.data.student);
        setLoading(false)
      } catch (error) {
        toast.error("Failed to fetch student data!");
        console.error("Error fetching student data:", error);
        setLoading(false)
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true)
    try {
      const response = await axios.put(`http://localhost:8080/api/auth/students/${id}`, student);
      toast.success(response.data.message || "Student updated successfully!");
      setError("")
      setLoadingUpdate(false);
      navigate("/view-student");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update student!");
      toast.error(error.response?.data?.message || "Failed to update student!");
      setLoadingUpdate(false)
    }
  };

   if (loading){ return (<span className="flex items-center justify-center">
    <FaSpinner className="animate-spin mr-2" /> Loading...
  </span>)};

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeE />
      </div>
      <motion.form
        className="max-w-md mx-auto mt-14 p-5 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:p-6 lg:p-8"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Name Field */}
        <motion.div className="mb-5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={student.name}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ahmad"
            disabled = {loadingUpdate}
          />
        </motion.div>

        {/* Email Field */}
        <motion.div className="mb-5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Your Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              id="email"
              className="w-full pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@example.com"
              disabled = {loadingUpdate}
            />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div className="mb-5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}>
          <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Your Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
          //  value={student.password}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            disabled = {loadingUpdate}
          />
        </motion.div>

        {/* Registration Number Field */}
        <motion.div className="mb-5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <label htmlFor="registration" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Your Registration No.
          </label>
          <input
            type="text"
            id="registration"
            name="reg_No"
            value={student.reg_No}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="2021-gu-703"
            disabled = {loadingUpdate}
          />
        </motion.div>

        {error && (
        <motion.div
          className="text-red-500 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {loadingUpdate ? (
                          <span className="flex items-center justify-center">
                            <FaSpinner className="animate-spin mr-2" /> updating...
                          </span>
                        ) : (
                          "Update Student"
                        )}
          
        </motion.button>
      </motion.form>
    </>
  );
};

export default EStudent;
