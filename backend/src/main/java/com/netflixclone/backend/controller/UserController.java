package com.netflixclone.backend.controller;

import com.netflixclone.backend.entity.User;
import com.netflixclone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            // Update other fields as needed, excluding password/email for simple edit
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/picture")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setProfilePicture(file.getBytes());
                userRepository.save(user);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error uploading file");
        }
    }

    @GetMapping("/{id}/picture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get().getProfilePicture() != null) {
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "image/jpeg")
                    .body(userOpt.get().getProfilePicture());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/mylist/{movieId}")
    public ResponseEntity<?> addToMyList(@PathVariable Long id, @PathVariable Long movieId) {
        return userRepository.findById(id).map(user -> {
            if (!user.getMyList().contains(movieId)) {
                user.getMyList().add(movieId);
                userRepository.save(user);
            }
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/mylist/{movieId}")
    public ResponseEntity<?> removeFromMyList(@PathVariable Long id, @PathVariable Long movieId) {
        return userRepository.findById(id).map(user -> {
            user.getMyList().remove(movieId);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/liked/{movieId}")
    public ResponseEntity<?> addToLikedMovies(@PathVariable Long id, @PathVariable Long movieId) {
        return userRepository.findById(id).map(user -> {
            if (!user.getLikedMovies().contains(movieId)) {
                user.getLikedMovies().add(movieId);
                userRepository.save(user);
            }
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/liked/{movieId}")
    public ResponseEntity<?> removeFromLikedMovies(@PathVariable Long id, @PathVariable Long movieId) {
        return userRepository.findById(id).map(user -> {
            user.getLikedMovies().remove(movieId);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
