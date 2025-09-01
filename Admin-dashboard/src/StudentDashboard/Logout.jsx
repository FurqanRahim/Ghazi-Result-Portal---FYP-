import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion'; // Import motion from framer-motion

const Logout = () => {
  const navigate = useNavigate();

  // Function to handle the logout
  const handleLogout = async () => {
    try {
        const { data } = await axios.post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true });

        if (data.status === "success") {
            toast.success("Logout successfully.");
            
            // Clear any stored authentication tokens (if applicable)
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            // Redirect to login page
            navigate("/login");
        }
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Failed to logout. Please try again.");
    }
};

  return (
   <motion.section
       className="bg-white dark:bg-gray-950 min-h-screen flex items-center justify-center mt-4"
       initial={{ opacity: 0 }} // Start with zero opacity
       animate={{ opacity: 1 }} // Fade in to full opacity
       transition={{ duration: 0.7 }} // Smooth fade-in effect
     >
       <div className="py-8 px-4 w-full max-w-screen-xl lg:py-16 lg:px-6">
         <div className="w-full max-w-screen-sm mx-auto text-center">
           <motion.h1
             className="mb-4 text-4xl sm:text-6xl md:text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-red-500"
             initial={{ y: -50, opacity: 0 }} // Slide and fade in from above
             animate={{ y: 0, opacity: 1 }} // Slide and fade to normal position
             transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
           >
             Logout
           </motion.h1>
   
           <motion.p
             className="mb-4 text-xl sm:text-2xl md:text-3xl tracking-tight font-bold text-gray-900 dark:text-white"
             initial={{ y: -30, opacity: 0 }} // Slide and fade in from above
             animate={{ y: 0, opacity: 1 }} // Slide and fade to normal position
             transition={{ duration: 0.7, delay: 0.2 }}
           >
             Are you sure you want to log out?
           </motion.p>
   
           <motion.p
             className="mb-6 text-sm sm:text-base md:text-lg font-light text-gray-500 dark:text-gray-400"
             initial={{ y: -30, opacity: 0 }} // Slide and fade in from above
             animate={{ y: 0, opacity: 1 }} // Slide and fade to normal position
             transition={{ duration: 0.7, delay: 0.4 }}
           >
             You will be signed out from your current session and redirected to the login page.
           </motion.p>
   
           <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
             <motion.button
               onClick={handleLogout}
               className="w-md sm:w-auto inline-flex justify-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-red-900"
               whileHover={{ scale: 1.05 }} // Slightly grow on hover
               whileTap={{ scale: 0.95 }} // Shrink when clicked
               transition={{ type: 'spring', stiffness: 300 }}
             >
               Logout
             </motion.button>
   
             <motion.div
               className="w-full sm:w-auto"
               initial={{ opacity: 0 }} // Start with zero opacity
               animate={{ opacity: 1 }} // Fade in to full opacity
               transition={{ duration: 0.7, delay: 0.6 }}
             >
               <Link
                 to="/"
                 className="w-md sm:w-auto inline-flex justify-center text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
               >
                 Cancel
               </Link>
             </motion.div>
           </div>
         </div>
       </div>
   
       {/* Toast Container for displaying notifications */}
       <ToastContainer theme="dark" />
     </motion.section>
  );
};

export default Logout;
