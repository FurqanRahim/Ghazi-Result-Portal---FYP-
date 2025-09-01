// CCLass.js
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import WelcomeC from "./WelcomeC";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const CCLass = () => {
  const [classCode, setClassCode] = useState(""); // for class code
  const [className, setClassName] = useState(""); // for class name
  const [section, setSection] = useState(""); // for section
  const [shift, setShift] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // for loading state

  useEffect(() => {
    // const notify = () => toast.success("Welcome to Create new Class!");
    // notify();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await axios.post(
        "http://localhost:8080/api/create-class",
        { className, classCode, section, shift }
      );
      console.log(data.data);
      if (data.data.status === "success") {
        toast.success("Successfully registered new class!");
        setClassCode("");
        setClassName("");
        setSection("");
        setShift("");
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <Loader />;

  return (
    <>
      <ToastContainer theme="dark" />

      <div className="mb-4 sm:mb-0">
        <WelcomeC />
      </div>
      <motion.form
        className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md dark:bg-gray-800 md:max-w-lg lg:max-w-lg"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Class Code Input */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label
            htmlFor="class-code"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Class Code
          </label>
          <motion.input
            type="text"
            id="class-code"
            name="classCode"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="2021-25"
            disabled = {loading}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Class Name Input */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label
            htmlFor="class-name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Class Name
          </label>
          <motion.input
            type="text"
            id="class-name"
            name="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="BS-IT-7th"
            disabled = {loading}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Section Input */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <label
            htmlFor="section"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Section
          </label>
          <motion.input
            type="text"
            id="section"
            name="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="A"
            disabled = {loading}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Shift Radio Buttons */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Shift
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <motion.div
              className="flex items-center mb-2 sm:mb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <input
                type="radio"
                id="morning"
                name="shift"
                value="Morning"
                checked={shift === "Morning"}
                onChange={() => setShift("Morning")}
                disabled = {loading}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="morning"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Morning
              </label>
            </motion.div>
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
            >
              <input
                type="radio"
                id="evening"
                name="shift"
                value="Evening"
                checked={shift === "Evening"}
                onChange={() => setShift("Evening")}
                disabled = {loading}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="evening"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Evening
              </label>
            </motion.div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="mt-4 text-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-md text-white text-sm bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" /> Creating...
                </span>
              ) : (
                "Create new Class"
              )}
          
        </motion.button>
      </motion.form>
    </>
  );
};

export default CCLass;