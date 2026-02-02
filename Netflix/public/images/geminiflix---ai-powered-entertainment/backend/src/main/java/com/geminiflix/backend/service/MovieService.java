package com.geminiflix.backend.service;

import com.geminiflix.backend.model.Movie;
import com.geminiflix.backend.repository.MovieRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Value("${geminiflix.images.path}")
    private String imagesPath;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @PostConstruct
    public void syncMovies() {
        File folder = new File(imagesPath);
        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles((dir, name) -> name.toLowerCase().endsWith(".webp"));
            if (files != null) {
                java.util.Random rand = new java.util.Random();
                List<String> allGenres = java.util.Arrays.asList("Action", "Drama", "Sci-Fi", "Thriller", "Comedy",
                        "Romance", "Horror", "Mystery");

                for (File file : files) {
                    Movie movie = movieRepository.findByFileName(file.getName())
                            .orElse(new Movie());

                    boolean changed = false;

                    if (movie.getId() == null) {
                        movie.setFileName(file.getName());
                        movie.setTitle(file.getName().replace(".webp", "").replace("-", " "));
                        changed = true;
                    }

                    if (movie.getDescription() == null || movie.getDescription().startsWith("Description for")) {
                        movie.setDescription(
                                "An exciting local production featuring stunning visuals and gripping storytelling. This file was automatically indexed from your local library ("
                                        + file.getName() + ").");
                        changed = true;
                    }

                    if (movie.getRating() == null) {
                        movie.setRating(7.0 + (rand.nextDouble() * 2.9)); // 7.0 to 9.9
                        changed = true;
                    }

                    if (movie.getReleaseYear() == null) {
                        movie.setReleaseYear(2010 + rand.nextInt(16)); // 2010 to 2025
                        changed = true;
                    }

                    if (movie.getDuration() == null) {
                        int mins = 90 + rand.nextInt(90);
                        movie.setDuration((mins / 60) + "h " + (mins % 60) + "m");
                        changed = true;
                    }

                    if (movie.getGenres() == null || movie.getGenres().isEmpty()) {
                        int genreCount = 1 + rand.nextInt(3);
                        List<String> gens = new java.util.ArrayList<>();
                        for (int i = 0; i < genreCount; i++) {
                            String g = allGenres.get(rand.nextInt(allGenres.size()));
                            if (!gens.contains(g))
                                gens.add(g);
                        }
                        movie.setGenres(gens);
                        changed = true;
                    }

                    if (movie.getMatchScore() == null) {
                        movie.setMatchScore(80 + rand.nextInt(20));
                        changed = true;
                    }

                    if (movie.getPosterUrl() == null) {
                        movie.setPosterUrl("/images/" + file.getName());
                        changed = true;
                    }

                    if (movie.getBackdropUrl() == null) {
                        movie.setBackdropUrl("/images/" + file.getName());
                        changed = true;
                    }

                    if (changed) {
                        movieRepository.save(movie);
                        System.out.println("Updated/Indexed local movie: " + movie.getTitle());
                    }
                }
            }
        } else {
            System.err.println("Images path not found: " + imagesPath);
        }
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
}
