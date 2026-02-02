package com.geminiflix.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String fileName; // The actual filename on disk (optional if using external URLs)

    @jakarta.persistence.Column(length = 2000)
    private String description;

    private Double rating;
    private Integer releaseYear;
    private String duration;

    @jakarta.persistence.ElementCollection
    private java.util.List<String> genres;

    private String backdropUrl;
    private String posterUrl;
    private Integer matchScore;
}
