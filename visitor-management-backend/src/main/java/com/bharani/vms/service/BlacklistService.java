package com.bharani.vms.service;

import com.bharani.vms.entity.Blacklist;
import com.bharani.vms.repository.BlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlacklistService {

    private final BlacklistRepository blacklistRepository;

    public List<Blacklist> getAllBlacklistEntries() {
        return blacklistRepository.findAll();
    }

    public Optional<Blacklist> getBlacklistById(UUID id) {
        return blacklistRepository.findById(id);
    }

    public Blacklist saveBlacklist(Blacklist blacklist) {
        return blacklistRepository.save(blacklist);
    }

    public void deleteBlacklist(UUID id) {
        blacklistRepository.deleteById(id);
    }
}
