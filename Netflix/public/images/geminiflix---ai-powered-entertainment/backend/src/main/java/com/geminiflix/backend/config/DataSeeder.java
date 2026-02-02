package com.geminiflix.backend.config;

import com.geminiflix.backend.model.Movie;
import com.geminiflix.backend.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final MovieRepository movieRepository;

    public DataSeeder(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed if DB is essentially empty (or check for specific known titles)
        if (movieRepository.count() < 5) {
            seedMovies();
        }
    }

    private void seedMovies() {
        List<Movie> movies = Arrays.asList(
                createMovie("Inception", "A thief who steals corporate secrets...", 8.8, 2010, "2h 28m",
                        Arrays.asList("Sci-Fi", "Action"), "https://picsum.photos/seed/inception/1280/720",
                        "https://picsum.photos/seed/inception/500/750", 98),

                createMovie("The Dark Knight", "When the menace known as the Joker...", 9.0, 2008, "2h 32m",
                        Arrays.asList("Action", "Crime"), "https://picsum.photos/seed/darkknight/1280/720",
                        "https://picsum.photos/seed/darkknight/500/750", 99),

                createMovie("Interstellar", "A team of explorers travel through a wormhole...", 8.6, 2014, "2h 49m",
                        Arrays.asList("Sci-Fi", "Drama"), "https://picsum.photos/seed/interstellar/1280/720",
                        "https://picsum.photos/seed/interstellar/500/750", 95),

                createMovie("Stranger Things", "When a young boy disappears...", 8.7, 2016, "50m",
                        Arrays.asList("Horror", "Fantasy"), "https://picsum.photos/seed/stranger/1280/720",
                        "https://picsum.photos/seed/stranger/500/750", 97),

                createMovie("The Crown", "Follows the political rivalries...", 8.6, 2016, "58m",
                        Arrays.asList("Drama", "History"), "https://picsum.photos/seed/crown/1280/720",
                        "https://picsum.photos/seed/crown/500/750", 92),

                createMovie("Avatar: The Way of Water", "Jake Sully lives with his newfound family...", 7.6, 2022,
                        "3h 12m",
                        Arrays.asList("Sci-Fi", "Action"), "https://picsum.photos/seed/avatar/1280/720",
                        "https://picsum.photos/seed/avatar/500/750", 90),

                createMovie("Wednesday", "Follows Wednesday Addams' years as a student...", 8.1, 2022, "45m",
                        Arrays.asList("Comedy", "Fantasy"), "https://picsum.photos/seed/wednesday/1280/720",
                        "https://picsum.photos/seed/wednesday/500/750", 96),

                createMovie("Breaking Bad", "A high school chemistry teacher...", 9.5, 2008, "49m",
                        Arrays.asList("Crime", "Drama"), "https://picsum.photos/seed/breakingbad/1280/720",
                        "https://picsum.photos/seed/breakingbad/500/750", 99),

                createMovie("The Mandalorian", "The travels of a lone bounty hunter...", 8.7, 2019, "40m",
                        Arrays.asList("Sci-Fi", "Action"), "https://picsum.photos/seed/mandalorian/1280/720",
                        "https://picsum.photos/seed/mandalorian/500/750", 94),

                createMovie("Squid Game", "Hundreds of cash-strapped players accept...", 8.0, 2021, "55m",
                        Arrays.asList("Thriller", "Drama"), "https://picsum.photos/seed/squidgame/1280/720",
                        "https://picsum.photos/seed/squidgame/500/750", 93),

                createMovie("The Queen's Gambit", "Orphaned at the tender age of nine...", 8.6, 2020, "1h",
                        Arrays.asList("Drama"), "https://picsum.photos/seed/queensgambit/1280/720",
                        "https://picsum.photos/seed/queensgambit/500/750", 95),

                createMovie("Black Mirror", "An anthology series exploring...", 8.8, 2011, "1h",
                        Arrays.asList("Sci-Fi", "Thriller"), "https://picsum.photos/seed/blackmirror/1280/720",
                        "https://picsum.photos/seed/blackmirror/500/750", 91));

        movieRepository.saveAll(movies);
        System.out.println("Seeded " + movies.size() + " movies into MySQL.");
    }

    private Movie createMovie(String title, String desc, Double rating, int year, String duration, List<String> genres,
            String backdrop, String poster, int match) {
        Movie m = new Movie();
        m.setTitle(title);
        m.setDescription(desc);
        m.setRating(rating);
        m.setReleaseYear(year);
        m.setDuration(duration);
        m.setGenres(genres);
        m.setBackdropUrl(backdrop);
        m.setPosterUrl(poster);
        m.setMatchScore(match);
        return m;
    }
}
