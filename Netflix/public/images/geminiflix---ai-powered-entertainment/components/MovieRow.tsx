
import React, { useRef, useState } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isRowHovered, setIsRowHovered] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="video-row"
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
      style={{ zIndex: isRowHovered ? 100 : 1 }}
    >
      <h2 className="text-[#e5e5e5] text-xl font-bold mb-3 hover:text-white cursor-pointer transition-colors duration-200">
        {title}
      </h2>

      <div className="row-container group">
        {/* Scroll Controls */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-[150] w-[4%] bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center -ml-[4%]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div
          ref={rowRef}
          className="row-content"
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="card-wrapper">
              <MovieCard
                movie={movie}
                onClick={onMovieClick}
                isFirst={index === 0}
                isLast={index === movies.length - 1}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-[150] w-[4%] bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
