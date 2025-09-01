import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select"; // Import react-select
import WelcomeC from "./WelcomeC";

const CEnrollment = () => {
  const [registrationNumbers, setRegistrationNumbers] = useState([]);
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Store input value for search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // Number of classes per page


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
        setRegistrationNumbers(
          allStudents.map((student) => ({
            label: student.reg_No,
            value: student.reg_No,
          }))
        );
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRegistrations.length === 0 || !selectedClass || selectedCourses.length === 0) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Show loader
    try {
      const response = await axios.post("http://localhost:8080/api/student-enrollment", {
        registrationNumbers: selectedRegistrations.map((reg) => reg.value),
        classId: selectedClass,
        courseIds: selectedCourses,
      });
      response.data.results.forEach((result) => {
        if (result.status === "success") {
          toast.success(result.message); // Show success toast for each successful enrollment
          // Clear fields after processing
          setMessage("");
          setSelectedRegistrations([]);
          setSelectedClass("");
          setSelectedCourses([]);
        } else if (result.status === "failed") {
          toast.error(result.message);
          setMessage(result.message) // Show error toast for each failed enrollment
        }
      });
        
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during enrollment.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleSearchInputChange = (inputValue) => {
    setSearchInput(inputValue);
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
        <div className="mb-5">
  <label
    htmlFor="student-reg"
    className="block mb-2 text-base font-medium text-gray-900 dark:text-gray-200 ml-2"
  >
    Select Student Registration No.
  </label>
  <div className="relative">
    <Select
      id="student-reg"
      isMulti
      options={registrationNumbers}
      value={selectedRegistrations}
      onChange={setSelectedRegistrations}
      onInputChange={handleSearchInputChange}
      placeholder="Search and select registration numbers"
      noOptionsMessage={() => "No registration number matched."}
      getOptionLabel={(e) => e.label}
      getOptionValue={(e) => e.value}
      className="text-gray-900 dark:text-white"
      classNames={{
        control: () =>
          "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500 transition-all",
        menu: () =>
          "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg",
        option: ({ isSelected, isFocused }) =>
          `p-2 transition-all ${
            isSelected
              ? "bg-indigo-500 text-white"
              : isFocused
              ? "bg-blue-400 dark:bg-blue-600 dark:text-white"
              : "text-gray-900 dark:text-gray-200"
          }`,
        input: () => "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
        singleValue: () => "text-gray-900 dark:text-white",
      }}
    />
  </div>
</div>
          <div className="mb-5">
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
          </div>
          <div className="mb-5">
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
          </div>
          {message && <p className="text-red-500 text-sm mb-5">{message}</p>}
          <button
            type="submit"
            className="text-white text-sm ml-2 mt-2 bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Enrolling ...
              </span>
            ) : (
              "Enroll Student"
            )}
          </button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default CEnrollment;
