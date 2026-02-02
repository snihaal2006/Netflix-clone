package com.netflixclone.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private String videoUrl;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private byte[] thumbnail;

    private LocalDate releaseDate;

    // New fields for card details
    private String duration; // e.g., "2h 15m"
    private String rating; // e.g., "U/A 16+"
    private Integer matchScore; // e.g., 98

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private Set<Genre> genres;
}
