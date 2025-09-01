import React from "react";
import { Bar as BarChart } from "react-chartjs-2";
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useThemeProvider } from "./../utils/ThemeContext"; // Adjust the path to your ThemeContext
import { motion } from "framer-motion"; // Import motion from framer-motion

ChartJs.register(Tooltip, Title, ArcElement, Legend, CategoryScale, LinearScale, BarElement);

const Bar = () => {
  const { currentTheme } = useThemeProvider(); // Fetch current theme from ThemeContext

  // Define the labels manually (e.g., months or other categories)
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // Define the colors for bars based on the theme
  const barColors = currentTheme === 'dark'
    ? [
        'rgba(255, 99, 132, 0.6)', // Dark theme colors
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(201, 203, 207, 0.6)',
      ]
    : [
        'rgba(255, 99, 132, 0.2)', // Light theme colors
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ];

  const borderColors = currentTheme === 'dark'
    ? [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ]
    : [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ];

  const data = {
    labels: labels,
    datasets: [
      {
        axis: 'y',
        label: 'Course Enrollment Board',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow dynamic resizing
    scales: {
      x: {
        ticks: {
          color: currentTheme === 'dark' ? '#fff' : '#1f2937', // Change x-axis ticks color (month names)
        },
      },
      y: {
        ticks: {
          color: currentTheme === 'dark' ? '#fff' : '#1f2937', // Change y-axis ticks color if needed
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: currentTheme === 'dark' ? '#fff' : '#1f2937', // Adjust legend text color for dark/light theme
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[1200px] h-[400px] md:h-[500px] lg:h-[600px]"
        initial={{ opacity: 0, y: 50, scale: 0.95, rotate: 10 }} // Initial state with low opacity, translation, and rotation
        animate={{
          opacity: 1, // Fade in to full opacity
          y: 0, // Move to final vertical position
          scale: 1, // Scale to normal size
          rotate: 0, // Remove rotation
        }}
        transition={{
          duration: 2, // Slow down the motion (longer duration)
          ease: "easeOut", // Smooth easing for slower transitions
        }}
      >
        <BarChart data={data} options={options} />
      </motion.div>
    </div>
  );
};

export default Bar;
