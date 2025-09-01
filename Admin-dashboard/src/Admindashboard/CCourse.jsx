import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import WelcomeC from './WelcomeC';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CCourse = () => {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [session, setSession] = useState("");
  const [creditHours,setCreditHours] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherTotalPages, setTeacherTotalPages] = useState(1);

  const [classes, setClasses] = useState([]);
  const [classPage, setClassPage] = useState(1);
  const [classTotalPages, setClassTotalPages] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/teachers?page=${teacherPage}&limit=5`);
      setTeachers(response.data.teachers);
      setTeacherTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch teachers.");
    }
  }, [teacherPage]);

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/class?page=${classPage}&limit=5`);
      setClasses(response.data.classes);
      setClassTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch classes.");
    }
  }, [classPage]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/create-course", {
        courseCode,
        courseName,
        year: session,
        creditHours,
        currentTeacher: selectedTeacher,
        class: selectedClass,
      });

      if (response.data.status === "success") {
        toast.success("Successfully created new course!");
        setCourseCode("");
        setCourseName("");
        setSession("");
        setCreditHours("")
        setSelectedTeacher("");
        setSelectedClass("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Memoized dropdowns
  const teacherDropdown = useMemo(() => (
    <div className="mb-5">
      <label htmlFor="teacher" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
        Select Teacher
      </label>
      <select
        id="teacher"
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      >
        <option value="" disabled hidden>
          Choose a teacher
        </option>
        {teachers.map((teacher) => (
          <option key={teacher._id} value={teacher._id}>
            {teacher.name}
          </option>
        ))}
      </select>
      <div className="flex justify-between items-center mt-2">
        <button
          type="button"
          onClick={() => setTeacherPage((prev) => Math.max(prev - 1, 1))}
          disabled={teacherPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">Page {teacherPage} of {teacherTotalPages}</span>
        <button
          type="button"
          onClick={() => setTeacherPage((prev) => Math.min(prev + 1, teacherTotalPages))}
          disabled={teacherPage === teacherTotalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  ), [teachers, teacherPage, teacherTotalPages, selectedTeacher, loading]);

  const classDropdown = useMemo(() => (
    <div className="mb-5">
      <label htmlFor="class" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
        Select Class
      </label>
      <select
        id="class"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      >
        <option value="" disabled hidden>
          Choose a class
        </option>
        {classes.map((classItem) => (
          <option key={classItem._id} value={classItem._id}>
            {`${classItem.classCode} - ${classItem.className} (${classItem.section}, ${classItem.shift})`}
          </option>
        ))}
      </select>
      <div className="flex justify-between items-center mt-2">
        <button
          type="button"
          onClick={() => setClassPage((prev) => Math.max(prev - 1, 1))}
          disabled={classPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">Page {classPage} of {classTotalPages}</span>
        <button
          type="button"
          onClick={() => setClassPage((prev) => Math.min(prev + 1, classTotalPages))}
          disabled={classPage === classTotalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  ), [classes, classPage, classTotalPages, selectedClass, loading]);

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeC />
      </div>
      <Link to="/attendance" >take</Link>
      <motion.form
        className="max-w-lg mx-auto p-6 mt-14 bg-white rounded-lg shadow-md dark:bg-gray-800"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div className="mb-5" whileFocus={{ scale: 1.05 }}>
          <label htmlFor="course-code" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Course Code</label>
          <input
            type="text"
            id="course-code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Enter Course Code (e.g., CS101)"
            disabled={loading}
            className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
        </motion.div>
        <motion.div className="mb-5" whileFocus={{ scale: 1.05 }}>
          <label htmlFor="course-name" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Course Name</label>
          <input
            type="text"
            id="course-name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter Course Name"
            disabled={loading}
            className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
        </motion.div>
        <motion.div className="mb-5" whileFocus={{ scale: 1.05 }}>
          <label htmlFor="session" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Session</label>
          <input
            type="text"
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            placeholder="Enter year"
            disabled={loading}
            className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
        </motion.div>
        <motion.div className="mb-5" whileFocus={{ scale: 1.05 }}>
          <label htmlFor="crdhors" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Credit Hours</label>
          <input
            type="number"
            id="crdhors"
            value={creditHours}
            onChange={(e) => setCreditHours(e.target.value)}
            placeholder="Enter Credit Hours"
            disabled={loading}
            className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
        </motion.div>
        {teacherDropdown}
        {classDropdown}
        <motion.button
          type="submit"
          className="w-md px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
        >
           {loading ? (
                          <span className="flex items-center justify-center">
                            <FaSpinner className="animate-spin mr-2" /> Creating...
                          </span>
                        ) : (
                          "Create new course"
                        )}
                    
        </motion.button>
      </motion.form>
    </>
  );
};

export default CCourse;
