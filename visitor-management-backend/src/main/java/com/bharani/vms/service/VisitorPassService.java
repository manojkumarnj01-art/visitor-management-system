package com.bharani.vms.service;

import com.bharani.vms.entity.VisitorPass;
import com.bharani.vms.repository.VisitorPassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitorPassService {

    private final VisitorPassRepository visitorPassRepository;

    public List<VisitorPass> getAllPasses() {
        return visitorPassRepository.findAll();
    }

    public Optional<VisitorPass> getPassById(UUID id) {
        return visitorPassRepository.findById(id);
    }

    public Optional<VisitorPass> getPassByCode(String code) {
        return visitorPassRepository.findByPassCode(code);
    }

    public VisitorPass savePass(VisitorPass pass) {
        return visitorPassRepository.save(pass);
    }

    public void deletePass(UUID id) {
        visitorPassRepository.deleteById(id);
    }
}
