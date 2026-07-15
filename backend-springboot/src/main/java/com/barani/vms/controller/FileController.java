package com.barani.vms.controller;

import com.barani.vms.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                         @RequestParam("year") String year,
                                         @RequestParam("month") String month,
                                         @RequestParam("visitorType") String visitorType,
                                         @RequestParam("visitorId") String visitorId) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }
            String fileUrl = storageService.uploadFile(file, year, month, visitorType, visitorId);
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/upload-base64")
    public ResponseEntity<?> uploadBase64(@RequestBody Map<String, String> payload) {
        try {
            String base64Data = payload.get("base64Data");
            String contentType = payload.get("contentType");
            String extension = payload.get("extension");
            String year = payload.get("year");
            String month = payload.get("month");
            String visitorType = payload.get("visitorType");
            String visitorId = payload.get("visitorId");

            if (base64Data == null || base64Data.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "base64Data is required"));
            }

            // Remove metadata header from base64 if present, e.g. "data:image/png;base64,"
            if (base64Data.contains(",")) {
                base64Data = base64Data.split(",")[1];
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
            String fileUrl = storageService.uploadBytes(decodedBytes, contentType, extension, year, month, visitorType, visitorId);

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload base64 file: " + e.getMessage()));
        }
    }
}
