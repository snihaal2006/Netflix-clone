package com.netflixclone.backend.config;

import com.netflixclone.backend.entity.Genre;
import com.netflixclone.backend.entity.Movie;
import com.netflixclone.backend.repository.GenreRepository;
import com.netflixclone.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Override
    public void run(String... args) throws Exception {
        Genre action = createOrGetGenre("Action");
        Genre comedy = createOrGetGenre("Comedy");
        Genre horror = createOrGetGenre("Horror");

        // List of available local images
        // List of Cloud Image URLs (Unsplash & TMDB Placeholders)
        String[] imageUrls = {
                "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80",
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
                "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&q=80",
                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80",
                "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&q=80",
                "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=500&q=80",
                "https://images.unsplash.com/photo-1605656816944-971cd5c1407f?w=500&q=80",
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80"
        };

        // Update ALL existing movies with the local video path
        java.util.List<Movie> allMovies = movieRepository.findAll();
        int imageIndex = 0;

        for (Movie movie : allMovies) {
            movie.setVideoUrl(
                    "https://oepxzxnnofhcuvofhzeg.supabase.co/storage/v1/object/public/sample/FD79CB80-0D4D-40A5-852F-CEBEACCE6F6F.MP4");

            // Assign image cyclically if missing
            if (movie.getThumbnailUrl() == null) {
                String url = imageUrls[imageIndex % imageUrls.length];
                movie.setThumbnailUrl(url);
            }
            movieRepository.save(movie);
            imageIndex++;
        }

        if (movieRepository.count() < 15) {
            // Seed initial data if DB is empty or low
            String[] commonImages = imageUrls;

            for (int i = 1; i <= 20; i++) {
                String title = "Movie Title " + i;
                String desc = "Description for movie " + i + ". Exciting plot details here.";
                String img = commonImages[i % commonImages.length];
                Genre genre = (i % 3 == 0) ? comedy : (i % 2 == 0) ? action : horror;

                updateOrCreateMovie(title, desc, img, "2h", "U/A 13+", 90 + (i % 10), genre);
            }

            // Specific overrides
            updateOrCreateMovie("Stranger Things",
                    "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
                    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80",
                    "50m", "U/A 16+", 98, action, horror);

            updateOrCreateMovie("Big Buck Bunny",
                    "A large and lovable rabbit ends up with three annoying rodents, Frank, Rinky, and Gamera.",
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
                    "10m", "U", 95, comedy, action);
        }
    }

    // Removed readImage method as we are using URLs now

    private Genre createOrGetGenre(String name) {
        return genreRepository.findAll().stream()
                .filter(g -> g.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Genre g = new Genre();
                    g.setName(name);
                    return genreRepository.save(g);
                });
    }

    private void updateOrCreateMovie(String title, String desc, String thumbPath, String duration, String rating,
            Integer matchScore, Genre... genres) {
        Movie movie = movieRepository.findByTitle(title);
        if (movie == null) {
            movie = new Movie();
            movie.setTitle(title);
        }

        movie.setDescription(desc);

        // Set URL directly
        movie.setThumbnailUrl(thumbPath);

        movie.setDuration(duration);
        movie.setRating(rating);
        movie.setMatchScore(matchScore);

        if (movie.getReleaseDate() == null) {
            movie.setReleaseDate(LocalDate.now());
        }

        Set<Genre> genreSet = new HashSet<>();
        for (Genre g : genres) {
            genreSet.add(g);
        }
        movie.setGenres(genreSet);

        // Set local video path for streaming
        movie.setVideoUrl(
                "https://oepxzxnnofhcuvofhzeg.supabase.co/storage/v1/object/public/sample/FD79CB80-0D4D-40A5-852F-CEBEACCE6F6F.MP4");

        movieRepository.save(movie);
    }
}
