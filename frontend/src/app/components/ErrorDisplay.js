import React from 'react';
import { motion } from 'framer-motion';

const ErrorDisplay = ({ error, onRetry }) => {
  // Determinar el tipo de error para mostrar un mensaje más específico
  const getErrorMessage = () => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && error.message) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Network error. Please check your internet connection.';
      }
      if (error.status === 404) {
        return 'City not found. Please check spelling and try again.';
      }
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again later.';
  };

  return (
    <motion.div
      className="w-full max-w-md mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{getErrorMessage()}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <motion.button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={onRetry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try again
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorDisplay; 