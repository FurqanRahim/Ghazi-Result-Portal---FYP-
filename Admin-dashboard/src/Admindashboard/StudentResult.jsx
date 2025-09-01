import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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

const StudentResult = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/students`);
        const students = response.data.results.map((result) => result.student);

        // Filter unique students based on _id
        const uniqueStudents = students.filter(
          (student, index, self) =>
            index === self.findIndex((s) => s._id === student._id)
        );

        setStudents(uniqueStudents);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch students");
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
  };

  useEffect(() => {
    if (!selectedStudent) return; // Prevent API call if no student is selected

    const fetchStudentResults = async () => {
      try {
        const studentId = selectedStudent;
        const response = await axios.get(
          `http://localhost:8080/api/student-result/${studentId}`
        );
        console.log(response.data);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch results");
        setLoading(false);
      }
    };

    fetchStudentResults();
  }, [selectedStudent]);

  const handleExportResult = async () => {
    try {
      const studentId = selectedStudent;
      const response = await axios.get(
        `http://localhost:8080/api/export-student-result/${studentId}`,
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "result.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting result data:", error);
      setError("Failed to export result data. Please try again.");
    }
  };

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
          Student Results
        </h1>
        <StudentDropdown
          students={students}
          selectedStudent={selectedStudent}
          handleStudentSelect={handleStudentSelect}
        />
        <motion.div
          className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden animate-slide-up"
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
                          Status
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {result.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Course Marks
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        {result.totalCourseMarks}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  No results found for the selected student.
                </p>
              )}
            </div>
            <div className="mt-8 text-center">
              {results && results.totalMarks ? (
                <>
                  <p className="text-xl font-bold text-orange-600">
                    Total Marks: {results.totalMarks}
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-2">
                    GPA: {gpa}
                  </p>
                </>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Total marks not available.
                </p>
              )}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex justify-center gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={handleExportResult}
              className={`px-6 py-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all duration-200 relative`}
            >
              View Excel Report
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentResult;