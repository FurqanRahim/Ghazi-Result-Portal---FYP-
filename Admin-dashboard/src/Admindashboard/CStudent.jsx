import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";  // Import motion for animations
import WelcomeC from "./WelcomeC";
import { FaSpinner } from "react-icons/fa";

const CStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reg_No, setReg_No] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // for loading state
  // useEffect(() => {
  //   const notify = () => toast.success(" Welcome to Create new Student!");
  //   notify();
  // }, []);

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = await axios.post("http://localhost:8080/api/auth/register-student",{ reg_No , name, email, password});
      console.log(data.data)
      if (data.data.status === "success") {
        toast.success("successfully register new Student!");
        setName("")
        setEmail("")
        setPassword("")
        setReg_No("")
        setError("")
        setLoading(false)
      }
    } catch (err) {
      toast.error(err);
      setError(err.response?.data?.message || "Something wrong");
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
                <WelcomeC />
              </div>
              <motion.form
      className="max-w-md mx-auto mt-14 p-5 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:p-6 lg:p-8"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}  // Start slightly below and hidden
      animate={{ opacity: 1, y: 0 }}   // Fade in and slide up
      transition={{ duration: 0.8 }}    // Smooth transition
    >
      {/* Name Field */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <label
          htmlFor="name"
          className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
        >
          Your Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ahmad"
          disabled = {loading}
        />
      </motion.div>

      {/* Email Field */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <label
          htmlFor="email"
          className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
        >
          Your Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
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
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            className="w-full pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@example.com"
            disabled = {loading}
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <label
          htmlFor="password"
          className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
        >
          Your Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          disabled = {loading}
        />
      </motion.div>

      {/* Registration Number Field */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <label
          htmlFor="registration"
          className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
        >
          Your Registration No.
        </label>
        <input
          type="text"
          id="registration"
          name="reg_No"
          value={reg_No}
          onChange={(e) => setReg_No(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          placeholder="2021-gu-703"
          disabled = {loading}
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
        whileHover={{ scale: 1.05 }} // Scale button up on hover
        whileTap={{ scale: 0.98 }}   // Scale button down when clicked
        transition={{ type: "spring", stiffness: 300 }}
      >
        {loading ? (
                        <span className="flex items-center justify-center">
                          <FaSpinner className="animate-spin mr-2" /> register...
                        </span>
                      ) : (
                        "Register Student Account"
                      )}
                  
      </motion.button>
    </motion.form>
    </>
    
  );
};

export default CStudent;
