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

const CResult = ({teacherId}) => {
    const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  
  const [selectedSession, setSelectedSession] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  const [marks, setMarks] = useState({
    mid: 0,
    session: 0,
    Final: 0
  });
  const [message, setMessage] = useState("");

 


 // Fetch sessions, courses, and classes when component mounts
 useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:8080/api/teacher/${teacherId}/sessions`)
      .then(res => {
        setSessions(res.data.sessions);
        setIsLoading(false);
      })
      .catch(() => {
        setSessions([]);
        setIsLoading(false);
      });
  }, [teacherId]);

  useEffect(() => {
    if (selectedSession) {
      setIsLoading(true);
      axios.get(`http://localhost:8080/api/teacher/${teacherId}?session=${selectedSession}`)
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
  }, [selectedSession, teacherId]);

  // Fetch students whenever course and class selections change
  useEffect(() => {
    if (selectedCourse && selectedClass) {
      setIsLoading(true);
      axios.get(`http://localhost:8080/api/enrolled-student?courseId=${selectedCourse}&classId=${selectedClass}`)
        .then(res => {
          setStudents(res.data.students);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching students:', err);
          setIsLoading(false);
        });
    } else {
      setStudents([]);
    }
  },[selectedCourse, selectedClass]);


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

    if (!selectedStudent || !selectedClass || !selectedCourse) {
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
          courseId: selectedCourse,
          teacherId,
          ...marks
        }
      );

      if (response.data.message) {
        toast.success("Result added successfully");
        setMessage("");
        // Reset form
        setSelectedStudent("");
        setSelectedClass("");
        setSelectedCourse("");
        setMarks({ mid: 0, session: 0, Final: 0 });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred while adding result.");
      toast.error(error.response?.data?.message || "Failed to add result");
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
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseCode}-{course.courseName}
                </option>
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
        
          <StudentDropdown
        students={students}
        selectedStudent={selectedStudent}
        handleStudentSelect={handleStudentSelect}
      />

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
                  Mid 
                </label>
                <motion.input
                  type="number"
                  name="mid"
                 
                  onChange={handleMarksChange}
                  min="0"
                  
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
                  Final 
                </label>
                <motion.input
                  type="number"
                  name="Final"
                  
                  onChange={handleMarksChange}
                  min="0"
                  
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




