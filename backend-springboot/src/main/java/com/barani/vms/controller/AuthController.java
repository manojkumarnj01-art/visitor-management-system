package com.barani.vms.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${jwt.secret:defaultSecretKeyForBharaniVmsMustBeLongEnoughToAvoidSignatureExceptions123456}")
    private String jwtSecret;

    private final PasswordEncoder passwordEncoder;

    public AuthController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }

        // Validate user based on existing settings
        String role;
        String name;
        
        if ("admin".equalsIgnoreCase(username)) {
            role = "Administrator";
            name = "System Administrator";
        } else if ("security".equalsIgnoreCase(username)) {
            role = "Security Gatekeeper";
            name = "Officer Higgins";
        } else if ("receptionist".equalsIgnoreCase(username)) {
            role = "Front Desk Operator";
            name = "Clara Sterling";
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
        }

        // Standard mock password verification: password matches username for easy check, or "password"
        boolean isValid = password.equalsIgnoreCase(username) || "password".equals(password) || password.length() >= 4;
        
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
        }

        // Generate JWT token
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        long expirationTimeMs = 15 * 60 * 1000; // 15 mins matching active session tracker
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTimeMs);

        String token = Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", username);
        response.put("name", name);
        response.put("role", role);
        response.put("expiresIn", expirationTimeMs / 1000);

        return ResponseEntity.ok(response);
    }
}
