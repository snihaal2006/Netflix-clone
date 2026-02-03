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
        // List of Cloud Image URLs (Hosted on Render Backend)
        // Since we copied images to src/main/resources/static/images, they are
        // available at /images/...
        // We use the full Cloud URL so the frontend (Netlify) can access them.
        String baseUrl = "https://netflix-clone-efk6.onrender.com";
        String[] imageUrls = {
                baseUrl + "/images/image_341x192_1.webp",
                baseUrl + "/images/image_341x192_2.jpg",
                baseUrl + "/images/image_341x192_3.webp",
                baseUrl + "/images/image_341x192_4.webp",
                baseUrl + "/images/image_341x192_5.webp",
                baseUrl + "/images/image_341x192_6.webp",
                baseUrl + "/images/image_341x192_7.webp",
                baseUrl + "/images/image_341x192_8.jpg",
                baseUrl + "/images/image_341x192_9.webp",
                baseUrl + "/images/image_341x192_10.jpg",
                baseUrl + "/images/image_341x192_11.jpg",
                baseUrl + "/images/image_341x192_12.jpg",
                baseUrl + "/images/image_341x192_13.jpg",
                baseUrl + "/images/image_341x192_14.jpg",
                baseUrl + "/images/image_341x192_15.webp",
                baseUrl + "/images/image_341x192_16.jpg",
                baseUrl + "/images/image_341x192_17.jpg",
                baseUrl + "/images/image_341x192_18.jpg",
                baseUrl + "/images/image_341x192_19.jpg",
                baseUrl + "/images/image_341x192_20.jpg",
                baseUrl + "/images/image_341x192_21.jpg"
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
                    baseUrl + "/images/image_341x192_1.webp",
                    "50m", "U/A 16+", 98, action, horror);

            updateOrCreateMovie("Big Buck Bunny",
                    "A large and lovable rabbit ends up with three annoying rodents, Frank, Rinky, and Gamera.",
                    baseUrl + "/images/image_341x192_2.jpg",
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
