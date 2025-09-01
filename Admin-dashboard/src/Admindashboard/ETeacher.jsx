import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import WelcomeC from "./WelcomeC";
import { FaSpinner } from "react-icons/fa";
import WelcomeE from "./WelcomeE";

const ETeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/teachers/${id}`);
        setTeacher(response.data.teacher);
        console.log(response.data);
        setLoading(false)
      } catch (error) {
        toast.error("Failed to fetch teacher data!");
        console.error("Error fetching teacher data:", error);
        setLoading(false)
      }
    };

    fetchTeacher();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true)
    try {
      const response = await axios.put(`http://localhost:8080/api/auth/teachers/${id}`, teacher);
      toast.success(response.data.message || "Teacher updated successfully!");
      setError("");
      setLoadingUpdate(false)
      navigate("/view-teacher");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update teacher!");
      toast.error(error.response?.data?.message || "Failed to update teacher!");
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
            Teacher Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={teacher.name}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John Doe"
            disabled = {loadingUpdate}
          />
        </motion.div>

        {/* Email Field */}
        <motion.div className="mb-5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Teacher Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={teacher.email}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="teacher@example.com"
            disabled = {loadingUpdate}
          />
        </motion.div>

        {/* Password Field */}
        <motion.div className="mb-5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}>
          <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="********"
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
                                    "Update Teacher"
                                  )}
        </motion.button>
      </motion.form>
    </>
  );
};

export default ETeacher;
