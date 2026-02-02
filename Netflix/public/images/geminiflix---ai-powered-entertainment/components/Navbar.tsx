
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414]' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center space-x-8">
        <h1 
          className="text-red-600 text-2xl md:text-3xl font-black tracking-tighter cursor-pointer"
          onClick={() => setView(AppView.BROWSE)}
        >
          GEMINIFLIX
        </h1>
        <div className="hidden md:flex space-x-5 text-sm font-medium">
          <button 
            onClick={() => setView(AppView.BROWSE)}
            className={`hover:text-gray-300 transition ${currentView === AppView.BROWSE ? 'text-white' : 'text-gray-200'}`}
          >
            Home
          </button>
          <button className="text-gray-200 hover:text-gray-300 transition">TV Shows</button>
          <button className="text-gray-200 hover:text-gray-300 transition">Movies</button>
          <button 
            onClick={() => setView(AppView.AI_RECOMMENDER)}
            className={`hover:text-gray-300 transition flex items-center gap-1 ${currentView === AppView.AI_RECOMMENDER ? 'text-white font-bold' : 'text-purple-400'}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            AI Guide
          </button>
          <button 
            onClick={() => setView(AppView.MY_LIST)}
            className={`hover:text-gray-300 transition ${currentView === AppView.MY_LIST ? 'text-white' : 'text-gray-200'}`}
          >
            My List
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Titles, people, genres"
            className="bg-black/50 border border-white/30 text-white text-sm px-3 py-1.5 w-48 focus:w-64 transition-all duration-300 outline-none rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>
        <div className="w-8 h-8 rounded bg-blue-500 overflow-hidden cursor-pointer">
          <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
