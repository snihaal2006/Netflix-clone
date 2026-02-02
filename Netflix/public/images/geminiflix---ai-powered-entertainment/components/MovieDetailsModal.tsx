
import React from 'react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

// Mock data for recommendations
const SIMILAR_MOVIES: Movie[] = [
  {
    id: 'sim-1',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    rating: 8.6,
    releaseYear: 2014,
    duration: '2h 49m',
    genres: ['Sci-Fi', 'Drama'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    posterUrl: '',
    matchScore: 98
  },
  {
    id: 'sim-2',
    title: 'The Martian',
    description: 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.',
    rating: 8.0,
    releaseYear: 2015,
    duration: '2h 24m',
    genres: ['Sci-Fi', 'Adventure'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/vxJ08SvwomfKbpboCWynC3uqUg4.jpg',
    posterUrl: '',
    matchScore: 95
  },
  {
    id: 'sim-3',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    rating: 8.8,
    releaseYear: 2010,
    duration: '2h 28m',
    genres: ['Action', 'Sci-Fi'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    posterUrl: '',
    matchScore: 97
  },
  {
    id: 'sim-4',
    title: 'Gravity',
    description: 'Two astronauts work together to survive after an accident leaves them stranded in space.',
    rating: 7.7,
    releaseYear: 2013,
    duration: '1h 31m',
    genres: ['Sci-Fi', 'Thriller'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/8kZaGFiErD1UkmTa3IyDBbe5905.jpg',
    posterUrl: '',
    matchScore: 85
  },
  {
    id: 'sim-5',
    title: 'Arrival',
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    rating: 7.9,
    releaseYear: 2016,
    duration: '1h 56m',
    genres: ['Sci-Fi', 'Drama'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/x2FJsf1ElAgr63C3cRpumlwLCadi.jpg',
    posterUrl: '',
    matchScore: 92
  },
  {
    id: 'sim-6',
    title: 'Dune',
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe.',
    rating: 8.2,
    releaseYear: 2021,
    duration: '2h 35m',
    genres: ['Sci-Fi', 'Adventure'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg',
    posterUrl: '',
    matchScore: 89
  }
];

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose, onPlay }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-[#181818] rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative h-[450px] md:h-[550px]">
          <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Back Button (Top Left) - "Go Back" Exit */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-[100] p-2 bg-[#181818] text-white rounded-full hover:bg-[#333] transition focus:outline-none ring-1 ring-white/20"
            aria-label="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>

          {/* Close Button - High Z-Index & Contrast */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[100] p-2 bg-[#181818] text-white rounded-full hover:bg-[#333] transition focus:outline-none ring-1 ring-white/20"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Banner Content */}
          <div className="absolute bottom-12 left-8 md:left-12 space-y-6 max-w-xl z-20">
            {/* Branding */}
            <div className="flex items-center gap-1 select-none">
              <span className="text-[#db202c] font-black text-2xl tracking-tighter symbol">N</span>
              <span className="text-[#db202c] font-bold text-[10px] tracking-[0.2em] relative top-[1px]">SERIES</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg leading-[0.9]">{movie.title.toUpperCase()}</h2>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => onPlay(movie)}
                className="bg-white text-black px-8 py-2.5 rounded hover:bg-white/90 transition flex items-center gap-2 font-bold text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                Play
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              </button>
            </div>
          </div>

          <button className="absolute bottom-24 right-0 bg-[#181818]/60 p-2.5 border-l-2 border-white/50 hover:bg-[#181818]/80 text-white/70 hover:text-white transition z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          </button>
        </div>

        <div className="px-8 md:px-12 py-6 grid md:grid-cols-[2fr_1fr] gap-12 bg-[#181818]">
          {/* Left Column: Details */}
          <div className="space-y-6">
            {/* Metadata Row */}
            <div className="flex items-center flex-wrap gap-x-3 text-sm font-medium text-gray-400">
              <span className="text-[#46d369] font-bold text-base">{movie.matchScore || 95}% Match</span>
              <span>{movie.releaseYear}</span>
              <span>{movie.duration}</span>
              <span className="border border-gray-500 hover:border-white px-1.5 rounded-[3px] text-xs text-white cursor-default">HD</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>

            {/* Age Rating Row */}
            <div className="flex items-center gap-3">
              <span className="border border-white/40 text-white px-2 py-0.5 text-sm">U/A 13+</span>
              <span className="text-white/80 text-sm">language, nudity, tobacco use</span>
            </div>

            {/* Top 10 Badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex flex-col items-center leading-none">
                <span className="text-[#db202c] font-black text-[10px]">TOP</span>
                <span className="text-[#db202c] font-black text-xl border border-[#db202c] px-1">10</span>
              </div>
              <span className="text-white font-bold text-lg">#2 in Movies Today</span>
            </div>

            <p className="text-white text-base leading-relaxed">
              {movie.description}
            </p>
          </div>

          {/* Right Column: Cast & Genres */}
          <div className="space-y-4 text-sm mt-2">
            <div>
              <span className="text-gray-500">Cast:</span>{' '}
              <span className="text-white hover:underline cursor-pointer">Pietro Castellitto</span>,{' '}
              <span className="text-white hover:underline cursor-pointer">Giulia Michelini</span>,{' '}
              <span className="text-white hover:underline cursor-pointer">Andrea Arcangeli</span>,{' '}
              <span className="text-white hover:underline cursor-pointer italic">more</span>
            </div>
            <div>
              <span className="text-gray-500">Genres:</span>{' '}
              <span className="text-white hover:underline cursor-pointer">{movie.genres.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-500">This Movie is:</span>{' '}
              <span className="text-white hover:underline cursor-pointer">Gritty</span>,{' '}
              <span className="text-white hover:underline cursor-pointer">Emotional</span>
            </div>
          </div>
        </div>

        {/* More Like This Section - Image Only Style */}
        <div className="px-8 md:px-12 pb-12 bg-[#181818]">
          <h3 className="text-2xl font-bold mb-6 text-white">More Like This</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SIMILAR_MOVIES.map((movie) => (
              <div key={movie.id} className="bg-[#2f2f2f] rounded-md overflow-hidden hover:bg-[#333] transition group cursor-pointer relative aspect-video">
                <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300" />

                {/* Title Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 text-center">
                  <span className="text-white font-black text-xl md:text-2xl drop-shadow-md pb-2 block uppercase leading-none opacity-90">{movie.title}</span>
                </div>

                {/* Top Right Duration */}
                <div className="absolute top-2 right-2 text-xs font-semibold text-white drop-shadow-md">
                  {movie.duration}
                </div>

                {/* Top Left Badge */}
                <div className="absolute top-0 left-0 m-2">
                  <span className="border border-white/40 bg-black/30 text-white px-1.5 py-0.5 text-[10px] rounded-sm backdrop-blur-sm">HD</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <button className="bg-white/20 border-2 border-white rounded-full p-2 text-white hover:bg-white hover:text-black transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                  </button>
                </div>

                {/* Bottom Overlay - Description/Meta */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="text-[10px] text-gray-300 font-medium">
                    {movie.releaseYear}
                  </div>
                  <button className="text-gray-300 hover:text-white border-2 border-gray-400 hover:border-white rounded-full p-1.5 transition" title="Add to My List">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
