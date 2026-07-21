package com.bharani.vms.service;

import com.bharani.vms.entity.SecurityUser;
import com.bharani.vms.repository.SecurityUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SecurityUserService {

    private final SecurityUserRepository securityUserRepository;

    public List<SecurityUser> getAllUsers() {
        return securityUserRepository.findAll();
    }

    public Optional<SecurityUser> getUserById(UUID id) {
        return securityUserRepository.findById(id);
    }

    public Optional<SecurityUser> getUserByUsername(String username) {
        return securityUserRepository.findByUsername(username);
    }

    public SecurityUser saveUser(SecurityUser user) {
        return securityUserRepository.save(user);
    }

    public void deleteUser(UUID id) {
        securityUserRepository.deleteById(id);
    }
}
