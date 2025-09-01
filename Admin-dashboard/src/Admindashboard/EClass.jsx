import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import WelcomeC from "./WelcomeC";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import WelcomeE from "./WelcomeE";
const UpdateClass = ({ classCodeToUpdate }) => {
  const [classCode, setClassCode] = useState(""); // for class code
  const [className, setClassName] = useState(""); // for class name
  const [section, setSection] = useState(""); // for section
  const [shift, setShift] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing class data for the provided classCodeToUpdate
    const fetchClassData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classes/${id}`
        );
        console.log(response.data);
        const { className, classCode, section, shift } = response.data.classId;
        setClassCode(classCode);
        console.log(classCode)
        setClassName(className);
        setSection(section);
        setShift(shift);
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch class data.");
        setLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const data = await axios.put(
        `http://localhost:8080/api/classes/${id}`,
        { classCode,className, section, shift }
      );
      console.log(data.data);
      if (data.data.message) {
         toast.success("Class updated successfully!");
        setError("");
        setLoadingUpdate(false);
        navigate("/view-class")
        
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setLoadingUpdate(false);
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
        className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md dark:bg-gray-800 md:max-w-lg lg:max-w-lg"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
       
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
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            disabled = {loadingUpdate}
            className="shadow-sm bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Update Class Name"
            disabled = {loadingUpdate}
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
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Update Section"
            disabled = {loadingUpdate}
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
            <div className="flex items-center">
              <input
                type="radio"
                id="morning"
                value="Morning"
                checked={shift === "Morning"}
                onChange={() => setShift("Morning")}
                disabled = {loadingUpdate}
                className="w-4 h-4 text-blue-600 border-gray-300"
              />
              <label
                htmlFor="morning"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Morning
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="evening"
                value="Evening"
                checked={shift === "Evening"}
                onChange={() => setShift("Evening")}
                disabled = {loadingUpdate}
                className="w-4 h-4 text-blue-600 border-gray-300"
              />
              <label
                htmlFor="evening"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Evening
              </label>
            </div>
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
          className="w-full text-white text-sm bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg px-5 py-3 text-center"
        >
          {loadingUpdate ? (
                          <span className="flex items-center justify-center">
                            <FaSpinner className="animate-spin mr-2" /> updating...
                          </span>
                        ) : (
                          "Update Class"
                        )}
          
        </motion.button>
      </motion.form>
    </>
  );
};

export default UpdateClass;
