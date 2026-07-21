package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.SecurityUser;
import com.bharani.vms.service.SecurityUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/security-users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SecurityUserController {

    private final SecurityUserService securityUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SecurityUser>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(securityUserService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SecurityUser>> getUserById(@PathVariable UUID id) {
        return securityUserService.getUserById(id)
                .map(user -> ResponseEntity.ok(ApiResponse.ok(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SecurityUser>> createUser(@RequestBody SecurityUser user) {
        return ResponseEntity.ok(ApiResponse.ok("User created", securityUserService.saveUser(user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SecurityUser>> updateUser(@PathVariable UUID id, @RequestBody SecurityUser userDetails) {
        return securityUserService.getUserById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setRole(userDetails.getRole());
                    user.setPhone(userDetails.getPhone());
                    user.setShift(userDetails.getShift());
                    return ResponseEntity.ok(ApiResponse.ok("User updated", securityUserService.saveUser(user)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        securityUserService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }
}
