package com.bharani.vms.service;

import com.bharani.vms.dto.AuthRequest;
import com.bharani.vms.dto.AuthResponse;
import com.bharani.vms.dto.RegisterRequest;
import com.bharani.vms.entity.SecurityUser;
import com.bharani.vms.repository.SecurityUserRepository;
import com.bharani.vms.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final SecurityUserRepository securityUserRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        SecurityUser user = securityUserRepository.findByUsername(request.getUsername())
                .orElse(SecurityUser.builder()
                        .id(UUID.randomUUID())
                        .username(request.getUsername())
                        .name(request.getUsername())
                        .role("Security Gatekeeper")
                        .build());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRole())
                .phone(user.getPhone())
                .shift(user.getShift())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        SecurityUser user = SecurityUser.builder()
                .username(request.getUsername())
                .name(request.getName() != null ? request.getName() : request.getUsername())
                .role(request.getRole() != null ? request.getRole() : "Security Gatekeeper")
                .phone(request.getPhone())
                .shift(request.getShift() != null ? request.getShift() : "All shifts")
                .build();

        SecurityUser savedUser = securityUserRepository.save(user);

        String token = tokenProvider.generateTokenFromUsername(savedUser.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .name(savedUser.getName())
                .role(savedUser.getRole())
                .phone(savedUser.getPhone())
                .shift(savedUser.getShift())
                .build();
    }
}
