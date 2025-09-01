import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";


const ViewResult = ({studentId}) => {
  const [sessions, setSessions] = useState([]);
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSession, setSelectedSession] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// Fetch sessions, courses, and classes when component mounts
useEffect(() => {
  setLoading(true);
  axios.get(`http://localhost:8080/api/course-years/${studentId}`)
    .then(res => {
      setSessions(res.data.years);
      setLoading(false);
    })
    .catch(() => {
      setSessions([]);
      setLoading(false);
    });
}, [studentId]);

useEffect(() => {
  if (selectedSession) {
    setLoading(true);
    axios.get(`http://localhost:8080/api/students/${studentId}?year=${selectedSession}`)
      .then((res) => {
        const extractedCourses = res.data.courses.flatMap(enrollment => enrollment.course || []);
        console.log(res.data.courses); // Log the response for debugging
        setCourses(extractedCourses);

        // Extract classes
        const extractedClasses = res.data.courses.flatMap(enrollment => enrollment.class || []);
        setClasses(extractedClasses);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setClasses([]);
        setLoading(false);
      });
  }
}, [selectedSession,studentId]);

useEffect(() => {
  const fetchStudentResults = async () => {
    if (selectedClass) {
      setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/student-result/${studentId}/${selectedClass}`
      );
      console.log(response.data)
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results");
      setLoading(false);
    }
  }
  };

  fetchStudentResults();
  
}, [selectedClass]);

// Fetch students whenever course and class selections change
useEffect(() => {
  const fetchStudentResults = async () => {
    if (selectedCourse && selectedClass) {
      setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/student-result/${studentId}/${selectedClass}/${selectedCourse}`
      );
      console.log(response.data)
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results");
      setLoading(false);
    }
  }
  };

  fetchStudentResults();
  
}, [selectedCourse, selectedClass]);

const calculateGPA = (marksDetails) => {
  if (!marksDetails || marksDetails.length === 0) return 0;

  let totalQualityPoints = 0;
  let totalCreditHours = 0;

  marksDetails.forEach((result) => {
    totalQualityPoints += result.qualitypoint || 0;
    totalCreditHours += result.creditHours || 0;
  });

  if (totalCreditHours === 0) return 0;

  const gpa = totalQualityPoints / totalCreditHours;
  return gpa.toFixed(2); // Round to 2 decimal places
};

const gpa = results ? calculateGPA(results.marksDetails) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 animate-fade-in">
          Student Result
        </h1>
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
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.courseCode}-{course.courseName}
                            </option>
                        ))}
                    </select>
                </motion.div> 

                
        <motion.div
          className="bg-white mt-4 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden animate-slide-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            
            <div className="space-y-6">
              {results && results.marksDetails ? (
                results.marksDetails.map((result, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg hover:shadow-md transition-shadow duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Course:{" "}
                      <span className="text-purple-600 dark:text-purple-400">
                        {result.course}
                      </span>
                    </h3>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Credit Hours:{" "}
                      <span className="text-purple-600 dark:text-purple-400">
                        {result.creditHours}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Class:{" "}
                        <span className="font-semibold">{result.className}</span> (
                        {result.classCode})
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Shift:{" "}
                        <span className="font-semibold">{result.shift}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Section:{" "}
                        <span className="font-semibold">
                          {result.section || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Teacher:{" "}
                        <span className="font-semibold">{result.teacher}</span>
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Mid Marks
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {result.mid}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Session Marks
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {result.session}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Final Marks
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {result.Final}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quality Point
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {result.qualitypoint}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Grade
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {result.grade}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Sataus
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {result.status}
                        </p>
                      </div>
                    </div>
                    {!selectedCourse?<div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Course Marks
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        {result.totalCourseMarks}
                      </p>
                      
                    </div>:""}
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  No results found for this student.
                </p>
              )}
            </div>
            <div className="mt-8 text-center">
              {results && results.totalMarks ? (
                <p className="text-xl font-bold text-orange-600">
                  Total Marks: {results.totalMarks}
                </p>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Total marks not available.
                </p>
                
              )}
              {!selectedCourse?<p className="text-xl font-bold text-green-600 mt-2">
                    GPA: {gpa}
                  </p>:""}
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default ViewResult;