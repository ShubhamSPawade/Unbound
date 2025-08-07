package com.unbound.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FileStorageService {
    
    private static final String UPLOAD_DIR = "uploads/";
    private static final String FEST_IMAGES_DIR = UPLOAD_DIR + "fests/";
    private static final String EVENT_POSTERS_DIR = UPLOAD_DIR + "events/";
    
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    
    public FileStorageService() {
        // Create upload directories if they don't exist
        createDirectories();
    }
    
    private void createDirectories() {
        try {
            Files.createDirectories(Paths.get(FEST_IMAGES_DIR));
            Files.createDirectories(Paths.get(EVENT_POSTERS_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directories", e);
        }
    }
    
    public String storeFestImage(MultipartFile file) throws IOException {
        return storeFile(file, FEST_IMAGES_DIR, "fest");
    }
    
    public String storeEventPoster(MultipartFile file) throws IOException {
        return storeFile(file, EVENT_POSTERS_DIR, "event");
    }
    
    private String storeFile(MultipartFile file, String directory, String prefix) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        
        // Generate unique filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFilename);
        String filename = prefix + "_" + UUID.randomUUID().toString() + fileExtension;
        
        // Store file
        Path targetLocation = Paths.get(directory).resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the file URL (relative path)
        return "/uploads/" + (directory.equals(FEST_IMAGES_DIR) ? "fests/" : "events/") + filename;
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return ".jpg"; // Default extension
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        
        try {
            // Remove leading slash if present
            String relativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
            Path filePath = Paths.get(relativePath);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            // Log error but don't throw exception for file deletion
            System.err.println("Failed to delete file: " + fileUrl + ", Error: " + e.getMessage());
        }
    }
    
    public boolean fileExists(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return false;
        }
        
        String relativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
        Path filePath = Paths.get(relativePath);
        return Files.exists(filePath);
    }
} 