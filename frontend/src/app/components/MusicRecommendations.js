import React from 'react';
import { motion } from 'framer-motion';

const MusicRecommendations = ({ recommendations }) => {
  if (!recommendations) {
    return null;
  }

  return (
    <motion.div
      className="mt-4 p-3 border rounded-md shadow-sm bg-white w-full sm:w-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Music Recommendations</h2>
      <p className="text-gray-600 text-xs mb-2">{recommendations.message}</p>
      <ul className="divide-y divide-gray-200">
        {recommendations.recommendedSongs.map((song, index) => (
          <motion.li
            key={index}
            className="py-2 grid grid-cols-3 gap-x-2 items-center" // Usamos grid de 3 columnas
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
          >
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{song.title}</h3> {/* truncate para evitar desbordamiento */}
            </div>
            <div className="col-span-1">
              <p className="text-gray-700 text-xs truncate">{song.artist}</p> {/* truncate para evitar desbordamiento */}
            </div>
            <div className="col-span-1 text-right">
              <motion.span
                className="text-gray-500 text-xs"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
              >
                Album: <span className="font-light">{song.album}</span>
              </motion.span>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default MusicRecommendations;