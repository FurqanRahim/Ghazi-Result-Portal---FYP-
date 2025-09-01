import React from "react";
import { motion } from "framer-motion";
import moment from "moment";

const WelcomeC = () => {
  return (
    <div className="relative top-2 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.footer
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 antialiased shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Flexbox container */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Greeting Section */}
          <motion.div
            className="text-2xl sm:text-3xl text-indigo-600 font-bold tracking-tight text-center sm:text-left"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
          >
            Welcome, to Create New Record
          </motion.div>

          {/* Date Section */}
          <motion.div
            className="text-sm sm:text-base text-gray-600 dark:text-gray-300"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            aria-live="polite"
          >
            {moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </motion.div>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default WelcomeC;