package com.bharani.vms.service;

import com.bharani.vms.entity.WorkPermit;
import com.bharani.vms.repository.WorkPermitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkPermitService {

    private final WorkPermitRepository workPermitRepository;

    public List<WorkPermit> getAllWorkPermits() {
        return workPermitRepository.findAll();
    }

    public Optional<WorkPermit> getWorkPermitById(UUID id) {
        return workPermitRepository.findById(id);
    }

    public Optional<WorkPermit> getWorkPermitByCode(String code) {
        return workPermitRepository.findByPermitCode(code);
    }

    public WorkPermit saveWorkPermit(WorkPermit permit) {
        if (permit.getPermitCode() == null || permit.getPermitCode().isBlank()) {
            permit.setPermitCode("WP-" + System.currentTimeMillis() % 100000);
        }
        return workPermitRepository.save(permit);
    }

    public void deleteWorkPermit(UUID id) {
        workPermitRepository.deleteById(id);
    }
}
