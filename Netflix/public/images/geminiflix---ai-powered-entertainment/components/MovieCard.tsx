import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isFirst, isLast }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine origin for scaling
  const origin = isFirst ? 'left center' : isLast ? 'right center' : 'center center';

  return (
    <motion.div
      className="relative w-full aspect-video rounded-md cursor-pointer bg-[#181818]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
      // Base styles via standard logic
      style={{
        transformOrigin: origin,
        zIndex: isHovered ? 50 : 10
      }}
      // Hover Animation
      animate={{
        scale: isHovered ? 1.4 : 1,
      }}
      transition={{
        duration: 0.4,
        delay: isHovered ? 0.5 : 0, // 0.5s delay before expanding
        type: 'spring',
        bounce: 0.3
      }}
    >
      {/* Thumbnail Image */}
      <img
        src={movie.backdropUrl}
        alt={movie.title}
        className="w-full h-full object-cover rounded-md shadow-md"
      />

      {/* Mini-Player Overlay (Revealed on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }} // Fast exit
            transition={{ duration: 0.3, delay: 0.4 }} // Appear slightly after the scale starts
            className="absolute left-0 right-0 top-[98%] bg-[#181818] rounded-b-md shadow-xl p-4 flex flex-col gap-3 -mt-1"
            style={{ zIndex: 60, boxShadow: '0 10px 20px rgba(0,0,0,0.9)' }}
          >
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play Button - Solid White Circle */}
                <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                </button>
                {/* Plus Button - Outlined Circle */}
                <button className="w-8 h-8 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                {/* Like Button - Outlined Circle */}
                <button className="w-8 h-8 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                </button>
              </div>
              {/* More Info / Chevron - Outlined Circle */}
              <button className="w-8 h-8 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>

            {/* Metadata (New Line 1) */}
            <div className="flex items-center flex-wrap gap-x-2 text-[11px] font-semibold text-white">
              <span className="text-[#46d369] font-black">{movie.matchScore || 95}% Match</span>
              <span className="border border-gray-400 text-gray-200 px-1 text-[10px]">U/A 13+</span>
              <span className="text-gray-200">{movie.duration || "5 Seasons"}</span>
              <span className="border border-white/60 px-1 rounded-[2px] text-[9px] text-white/80">HD</span>
            </div>

            {/* Genres (New Line 2) */}
            <div className="flex items-center gap-1.5 text-[10px] text-white h-full items-end pb-1">
              {movie.genres.slice(0, 3).map((g, i) => (
                <span key={i} className="flex items-center">
                  <span className="text-gray-200">{g}</span>
                  {i < Math.min(movie.genres.length, 3) - 1 && <span className="text-gray-500 mx-1">•</span>}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MovieCard;
