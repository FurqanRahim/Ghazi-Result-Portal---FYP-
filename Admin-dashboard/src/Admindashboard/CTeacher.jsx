import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion'; // Import motion from framer-motion
import WelcomeC from './WelcomeC';
import { FaSpinner } from 'react-icons/fa';

const CTeacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // for loading state
  // useEffect(() => {
  //   const notify = () => toast.success("Welcome to Create new Teacher!");
  //   notify();
  // }, []);

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = await axios.post("http://localhost:8080/api/auth/register", { name, email, password });
      if (data.data.status === "success") {
        toast.success("Successfully registered new Teacher!");
        setName("");
        setEmail("");
        setPassword("");
        setError("");
        setLoading(false)
      }
    } catch (err) {
      toast.error(err);
      setError(err.response?.data?.message || "something Wrong");
      setLoading(false)
    }
  };

  return (
    <>
    <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
                <WelcomeC />
              </div>

              <motion.form
      className="max-w-md w-full px-4 py-6 mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md sm:max-w-lg lg:max-w-lg"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.9, y: -50 }} // Initial state for form animation (small and faded)
      animate={{ opacity: 1, scale: 1, y: 0 }} // Animate to full size and opacity
      transition={{ duration: 0.7, type: 'spring', stiffness: 300 }} // Smooth entrance effect
    >
      <div className="mb-5">
        <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
          Your Name
        </label>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }} // Animate from the left
          animate={{ opacity: 1, x: 0 }} // Fade in and slide to the center
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="e.g., Ahmad"
            disabled = {loading}
          />
        </motion.div>
      </div>

      <div className="mb-5">
        <label htmlFor="email-address-icon" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
          Your Email
        </label>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }} // Animate from the left
          animate={{ opacity: 1, x: 0 }} // Fade in and slide to the center
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
          </div>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email-address-icon"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@example.com"
            disabled = {loading}
          />
        </motion.div>
      </div>

      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
          Your Password
        </label>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }} // Animate from the left
          animate={{ opacity: 1, x: 0 }} // Fade in and slide to the center
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            disabled = {loading}
          />
        </motion.div>
      </div>

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

      <motion.button
        type="submit"
        className="w-md text-white text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
        whileHover={{ scale: 1.1, rotate: 5 }} // Scale and rotate on hover
        whileTap={{ scale: 0.95 }} // Slightly shrink when clicked
        transition={{ type: "spring", stiffness: 300 }}
      >
      {loading ? (
                              <span className="flex items-center justify-center">
                                <FaSpinner className="animate-spin mr-2" /> register...
                              </span>
                            ) : (
                              "Register Teacher Account"
                            )}
      </motion.button>
    </motion.form>
    </>
  
  );
};

export default CTeacher;
