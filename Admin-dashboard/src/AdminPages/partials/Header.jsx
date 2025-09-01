import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import UserMenu from '../../AdminComponents/DropdownProfile';
import ThemeToggle from '../../AdminComponents/ThemeToggle';

function Header({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {

  return (
    <motion.header
      className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${variant === 'v2' || variant === 'v3' ? 'before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10' : 'max-lg:shadow-sm lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90'} ${variant === 'v2' ? 'dark:before:bg-gray-800' : ''} ${variant === 'v3' ? 'dark:before:bg-gray-900' : ''}`}
      initial={{ opacity: 0 }} // Fade in the whole header
      animate={{ opacity: 1 }} // Fully visible after animation
      transition={{ duration: 0.8 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-gray-200 dark:border-gray-700/60'}`}>

          {/* Header: Left side */}
          <div className="flex">

            {/* Hamburger button */}
            <motion.button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
              initial={{ x: -50, opacity: 0 }} // Start off-screen to the left
              animate={{ x: 0, opacity: 1 }} // Slide in from left to right
              transition={{ duration: 0.5 }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </motion.button>

          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />

            {/* User Menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <UserMenu align="right" />
            </motion.div>

          </div>

        </div>
      </div>
    </motion.header>
  );
}

export default Header;
