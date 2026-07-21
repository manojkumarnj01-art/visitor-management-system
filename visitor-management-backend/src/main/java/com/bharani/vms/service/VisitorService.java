package com.bharani.vms.service;

import com.bharani.vms.entity.Visitor;
import com.bharani.vms.repository.VisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    public Optional<Visitor> getVisitorById(UUID id) {
        return visitorRepository.findById(id);
    }

    public Optional<Visitor> getVisitorByCode(String code) {
        return visitorRepository.findByVisitorCode(code);
    }

    public List<Visitor> getVisitorsByStatus(String status) {
        return visitorRepository.findByStatus(status);
    }

    public Visitor saveVisitor(Visitor visitor) {
        if (visitor.getVisitorCode() == null || visitor.getVisitorCode().isBlank()) {
            visitor.setVisitorCode("V-" + System.currentTimeMillis() % 100000);
        }
        return visitorRepository.save(visitor);
    }

    public Visitor checkIn(UUID id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visitor not found: " + id));
        visitor.setStatus("Checked In");
        visitor.setCheckIn(LocalDateTime.now());
        return visitorRepository.save(visitor);
    }

    public Visitor checkOut(UUID id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visitor not found: " + id));
        visitor.setStatus("Checked Out");
        visitor.setCheckOut(LocalDateTime.now());
        return visitorRepository.save(visitor);
    }

    public Visitor approveVisitor(String token, String approverName) {
        Visitor visitor = visitorRepository.findByApproveToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid approval token"));
        visitor.setStatus("Approved");
        visitor.setApprovedBy(approverName);
        visitor.setApprovedAt(LocalDateTime.now());
        return visitorRepository.save(visitor);
    }

    public Visitor rejectVisitor(String token) {
        Visitor visitor = visitorRepository.findByRejectToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid rejection token"));
        visitor.setStatus("Rejected");
        return visitorRepository.save(visitor);
    }

    public void deleteVisitor(UUID id) {
        visitorRepository.deleteById(id);
    }
}
