import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>

          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-white">Weather</span>
            <span className="text-yellow-300">Beats</span>
          </h1>
        </motion.div>
        
        <div className="text-white text-sm md:text-base">
          Music recommendations based on weather
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 