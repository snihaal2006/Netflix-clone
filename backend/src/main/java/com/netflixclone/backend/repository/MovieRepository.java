package com.netflixclone.backend.repository;

import com.netflixclone.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByGenres_Name(String genreName);

    Movie findByTitle(String title);
}
