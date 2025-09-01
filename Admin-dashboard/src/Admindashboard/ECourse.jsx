import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { useParams, useNavigate } from "react-router-dom";
import WelcomeE from './WelcomeE';

const UCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [session, setSession] = useState("");
  
  const [creditHours,setCreditHours] = useState(1);
  const [teachersClasses, setTeachersClasses] = useState([]);

  const [error, setError] = useState('');

  // Store pagination details for each association
  const [pagination, setPagination] = useState([]);

  useEffect(() => {
    const notify = () => toast.info("Editing Course...");
    notify();

    const fetchCourseData = async () => {
      try {
        const courseRes = await axios.get(`http://localhost:8080/api/courses/${id}`);
        const course = courseRes.data.course;

        setCourseCode(course.courseCode);
        setCourseName(course.courseName);
        setSession(course.year);
        setCreditHours(course.creditHours);
        // Initialize teacher-class associations and pagination state
        const initialAssociations = course.classes || [];
        setTeachersClasses(initialAssociations);

        const initialPagination = initialAssociations.map(() => ({
          teacher: { page: 1, totalPages: 1 },
          class: { page: 1, totalPages: 1 },
        }));
        setPagination(initialPagination);

        // Preload data for the first association
        initialAssociations.forEach((_, index) => {
          fetchTeachers(index, 1);
          fetchClasses(index, 1);
        });
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Error fetching course details.");
      }
    };

    fetchCourseData();
  }, [id]);

  const fetchTeachers = async (index, page) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/teachers?page=${page}`);
      setTeachersClasses((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          teacherOptions: response.data.teachers,
        };
        return updated;
      });
      setPagination((prev) => {
        const updated = [...prev];
        updated[index].teacher = { page, totalPages: response.data.totalPages };
        return updated;
      });
    } catch (error) {
      console.error("Error fetching teachers", error);
      toast.error("Error fetching teachers.");
    }
  };

  const fetchClasses = async (index, page) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/class?page=${page}`);
      setTeachersClasses((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          classOptions: response.data.classes,
        };
        return updated;
      });
      setPagination((prev) => {
        const updated = [...prev];
        updated[index].class = { page, totalPages: response.data.totalPages };
        return updated;
      });
    } catch (error) {
      console.error("Error fetching classes", error);
      toast.error("Error fetching classes.");
    }
  };

  const handleTeacherClassChange = (index, field, value) => {
    setTeachersClasses((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddTeacherClass = () => {
    setTeachersClasses((prev) => [
      ...prev,
      { teacher: "", class: "", teacherOptions: [], classOptions: [] },
    ]);
    setPagination((prev) => [
      ...prev,
      { teacher: { page: 1, totalPages: 1 }, class: { page: 1, totalPages: 1 } },
    ]);
  
    // Fetch teacher and class options for the newly added association
    const newIndex = teachersClasses.length; // Index of the new entry
    fetchTeachers(newIndex, 1);
    fetchClasses(newIndex, 1);
  };

  const handleRemoveTeacherClass = (index) => {
    setTeachersClasses((prev) => prev.filter((_, i) => i !== index));
    setPagination((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/courses/${id}`, {
        courseCode,
        courseName,
        year: session,
        creditHours,
        classes: teachersClasses.map(({ teacher, class: cls }) => ({ teacher, class: cls })),
      });

      if (response.data.message) {
        toast.success("Successfully updated course!");
        setError("");
        navigate("/view-course");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeE />
      </div>
      <motion.form
        className="max-w-lg mx-auto p-4 mt-14 bg-white rounded-lg shadow-md dark:bg-gray-800"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Course Code, Course Name, and Session Inputs (same as before) */}
          {/* Course Code Input */}
         <motion.div className="mb-5">
          <label htmlFor="course-code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Course Code
          </label>
          <input
            type="text"
            id="course-code"
            name="courseCode"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg shadow-sm border-gray-300 text-gray-900"
            placeholder="Enter Course Code (e.g., CS101)"
          />
        </motion.div>

        {/* Course Name Input */}
        <motion.div className="mb-5">
          <label htmlFor="course-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Course Name
          </label>
          <input
            type="text"
            id="course-name"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg shadow-sm border-gray-300 text-gray-900"
            placeholder="Enter Course Name (e.g., Programming Fundamentals)"
          />
        </motion.div>

        {/* Session Input */}
        <motion.div className="mb-5">
          <label htmlFor="session" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Session
          </label>
          <input
            type="text"
            id="session"
            name="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg shadow-sm border-gray-300 text-gray-900"
            placeholder="Enter Session (e.g., 2024-25)"
          />
        </motion.div>
        <motion.div className="mb-5" whileFocus={{ scale: 1.05 }}>
          <label htmlFor="crdhors" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Credit Hours</label>
          <input
            type="number"
            id="crdhors"
            name='creditHours'
            value={creditHours}
            onChange={(e) => setCreditHours(e.target.value)}
            placeholder="Enter Credit Hours"
            className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
        </motion.div>
        {/* Teacher-Class Associations */}
        {teachersClasses.map((item, index) => (
  <motion.div key={index} className="mb-5">
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      Teacher-Class Association {index + 1}
    </label>
    <div className="flex flex-col gap-4">
      {/* Teachers Dropdown */}
      <div>
        <select
          value={item.teacher}
          onChange={(e) => handleTeacherClassChange(index, "teacher", e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg shadow-sm border-gray-300 text-gray-900"
        >
          <option value="">Select a teacher</option>
          {(item.teacherOptions || []).map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>
        {/* Pagination Controls for Teachers */}
        <div className="flex justify-center items-center mt-2">
          <button
            type="button"
            disabled={pagination[index]?.teacher.page <= 1}
            onClick={() => fetchTeachers(index, pagination[index].teacher.page - 1)}
            className="px-2 py-1 mx-1 text-sm text-white bg-blue-600 rounded-lg"
          >
            Prev
          </button>
          <span className="mx-2 text-sm">
            Page {pagination[index]?.teacher.page} of {pagination[index]?.teacher.totalPages}
          </span>
          <button
            type="button"
            disabled={pagination[index]?.teacher.page >= pagination[index]?.teacher.totalPages}
            onClick={() => fetchTeachers(index, pagination[index].teacher.page + 1)}
            className="px-2 py-1 mx-1 text-sm text-white bg-blue-600 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>

      {/* Classes Dropdown */}
      <div>
        <select
          value={item.class}
          onChange={(e) => handleTeacherClassChange(index, "class", e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg shadow-sm border-gray-300 text-gray-900"
        >
          <option value="">Select a class</option>
          {(item.classOptions || []).map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {`${classItem.classCode} - ${classItem.className} (${classItem.section}, ${classItem.shift})`}
            </option>
          ))}
        </select>
        {/* Pagination Controls for Classes */}
        <div className="flex justify-center items-center mt-2">
          <button
            type="button"
            disabled={pagination[index]?.class.page <= 1}
            onClick={() => fetchClasses(index, pagination[index].class.page - 1)}
            className="px-2 py-1 mx-1 text-sm text-white bg-blue-600 rounded-lg"
          >
            Prev
          </button>
          <span className="mx-2 text-sm">
            Page {pagination[index]?.class.page} of {pagination[index]?.class.totalPages}
          </span>
          <button
            type="button"
            disabled={pagination[index]?.class.page >= pagination[index]?.class.totalPages}
            onClick={() => fetchClasses(index, pagination[index].class.page + 1)}
            className="px-2 py-1 mx-1 text-sm text-white bg-blue-600 rounded-lg"
          >
            Next
          </button>
        </div>
        <button
                type="button"
                onClick={() => handleRemoveTeacherClass(index)}
                className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg shadow hover:bg-red-700"
              >
                Remove
              </button>
      </div>
      
    </div>
  </motion.div>
))}

        <button
          type="button"
          onClick={handleAddTeacherClass}
          className="px-4 py-2 mb-5 text-sm font-medium text-white bg-green-600 rounded-lg shadow hover:bg-green-700"
        >
          Add Teacher-Class Association
        </button>

        {error && <motion.div className="text-red-500 text-sm mb-4">{error}</motion.div>}

        <motion.button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
          Update Course
        </motion.button>
      </motion.form>
    </>
  );
};

export default UCourse;
