import React from "react";
import { motion } from "framer-motion";
import moment from "moment";

const WelcomeV = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <motion.footer
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 xl:p-10 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Flexbox container */}
        <motion.div
          className="flex flex-col items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          {/* Greeting Section */}
          <motion.div
            className="text-2xl sm:text-3xl text-indigo-600 font-extrabold tracking-tight text-center"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            Welcome, to View All Records
          </motion.div>

          {/* Date Section */}
          <motion.div
            className="text-sm text-gray-600 dark:text-gray-300 text-center"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            {moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </motion.div>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default WelcomeV;
