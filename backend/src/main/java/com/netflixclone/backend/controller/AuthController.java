package com.netflixclone.backend.controller;

import com.netflixclone.backend.entity.User;
import com.netflixclone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        // In a real app, encrypt password here
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        System.out.println("DEBUG: Login attempt for email: " + email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("DEBUG: User found: " + user.getUsername());
            System.out.println("DEBUG: Stored password: " + user.getPassword());
            System.out.println("DEBUG: Provided password: " + password);

            // Simple password check (plaintext for this demo as requested)
            if (user.getPassword() != null && user.getPassword().equals(password)) {
                System.out.println("DEBUG: Password match!");
                return ResponseEntity.ok(user);
            } else {
                System.out.println("DEBUG: Password mismatch.");
            }
        } else {
            System.out.println("DEBUG: User not found with email: " + email);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}
