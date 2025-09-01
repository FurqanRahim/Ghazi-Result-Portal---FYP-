import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import motion
import Piechart from "./Piechart";
import Bar from "./Bar";
import DashboardCard02 from "./DashboardCard02";
import StatisticsDashboard from "./StatisticsDashboard";

const StatisticCard = ({ title, count, color, icon }) => (
  <motion.div
    className={`flex items-center justify-around p-6 ${color} w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl space-x-2 mt-10 shadow-lg`}
    initial={{ opacity: 0, x: -150 }} // Start off more to the left
    animate={{ opacity: 1, x: 0 }} // Slow fade in and slide
    whileHover={{ scale: 1.07 }} // Slightly larger hover effect
    transition={{ 
      duration: 0.8,  // Slower transition
      ease: "easeOut",  // Ease out for smoother movement
      delay: 0.1,  // Small delay before the card appears
    }}
  >
    <div>
      <span className="text-sm font-semibold text-black-600 dark:text-black">{title}</span>
      {count === null ? (
        <h1 className="text-2xl font-bold dark:text-gray-600">Loading...</h1>
      ) : count === 0 ? (
        <h1 className="text-2xl font-bold dark:text-gray-600">No data</h1>
      ) : (
        <h1 className="text-2xl font-bold dark:text-gray-600">{count}</h1>
      )}
    </div>
    <div className="h-8 w-8 text-indigo-600">{icon}</div>
  </motion.div>
);

const Overview = () => {
  const [data, setData] = useState({
    classes: null,
    teachers: null,
    students: null,
    courses: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, courseRes, studentRes, teacherRes] = await Promise.all([
          axios.get("http://localhost:8080/api/class"),
          axios.get("http://localhost:8080/api/courses"),
          axios.get("http://localhost:8080/api/auth/students"),
          axios.get("http://localhost:8080/api/auth/teachers"),
        ]);
        setData({
          classes: classRes.data.totalClasses,
          courses: courseRes.data.totalCourses,
          students: studentRes.data.totalStudents,
          teachers: teacherRes.data.totalTeachers,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className="mb-4 sm:mb-0">
                <DashboardCard02 />
              </div>
      <div className="flex flex-wrap space-x-6 justify-center">
        <StatisticCard
          title="Total Teachers"
          count={data.teachers}
          color="bg-[#bae6fd]"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
          }
        />
        <StatisticCard
          title="Total Students"
          count={data.students}
          color="bg-[#fda4af]"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          }
        />
        <StatisticCard
          title="Total Courses"
          count={data.courses}
          color="bg-[#c7d2fe]"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
            </svg>
          }
        />
        <StatisticCard
          title="Total Classes"
          count={data.classes}
          color="bg-[#f9a8d4]"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M9 4a1 1 0 0 1 1 1v4.379a4.5 4.5 0 1 1 1 1.242V6a1 1 0 1 1 2 0v5.621a4.5 4.5 0 1 1 1-1.242V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a4.5 4.5 0 1 1-1 1.242V6a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1.242V6a1 1 0 0 1-1-1h-6a1 1 0 0 1-1 1v8a1 1 0 0 1 1 1.242V5a1 1 0 0 1-1-1h-6z" clip-rule="evenodd" />
            </svg>
          }
        />
      </div>
          <br />
          <hr />
          <br />
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="col-span-1"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Bar />
        </motion.div>
        <motion.div
          className="col-span-1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Piechart />
        </motion.div>
        
      </div> */}
      <StatisticsDashboard />
    </>
  );
};

export default Overview;
