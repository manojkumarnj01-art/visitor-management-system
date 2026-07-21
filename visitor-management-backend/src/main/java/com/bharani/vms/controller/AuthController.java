package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.dto.AuthRequest;
import com.bharani.vms.dto.AuthResponse;
import com.bharani.vms.dto.RegisterRequest;
import com.bharani.vms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid credentials: " + ex.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.ok("User registered successfully", response));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Registration failed: " + ex.getMessage()));
        }
    }
}
