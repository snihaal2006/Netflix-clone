package com.netflixclone.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import jakarta.persistence.ElementCollection;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password; // In real app, this should be hashed
    private String username;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "LONGBLOB")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private byte[] profilePicture;

    @ElementCollection
    private List<Long> myList = new ArrayList<>();

    @ElementCollection
    private List<Long> likedMovies = new ArrayList<>();

}
