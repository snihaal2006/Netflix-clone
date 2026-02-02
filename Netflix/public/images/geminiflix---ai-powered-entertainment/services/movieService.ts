export interface Movie {
    id: number;
    title: string;
    fileName: string;
    description: string;
}

const API_BASE_URL = 'http://localhost:8080';

export const movieService = {
    async getAllMovies(): Promise<Movie[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/movies`);
            if (!response.ok) {
                throw new Error(`Error fetching movies: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch movies:", error);
            return [];
        }
    },

    getImageUrl(fileName: string): string {
        return `${API_BASE_URL}/images/${fileName}`;
    }
};
