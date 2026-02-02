
import React from 'react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie | null;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlay, onMoreInfo }) => {
  if (!movie) return <div className="h-[56.25vw] bg-neutral-900 animate-pulse" />;

  return (
    <div className="relative h-[56.25vw] w-full">
      <img 
        src={movie.backdropUrl} 
        alt={movie.title}
        className="w-full h-full object-cover brightness-[60%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      
      <div className="absolute top-[30%] left-4 md:left-12 max-w-[90%] md:max-w-[40%] space-y-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
          {movie.title}
        </h1>
        <p className="text-sm md:text-lg font-medium text-white/90 line-clamp-3 md:line-clamp-4 drop-shadow-lg">
          {movie.description}
        </p>
        
        <div className="flex items-center space-x-3 pt-2">
          <button 
            onClick={() => onPlay(movie)}
            className="bg-white text-black px-4 md:px-8 py-2 md:py-3 rounded flex items-center gap-2 font-bold hover:bg-white/90 transition text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            Play
          </button>
          <button 
            onClick={() => onMoreInfo(movie)}
            className="bg-gray-500/50 text-white px-4 md:px-8 py-2 md:py-3 rounded flex items-center gap-2 font-bold hover:bg-gray-500/40 transition text-sm md:text-base backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
