package com.barani.vms.controller;

import com.barani.vms.model.Blacklist;
import com.barani.vms.repository.BlacklistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blacklist")
public class BlacklistController {

    private final BlacklistRepository blacklistRepository;

    public BlacklistController(BlacklistRepository blacklistRepository) {
        this.blacklistRepository = blacklistRepository;
    }

    @GetMapping
    public List<Blacklist> getBlacklist() {
        return blacklistRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Blacklist> addToBlacklist(@RequestBody Blacklist blacklist) {
        if (blacklist.getId() == null || blacklist.getId().isEmpty()) {
            blacklist.setId("BL" + System.currentTimeMillis() % 100000);
        }
        Blacklist saved = blacklistRepository.save(blacklist);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromBlacklist(@PathVariable String id) {
        Optional<Blacklist> optionalBlacklist = blacklistRepository.findById(id);
        if (optionalBlacklist.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        blacklistRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
