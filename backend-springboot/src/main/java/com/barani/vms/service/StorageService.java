package com.barani.vms.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${gcp.storage.bucket-name:}")
    private String bucketName;

    @Value("${gcp.storage.project-id:}")
    private String projectId;

    private Storage storage;
    private boolean isGcpActive = false;

    @PostConstruct
    public void init() {
        if (bucketName != null && !bucketName.isEmpty()) {
            try {
                if (projectId != null && !projectId.isEmpty()) {
                    storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
                } else {
                    storage = StorageOptions.getDefaultInstance().getService();
                }
                isGcpActive = true;
                System.out.println("[VMS Storage] Google Cloud Storage initialized successfully on bucket: " + bucketName);
            } catch (Exception e) {
                System.err.println("[VMS Storage] Failed to initialize Google Cloud Storage, falling back to local storage: " + e.getMessage());
                isGcpActive = false;
            }
        } else {
            System.out.println("[VMS Storage] No GCP bucket configured. Using local storage fallback.");
        }
    }

    public String uploadFile(MultipartFile file, String year, String month, String visitorType, String visitorId) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String folderPath = String.format("%s/%s/%s/%s", year, month, visitorType, visitorId);
        String gcsPath = folderPath + "/" + fileName;

        if (isGcpActive) {
            BlobId blobId = BlobId.of(bucketName, gcsPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
            storage.create(blobInfo, file.getBytes());
            // Return public URL or GCS URL
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, gcsPath);
        } else {
            // Local fallback
            String localDir = "uploads/" + folderPath;
            File dir = new File(localDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            Path path = Paths.get(localDir, fileName);
            Files.write(path, file.getBytes());
            return "/" + localDir + "/" + fileName;
        }
    }

    public String uploadBytes(byte[] content, String contentType, String extension, String year, String month, String visitorType, String visitorId) throws IOException {
        String fileName = UUID.randomUUID().toString() + "." + extension;
        String folderPath = String.format("%s/%s/%s/%s", year, month, visitorType, visitorId);
        String gcsPath = folderPath + "/" + fileName;

        if (isGcpActive) {
            BlobId blobId = BlobId.of(bucketName, gcsPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
            storage.create(blobInfo, content);
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, gcsPath);
        } else {
            // Local fallback
            String localDir = "uploads/" + folderPath;
            File dir = new File(localDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            Path path = Paths.get(localDir, fileName);
            Files.write(path, content);
            return "/" + localDir + "/" + fileName;
        }
    }
}
