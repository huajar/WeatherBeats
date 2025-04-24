import React from 'react';
import { motion } from 'framer-motion';

const MusicRecommendations = ({ recommendations }) => {
  if (!recommendations) {
    return null;
  }

  const openSpotify = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
            className="py-2 flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
          >
            {song.imageUrl && (
              <img 
                src={song.imageUrl} 
                alt={`${song.album} cover`} 
                className="w-12 h-12 object-cover rounded-md shadow-sm"
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{song.title}</h3>
              <p className="text-gray-700 text-xs truncate">{song.artist}</p>
              <p className="text-gray-500 text-xs truncate">
                Album: <span className="font-light">{song.album}</span>
              </p>
            </div>
            
            {song.spotifyUrl && (
              <motion.button
                onClick={() => openSpotify(song.spotifyUrl)}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md text-xs flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </motion.button>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default MusicRecommendations;