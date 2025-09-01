import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const PageNotFound = () => {
  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4 mx-auto text-center">
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
        >
          <motion.h1
            className="mb-6 text-8xl font-extrabold tracking-tight text-red-600 lg:text-9xl dark:text-red-500"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            404
          </motion.h1>
          <motion.p
            className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl dark:text-gray-200"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
          >
            Oops! Page not found.
          </motion.p>
          <motion.p
            className="mb-8 text-lg text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            It seems the page you’re looking for doesn’t exist. How about heading back to our homepage?
          </motion.p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Link
              to="/" // Use Link for client-side navigation
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
              Back to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PageNotFound;
