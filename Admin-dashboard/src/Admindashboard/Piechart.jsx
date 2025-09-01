import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { useThemeProvider } from "./../utils/ThemeContext";  // Path to your ThemeContext
import { motion } from "framer-motion"; // Import motion for animations

ChartJs.register(Tooltip, Title, ArcElement, Legend);

const Piechart = () => {
  const { currentTheme } = useThemeProvider(); // Access the current theme from the context

  const data = {
    datasets: [
      {
        data: [10, 20, 30],
        // Colors change dynamically based on the theme
        backgroundColor: currentTheme === "dark"
          ? ["#f472b6", "#22d3ee", "#fb7185"] // Dark theme colors
          : ["#ec4899", "#16a34a", "#3b82f6"], // Light theme colors
      },
    ],
    labels: [
      "Enroll Student",
      "Assign Course to Student",
      "At least one Course Assign to the Student",
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: currentTheme === "dark" ? "#fff" : "#1f2937", // Text color for legend
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full">
      <motion.div
        className="w-full max-w-xs sm:max-w-md lg:max-w-lg"
        initial={{ opacity: 0, scale: 0.8, y: 50 }} // Start with low opacity, small scale, and some vertical translation
        animate={{
          opacity: 1,  // Fade in to full opacity
          scale: 1,    // Scale to original size
          y: 0,        // Move to original vertical position
        }}
        transition={{
          duration: 1.5, // Slow transition
          ease: "easeOut", // Smooth deceleration
        }}
      >
        <div className="relative h-64">
          <Pie data={data} options={options} />
        </div>
      </motion.div>
    </div>
  );
};

export default Piechart;
