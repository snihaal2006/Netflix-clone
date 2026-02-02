package com.netflixclone.backend.controller;

import com.netflixclone.backend.entity.Movie;
import com.netflixclone.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*") // Allow all for simplicity
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/genre/{genre}")
    public List<Movie> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    @PostMapping
    public Movie createMovie(@RequestBody Movie movie) {
        return movieService.saveMovie(movie);
    }

    @PostMapping("/batch")
    public List<Movie> getMoviesBatch(@RequestBody List<Long> ids) {
        return movieService.getAllMovies().stream()
                .filter(movie -> ids.contains(movie.getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/thumbnail")
    public org.springframework.http.ResponseEntity<byte[]> getMovieThumbnail(@PathVariable Long id) {
        Movie movie = movieService.getAllMovies().stream() // Ideally findById, but using stream for quick access if
                                                           // service missing findById
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (movie != null && movie.getThumbnail() != null) {
            return org.springframework.http.ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "image/jpeg") // Defaulting to jpeg/webp,
                                                                                             // browser handles
                                                                                             // detection usually or we
                                                                                             // can detect
                    .body(movie.getThumbnail());
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/video")
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> getMovieVideo(
            @PathVariable Long id) {
        Movie movie = movieService.getAllMovies().stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (movie != null && movie.getVideoUrl() != null) {
            // Check if it's a cloud URL
            if (movie.getVideoUrl().startsWith("http")) {
                return org.springframework.http.ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(movie.getVideoUrl()))
                        .build();
            }

            java.io.File videoFile = new java.io.File(movie.getVideoUrl());
            if (videoFile.exists()) {
                org.springframework.core.io.FileSystemResource resource = new org.springframework.core.io.FileSystemResource(
                        videoFile);
                return org.springframework.http.ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "video/mp4")
                        .body(resource);
            }
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }
}
