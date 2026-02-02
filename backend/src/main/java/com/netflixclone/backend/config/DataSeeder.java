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
        String[] imagePaths = {
                "/images/image_341x192_1.webp",
                "/images/image_341x192_2.jpg",
                "/images/image_341x192_3.webp",
                "/images/image_341x192_4.webp",
                "/images/image_341x192_5.webp",
                "/images/image_341x192_6.webp",
                "/images/image_341x192_7.webp",
                "/images/image_341x192_8.jpg",
                "/images/image_341x192_9.webp",
                "/images/image_341x192_10.jpg",
                "/images/image_341x192_11.jpg",
                "/images/image_341x192_12.jpg",
                "/images/image_341x192_13.jpg",
                "/images/image_341x192_14.jpg",
                "/images/image_341x192_15.webp",
                "/images/image_341x192_16.jpg",
                "/images/image_341x192_17.jpg",
                "/images/image_341x192_18.jpg",
                "/images/image_341x192_19.jpg",
                "/images/image_341x192_20.jpg",
                "/images/image_341x192_21.jpg"
        };

        // Update ALL existing movies with the local video path
        java.util.List<Movie> allMovies = movieRepository.findAll();
        int imageIndex = 0;

        for (Movie movie : allMovies) {
            movie.setVideoUrl(
                    "https://oepxzxnnofhcuvofhzeg.supabase.co/storage/v1/object/public/sample/FD79CB80-0D4D-40A5-852F-CEBEACCE6F6F.MP4");

            // Assign image cyclically if missing
            if (movie.getThumbnail() == null) {
                String path = imagePaths[imageIndex % imagePaths.length];
                byte[] bytes = readImage(path);
                if (bytes != null) {
                    movie.setThumbnail(bytes);
                }
            }
            movieRepository.save(movie);
            imageIndex++;
        }

        if (movieRepository.count() < 15) {
            // Seed initial data if DB is empty or low
            String[] commonImages = {
                    "/images/image_341x192_1.webp", "/images/image_341x192_2.jpg", "/images/image_341x192_3.webp",
                    "/images/image_341x192_4.webp", "/images/image_341x192_5.webp", "/images/image_341x192_6.webp"
            };

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
                    "/images/image_341x192_1.webp",
                    "50m", "U/A 16+", 98, action, horror);

            updateOrCreateMovie("Big Buck Bunny",
                    "A large and lovable rabbit ends up with three annoying rodents, Frank, Rinky, and Gamera.",
                    "/images/image_341x192_2.jpg",
                    "10m", "U", 95, comedy, action);
        }
    }

    private byte[] readImage(String path) {
        try {
            // Path is like "/images/image...webp"
            // We need absolute path. Assuming running from project root or having a known
            // base.
            // For this environment, we know the public folder is at:
            // c:\Users\Nihaal S\java\Netflix clone\Netflix\public

            // Convert web path to file path
            // Remove leading slash if present
            String cleanPath = path.startsWith("/") ? path.substring(1) : path;
            cleanPath = cleanPath.replace("/", "\\"); // Windows separators

            java.nio.file.Path file = java.nio.file.Paths
                    .get("c:\\Users\\Nihaal S\\java\\Netflix clone\\Netflix\\public", cleanPath);
            return java.nio.file.Files.readAllBytes(file);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // or empty array
        }
    }

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

        // Convert path to bytes
        byte[] imageBytes = readImage(thumbPath);
        if (imageBytes != null) {
            movie.setThumbnail(imageBytes);
        }

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
