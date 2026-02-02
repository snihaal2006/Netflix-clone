import React, { useState, useEffect, useCallback } from 'react';
import { Movie, AppView, Category } from './types';
import { getMoviesByCategory, searchMovies, getAIRecommendations } from './services/geminiService';
import { movieService } from './services/movieService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieDetailsModal from './components/MovieDetailsModal';

const INITIAL_CATEGORIES = [
  "Trending Now",
  "Critically Acclaimed Movies",
  "Action Packed",
  "Binge-worthy TV Shows",
  "Hidden Gems"
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.BROWSE);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [aiRecs, setAiRecs] = useState<Movie[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [myList, setMyList] = useState<Movie[]>([]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch backend movies
      const backendMovies = await movieService.getAllMovies();
      const mappedBackendMovies: Movie[] = backendMovies.map(m => ({
        id: m.id.toString(),
        title: m.title,
        description: m.description || "No description available.",
        rating: 0, // Default
        releaseYear: 2024, // Default
        duration: "1h " + Math.floor(Math.random() * 60) + "m",
        genres: ["Local", "Thriller"],
        matchScore: Math.floor(Math.random() * 20) + 80, // Random 80-99%
        backdropUrl: movieService.getImageUrl(m.fileName),
        posterUrl: movieService.getImageUrl(m.fileName),
      }));

      const results = await Promise.all(
        INITIAL_CATEGORIES.map(async (cat) => ({
          id: cat.toLowerCase().replace(/\s+/g, '-'),
          name: cat,
          movies: await getMoviesByCategory(cat) // Keep existing mock data for other rows
        }))
      );

      // Prepend local movies as a new category if found
      if (mappedBackendMovies.length > 0) {
        results.unshift({
          id: 'available-locally',
          name: 'Available Locally (From Backend)',
          movies: mappedBackendMovies
        });
      }

      setCategories(results);

      // Set hero movie from first category (which might be local now)
      if (results[0].movies.length > 0) {
        setHeroMovie(results[0].movies[0]);
      }
    } catch (error) {
      console.error("Failed to load browse data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setView(AppView.SEARCH);
    const results = await searchMovies(query);
    setSearchResults(results);
    setLoading(false);
  };

  const handleAiRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setLoading(true);
    const recs = await getAIRecommendations(aiPrompt);
    setAiRecs(recs);
    setLoading(false);
  };

  const handlePlay = (movie: Movie) => {
    alert(`Starting playback of: ${movie.title}\n(Simulated integration)`);
  };

  const renderContent = () => {
    if (loading && view === AppView.BROWSE && categories.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (view) {
      case AppView.SEARCH:
        return (
          <div className="pt-24 px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            {loading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map(movie => (
                  <div key={movie.id} onClick={() => setSelectedMovie(movie)} className="cursor-pointer group">
                    <img src={movie.posterUrl} className="w-full aspect-[2/3] object-cover rounded shadow-lg group-hover:scale-105 transition" />
                    <p className="mt-2 text-sm font-bold truncate">{movie.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No results found. Try searching for something else.</p>
            )}
          </div>
        );

      case AppView.MY_LIST:
        return (
          <div className="pt-24 px-4 md:px-12 min-h-[80vh]">
            <h2 className="text-2xl font-bold mb-6">My List</h2>
            {myList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {myList.map(movie => (
                  <div key={movie.id} onClick={() => setSelectedMovie(movie)} className="cursor-pointer">
                    <img src={movie.posterUrl} className="w-full aspect-[2/3] object-cover rounded shadow-lg" />
                    <p className="mt-2 text-sm font-bold truncate">{movie.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <p>You haven't added anything to your list yet.</p>
              </div>
            )}
          </div>
        );

      case AppView.AI_RECOMMENDER:
        return (
          <div className="pt-24 px-4 md:px-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">AI Movie Guide</h2>
                  <p className="text-lg text-gray-300">Tell Gemini what you're in the mood for, your favorite genres, or even a weirdly specific vibe. We'll find your next obsession.</p>
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z" /><path d="M12 12L2.1 12.3" /><path d="M12 12l9.8-.3" /><path d="M12 12l-3 9" /><path d="M12 12l3 9" /><path d="M12 12l-9-3" /><path d="M12 12l9-3" /></svg>
                </div>
              </div>

              <form onSubmit={handleAiRecommend} className="relative mb-12">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: 'I want a mind-bending sci-fi similar to Interstellar, but with a happy ending...'"
                  className="w-full bg-black/40 border-2 border-purple-500/30 rounded-2xl px-6 py-5 text-lg outline-none focus:border-purple-500 transition-all placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={loading || !aiPrompt.trim()}
                  className="absolute right-3 top-3 bottom-3 px-8 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  {loading ? 'Thinking...' : 'Get Recs'}
                </button>
              </form>

              {aiRecs.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold mb-6 text-purple-300 uppercase tracking-widest">Our Top Picks for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiRecs.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => setSelectedMovie(movie)}
                        className="bg-black/60 rounded-2xl overflow-hidden flex cursor-pointer hover:scale-[1.02] transition border border-white/5 hover:border-purple-500/50"
                      >
                        <img src={movie.posterUrl} className="w-32 object-cover" />
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg leading-tight">{movie.title}</h4>
                            <span className="text-green-400 font-bold text-sm shrink-0 ml-2">{movie.matchScore}% Match</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-3 mb-3">{movie.description}</p>
                          <div className="flex gap-2">
                            {movie.genres.slice(0, 2).map(g => (
                              <span key={g} className="text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase font-bold">{g}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case AppView.BROWSE:
      default:
        return (
          <>
            <Hero
              movie={heroMovie}
              onPlay={handlePlay}
              onMoreInfo={(m) => setSelectedMovie(m)}
            />
            <div className="-mt-[8vw] relative z-10 pb-20">
              {categories.map((category) => (
                <MovieRow
                  key={category.id}
                  title={category.name}
                  movies={category.movies}
                  onMovieClick={(m) => setSelectedMovie(m)}
                />
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar
        currentView={view}
        setView={setView}
        onSearch={handleSearch}
      />

      <main>
        {renderContent()}
      </main>

      <footer className="pt-20 pb-10 px-4 md:px-12 text-gray-500 text-sm max-w-4xl mx-auto text-center md:text-left">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ul className="space-y-2">
            <li>Audio and Subtitles</li>
            <li>Media Center</li>
            <li>Privacy</li>
            <li>Contact Us</li>
          </ul>
          <ul className="space-y-2">
            <li>Audio Description</li>
            <li>Investor Relations</li>
            <li>Legal Notices</li>
          </ul>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Jobs</li>
            <li>Cookie Preferences</li>
          </ul>
          <ul className="space-y-2">
            <li>Gift Cards</li>
            <li>Terms of Use</li>
            <li>Corporate Information</li>
          </ul>
        </div>
        <p className="mb-4">© 1997-2024 GeminiFlix, Inc.</p>
        <button className="border border-gray-500 px-2 py-1 hover:text-white transition">Service Code</button>
      </footer>

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
};

export default App;
