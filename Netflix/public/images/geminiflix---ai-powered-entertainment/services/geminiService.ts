
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MOVIE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      rating: { type: Type.NUMBER },
      releaseYear: { type: Type.INTEGER },
      duration: { type: Type.STRING },
      genres: { type: Type.ARRAY, items: { type: Type.STRING } },
      backdropUrl: { type: Type.STRING },
      posterUrl: { type: Type.STRING },
      matchScore: { type: Type.INTEGER }
    },
    required: ["id", "title", "description", "rating", "releaseYear", "duration", "genres", "backdropUrl", "posterUrl"]
  }
};

export const getMoviesByCategory = async (category: string): Promise<Movie[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 20 popular/realistic movies or TV shows for the category: "${category}". 
      Return high-quality placeholder image URLs from picsum.photos for backdropUrl (1280x720) and posterUrl (500x750).
      Ensure they are unique and relevant.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: MOVIE_SCHEMA
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching movies from Gemini:", error);
    // Fallback Mock Data
    return [
      {
        id: "m1",
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        rating: 8.8,
        releaseYear: 2010,
        duration: "2h 28m",
        genres: ["Sci-Fi", "Action"],
        backdropUrl: "https://picsum.photos/seed/inception/1280/720",
        posterUrl: "https://picsum.photos/seed/inception/500/750",
        matchScore: 98
      },
      {
        id: "m2",
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        rating: 9.0,
        releaseYear: 2008,
        duration: "2h 32m",
        genres: ["Action", "Crime"],
        backdropUrl: "https://picsum.photos/seed/darkknight/1280/720",
        posterUrl: "https://picsum.photos/seed/darkknight/500/750",
        matchScore: 99
      },
      {
        id: "m3",
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        rating: 8.6,
        releaseYear: 2014,
        duration: "2h 49m",
        genres: ["Sci-Fi", "Drama"],
        backdropUrl: "https://picsum.photos/seed/interstellar/1280/720",
        posterUrl: "https://picsum.photos/seed/interstellar/500/750",
        matchScore: 95
      },
      {
        id: "m4",
        title: "Stranger Things",
        description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
        rating: 8.7,
        releaseYear: 2016,
        duration: "50m",
        genres: ["Horror", "Fantasy"],
        backdropUrl: "https://picsum.photos/seed/stranger/1280/720",
        posterUrl: "https://picsum.photos/seed/stranger/500/750",
        matchScore: 97
      },
      {
        id: "m5",
        title: "The Crown",
        description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
        rating: 8.6,
        releaseYear: 2016,
        duration: "58m",
        genres: ["Drama", "History"],
        backdropUrl: "https://picsum.photos/seed/crown/1280/720",
        posterUrl: "https://picsum.photos/seed/crown/500/750",
        matchScore: 92
      },
      {
        id: "m6",
        title: "Avatar: The Way of Water",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        rating: 7.6,
        releaseYear: 2022,
        duration: "3h 12m",
        genres: ["Sci-Fi", "Action"],
        backdropUrl: "https://picsum.photos/seed/avatar/1280/720",
        posterUrl: "https://picsum.photos/seed/avatar/500/750",
        matchScore: 90
      },
      {
        id: "m7",
        title: "Wednesday",
        description: "Follows Wednesday Addams' years as a student, when she attempts to master her emerging psychic ability, thwart and solve the mystery that embroiled her parents.",
        rating: 8.1,
        releaseYear: 2022,
        duration: "45m",
        genres: ["Comedy", "Fantasy"],
        backdropUrl: "https://picsum.photos/seed/wednesday/1280/720",
        posterUrl: "https://picsum.photos/seed/wednesday/500/750",
        matchScore: 96
      },
      {
        id: "m8",
        title: "Breaking Bad",
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        rating: 9.5,
        releaseYear: 2008,
        duration: "49m",
        genres: ["Crime", "Drama"],
        backdropUrl: "https://picsum.photos/seed/breakingbad/1280/720",
        posterUrl: "https://picsum.photos/seed/breakingbad/500/750",
        matchScore: 99
      },
      {
        id: "m9",
        title: "The Mandalorian",
        description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
        rating: 8.7,
        releaseYear: 2019,
        duration: "40m",
        genres: ["Sci-Fi", "Action"],
        backdropUrl: "https://picsum.photos/seed/mandalorian/1280/720",
        posterUrl: "https://picsum.photos/seed/mandalorian/500/750",
        matchScore: 94
      },
      {
        id: "m10",
        title: "Squid Game",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes. A survival game that has a whopping 45.6 billion-won prize at stake.",
        rating: 8.0,
        releaseYear: 2021,
        duration: "55m",
        genres: ["Thriller", "Drama"],
        backdropUrl: "https://picsum.photos/seed/squidgame/1280/720",
        posterUrl: "https://picsum.photos/seed/squidgame/500/750",
        matchScore: 93
      },
      {
        id: "m11",
        title: "The Queen's Gambit",
        description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
        rating: 8.6,
        releaseYear: 2020,
        duration: "1h",
        genres: ["Drama"],
        backdropUrl: "https://picsum.photos/seed/queensgambit/1280/720",
        posterUrl: "https://picsum.photos/seed/queensgambit/500/750",
        matchScore: 95
      },
      {
        id: "m12",
        title: "Black Mirror",
        description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        rating: 8.8,
        releaseYear: 2011,
        duration: "1h",
        genres: ["Sci-Fi", "Thriller"],
        backdropUrl: "https://picsum.photos/seed/blackmirror/1280/720",
        posterUrl: "https://picsum.photos/seed/blackmirror/500/750",
        matchScore: 91
      }
    ];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for movies related to: "${query}". Provide 6 results.
      Return high-quality placeholder image URLs from picsum.photos for backdropUrl and posterUrl.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: MOVIE_SCHEMA
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const getAIRecommendations = async (userPrompt: string): Promise<Movie[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user says: "${userPrompt}". Based on this, suggest 5 highly personalized movie recommendations. 
      Include a "matchScore" between 80 and 99.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: MOVIE_SCHEMA
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return [];
  }
};
