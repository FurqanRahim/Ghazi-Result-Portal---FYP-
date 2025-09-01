import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import WelcomeC from "./WelcomeC";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ViewResult = () => {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Courses filtered by selected class

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sessions, courses, and classes when component mounts
  useEffect(() => {
    axios.get("http://localhost:8080/api/sessions")
        .then(res => setSessions(res.data.sessions))
        .catch(() => setSessions([]));
}, []);


  useEffect(() => {
    if (selectedSession) {
      setIsLoading(true);
      axios.get(`http://localhost:8080/api/session-courses?session=${selectedSession}`)
        .then((res) => {
          setCourses(res.data.courses);
          const extractedClasses = res.data.courses.flatMap(course => course.classes.map(cls => cls.class));
          setClasses(extractedClasses);
          setIsLoading(false);
        })
        .catch(() => {
          setCourses([]);
          setClasses([]);
          setIsLoading(false);
        });
    }
  }, [selectedSession]);

 // Filter courses based on the selected class
 useEffect(() => {
  if (selectedClass) {
      const filtered = courses.filter(course => 
          course.classes.some(cls => cls.class._id === selectedClass)
      );
      setFilteredCourses(filtered); // Set filtered courses
  } else {
      setFilteredCourses(courses); // If no class is selected, show all courses
  }
}, [selectedClass, courses]);

  // Fetch students whenever course and class selections change
  useEffect(() => {
    async function fetchData() {
      if (selectedCourse && selectedClass) {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/api/results/${selectedClass}/${selectedCourse}`);
          if (response.data.status === "success") {
            setResults(response.data.data);
            console.log(response.data.data)
          }
        } catch (error) {
          console.error("Error fetching results:", error);
          toast.error("Failed to fetch results");
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchData();
  }, [selectedCourse, selectedClass]);

  const handleDelete = async (resultId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/results/${resultId}`);
      toast.success(response.data.message || 'Result deleted successfully!');
      setResults((prevResults) => prevResults.filter((result) => result._id !== resultId));
    } catch (error) {
      console.error('Error deleting result:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete result.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (result) => {
    return result.mid + result.session + result.Final;
  };

  if (isLoading) {
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
        className="mb-4 sm:mb-0"
      >
        <div>
          <WelcomeC />
        </div>
        <motion.div
          className="max-w-full mx-auto mt-14 p-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          {/* Session Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label
              htmlFor="session"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Year
            </label>
            <select
              id="session"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline transition-all duration-200"
            >
              <option value="">Select Year</option>
              {sessions.map((session, index) => (
                <option key={index} value={session}>{session}</option>
              ))}
            </select>
          </motion.div>
              {/* Class Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label
              htmlFor="class"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Class
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline transition-all duration-200"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}-{cls.classCode}-{cls.shift}-{cls.section}
                </option>
              ))}
            </select>
          </motion.div>
          {/* Course Dropdown */}
          <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <label
                        htmlFor="course"
                        className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    >
                        Course
                    </label>
                    <select
                        id="course"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline transition-all duration-200"
                    >
                        <option value="">Select Course</option>
                        {filteredCourses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.courseCode}-{course.courseName}
                            </option>
                        ))}
                    </select>
                </motion.div>

          

          {/* Table Container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh] mt-6">
            <motion.table
              className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2 sm:px-6">REG_No</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Student Name</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Course Code</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Course Name</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Teacher</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Mid </th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Session </th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Final </th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Total</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Quality Point</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Grade</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Class</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">Section</th>
                  <th scope="col" className="px-4 py-2 sm:px-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan="13"
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No Results available
                    </td>
                  </tr>
                ) : (
                  results.map((result, index) => {
                    const total = calculateTotal(result);
                    return (
                      <motion.tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <td className="px-4 py-2 sm:px-6">{result.student.reg_No}</td>
                        <td className="px-4 py-2 sm:px-6">{result.student.name}</td>
                        <td className="px-4 py-2 sm:px-6">{result.course.courseCode}</td>
                        <td className="px-4 py-2 sm:px-6">{result.course.courseName}</td>
                        <td className="px-4 py-2 sm:px-6">{result.teacher.name}</td>
                        <td className="px-4 py-2 sm:px-6">{result.mid}</td>
                        <td className="px-4 py-2 sm:px-6">{result.session}</td>
                        <td className="px-4 py-2 sm:px-6">{result.Final}</td>
                        <td className="px-4 py-2 sm:px-6 font-semibold">{total}</td>
                        <td className="px-4 py-2 sm:px-6">{result.qualitypoint}</td>
                        <td className={`px-4 py-2 sm:px-6 font-semibold ${
                          result.status === "Pass" ? "text-green-600" : "text-red-600"
                        }`}>
                          {result.status}
                        </td>
                        <td className="px-4 py-2 sm:px-6">{result.class.className}</td>
                        <td className="px-4 py-2 sm:px-6">{result.class.section}</td>
                        <td className="px-4 py-2 text-right sm:px-6">
                          <motion.div className="flex space-x-4 justify-end">
                            <motion.a
                              href="#"
                              className="text-blue-600 dark:text-blue-500 hover:underline"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaEdit size={18} />
                            </motion.a>
                            <motion.a
                              href="#"
                              onClick={() => handleDelete(result._id)}
                              className="text-red-600 dark:text-red-500 hover:underline"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaTrashAlt size={18} />
                            </motion.a>
                          </motion.div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </motion.table>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ViewResult;