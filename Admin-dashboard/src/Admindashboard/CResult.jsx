import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import WelcomeC from "./WelcomeC";

const StudentDropdown = ({ students, selectedStudent, handleStudentSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get selected student name
  const selectedStudentName =
    students.find((s) => s._id === selectedStudent)?.name || "Select a Student";

  return (
    <motion.div className="relative mb-5">
      <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
        Select Student
      </label>

      {/* Dropdown button */}
      <div
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedStudentName}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ⬇️
        </motion.span>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <motion.ul
          className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {students.map((student) => (
            <li
              key={student._id}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                handleStudentSelect({ target: { value: student._id } });
                setIsOpen(false); // Close dropdown after selection
              }}
            >
              {student.name} ({student.reg_No})
            </li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

const CResult = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourses, setSelectedCourses] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherTotalPages, setTeacherTotalPages] = useState(1);

  const pageSize = 5;
  const [marks, setMarks] = useState({
    mid: 0,
    session: 0,
    Final: 0
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        let allStudents = [];
        let currentPage = 1;
        let totalPages = 1;

        // Fetch students data page by page
        do {
          const response = await axios.get(
            `http://localhost:8080/api/auth/students?page=${currentPage}&size=20`
          );
          const { students, totalPages: backendTotalPages } = response.data;
          allStudents = [...allStudents, ...students];
          totalPages = backendTotalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        // Map the data for react-select
        const sortedStudents = allStudents.sort((a, b) => 
          a.reg_No.localeCompare(b.reg_No)
        );
        setStudents(sortedStudents);
      } catch (error) {
        console.error("Error fetching students", error);
        toast.error("Error fetching student registration numbers.");
      }
    };



    fetchRegistrations();
  }, []);

  useEffect(() => {
    const fetchClasses = async (page, size) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/class?page=${page}&size=${size}`
        );
        setClasses(response.data.classes || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    };

    fetchClasses(currentPage, pageSize);
  }, [currentPage]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = selectedClass
          ? `http://localhost:8080/api/courses/class/${selectedClass}`
          : "http://localhost:8080/api/courses";

        const response = await axios.get(url);
        if (response.data.status === "success") {
          // Combine multiple pages of courses if pagination exists
          let allCourses = response.data.courses;

          if (response.data.totalPages > 1) {
            for (let i = 2; i <= response.data.totalPages; i++) {
              const additionalResponse = await axios.get(
                `${url}?page=${i}`
              );
              allCourses = [...allCourses, ...additionalResponse.data.courses];
            }
          }
          setCourses(allCourses);
        } else {
          setCourses([]);
          toast.info("No courses available for the selected class.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Error fetching courses. Please try again.");
        setCourses([]);
      }
    };


    fetchCourses();
  }, [selectedClass]);

  const handleCourseSelect = (courseId) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  useEffect(() => {
    // const notify = () => toast.success("Welcome to Create New Result!");
    // notify();

    const fetchData =async () =>{
      try {
        let allTeachers = [];
        let currentPage = 1;
        let totalPages = 1;
        do{
        const response = await axios.get(`http://localhost:8080/api/auth/teachers?page=${currentPage}&size=20`);
        const { teachers, totalPages: backendTotalPages } = response.data;
        allTeachers = [...allTeachers, ...teachers];
        totalPages = backendTotalPages;
        currentPage++;
      } while (currentPage <= totalPages);
        setTeachers(allTeachers);
        // setTeacherTotalPages(response.data.totalPages || 1);
      } catch (error) {
        toast.error("Failed to fetch teachers.");
      }
    }
    fetchData();
    }, []);

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, Math.min(parseInt(value) || 0, getMaxMarks(name)));
    setMarks(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const getMaxMarks = (type) => {
    switch(type) {
      case 'mid': return 18;
      case 'session': return 6;
      case 'Final': return 32;
      default: return 0;
    }
  };

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    // Find selected student to get their registration number
    const student = students.find(s => s._id === studentId);
    if (student) {
      // You might want to do something with the selected student's data
      console.log("Selected student reg_No:", student.reg_No);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedClass || !selectedCourses || !selectedTeacher) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // Find selected student to get their registration number
    const selectedStudentData = students.find(s => s._id === selectedStudent);
    if (!selectedStudentData) {
      setMessage("Invalid student selection.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/add-result",
        {
          registrationNumber: selectedStudentData.reg_No, // Using the actual registration number
          classId: selectedClass,
          courseId: selectedCourses,
          teacherId: selectedTeacher,
          ...marks
        }
      );

      if (response.data.message) {
        toast.success("Result added successfully");
        setMessage("");
        // Reset form
        setSelectedStudent("");
        setSelectedClass("");
        setSelectedCourses("");
        setSelectedTeacher("");
        setMarks({ mid: 0, session: 0, Final: 0 });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred while adding result.");
      toast.error(error.response?.data?.message || "Failed to add result");
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
        <motion.form
          className="max-w-sm mx-auto mt-14"
          onSubmit={handleSubmit}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
           <StudentDropdown
        students={students}
        selectedStudent={selectedStudent}
        handleStudentSelect={handleStudentSelect}
      />
          {/* <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Student
            </label>
            <motion.select
  value={selectedStudent}
  onChange={handleStudentSelect}
  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
  required
  whileHover={{ scale: 1.02 }}
  size={10} // Shows 5 items at a time, scrolls if more
>
  <option value="">Select a Student</option>
  {students.map((student) => (
    <option key={student._id} value={student._id}>
      {student.name} ({student.reg_No})
    </option>
  ))}
</motion.select>

          </motion.div> */}

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
             <label htmlFor="class-select" className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Class
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            >
              <option value="">-- Select a Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} {cls.classCode} {cls.shift} {cls.section}
                </option>
              ))}
            </select>
            <div className="flex justify-between mt-3">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <label htmlFor="course-select" className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Course(s)
            </label>
            <div
              id="course-select"
              className="space-y-3 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            >
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${course._id}`}
                      name="course"
                      value={course._id}
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCourseSelect(course._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`${course._id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {course.courseName}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No courses available for the selected class.
                </p>
              )}
            </div>
          </motion.div>

          <div className="mb-5">
  <label htmlFor="teacher" className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
    Select Teacher
  </label>
  <select
    id="teacher"
    value={selectedTeacher}
    onChange={(e) => setSelectedTeacher(e.target.value)}
    size={8} // Shows a scrollable list of 8 items
    className="w-full px-3 py-3 text-sm bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
  >
    <option value="" disabled hidden className="text-gray-400">
      Choose a teacher
    </option>
    {teachers.map((teacher) => (
      <option
        key={teacher._id}
        value={teacher._id}
        className={`p-2 my-1 rounded-md ${
          selectedTeacher === teacher._id
            ? "bg-blue-500 text-white font-semibold" // Highlight selected option
            : "hover:bg-gray-100 dark:hover:bg-gray-700" // Hover effect for other options
        }`}
      >
        {teacher.name}
      </option>
    ))}
  </select>
</div>
          

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Marks
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mid (0-18)
                </label>
                <motion.input
                  type="number"
                  name="mid"
                 
                  onChange={handleMarksChange}
                  min="0"
                  max="18"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session (0-6)
                </label>
                <motion.input
                  type="number"
                  name="session"
                  
                  onChange={handleMarksChange}
                  min="0"
                  max="6"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Final (0-36)
                </label>
                <motion.input
                  type="number"
                  name="Final"
                  
                  onChange={handleMarksChange}
                  min="0"
                  max="36"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
            </div>
          </motion.div>

          {message && (
            <motion.p
              className="text-red-500 text-sm mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="text-white text-sm ml-2 mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            Add Result
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default CResult;




