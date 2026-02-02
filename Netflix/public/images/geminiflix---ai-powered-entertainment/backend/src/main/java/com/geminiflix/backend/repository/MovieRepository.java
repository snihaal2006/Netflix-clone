package com.geminiflix.backend.repository;

import com.geminiflix.backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    boolean existsByFileName(String fileName);

    java.util.Optional<Movie> findByFileName(String fileName);
}
