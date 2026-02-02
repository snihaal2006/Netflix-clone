package com.netflixclone.backend.service;

import com.netflixclone.backend.entity.Movie;
import com.netflixclone.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenres_Name(genre);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }
}
