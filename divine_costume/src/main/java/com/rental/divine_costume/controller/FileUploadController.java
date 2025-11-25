package com.rental.divine_costume.controller;

import com.rental.divine_costume.messageResponse.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    @Value("${server.port:8080}")
    private String serverPort;

    @PostMapping("/upload-images")
    public ResponseEntity<MessageResponse<List<String>>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            List<String> imagePaths = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                // Validate file type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body(MessageResponse.error(HttpStatus.BAD_REQUEST, "Only image files are allowed"));
                }

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".jpg";
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

                // Save file
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Return actual file path
                imagePaths.add(filePath.toString());
            }

            return ResponseEntity.ok(MessageResponse.success(imagePaths, "Images uploaded successfully"));

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload images: " + e.getMessage()));
        }
    }

    @PostMapping("/download-from-url")
    public ResponseEntity<MessageResponse<String>> downloadFromUrl(@RequestBody UrlDownloadRequest request) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Download image from URL
            URL url = new URL(request.getUrl());
            
            // Determine file extension from URL or default to .jpg
            String urlPath = url.getPath();
            String fileExtension = ".jpg";
            if (urlPath.contains(".")) {
                fileExtension = urlPath.substring(urlPath.lastIndexOf("."));
                // Validate extension
                if (!fileExtension.matches("\\.(jpg|jpeg|png|gif|webp|bmp)")) {
                    fileExtension = ".jpg";
                }
            }
            
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Download and save
            try (InputStream in = url.openStream()) {
                Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Return actual file path
            return ResponseEntity.ok(MessageResponse.success(filePath.toString(), "Image downloaded successfully"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to download image: " + e.getMessage()));
        }
    }

    /**
     * Accept file path from file picker and validate it exists
     * This allows users to select images from any location on their system
     */
    @PostMapping("/validate-file-path")
    public ResponseEntity<MessageResponse<String>> validateFilePath(@RequestBody FilePathRequest request) {
        try {
            String filePath = request.getFilePath();
            
            if (filePath == null || filePath.trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(MessageResponse.error(HttpStatus.BAD_REQUEST, "File path is required"));
            }

            // Normalize the path
            Path path = Paths.get(filePath).toAbsolutePath().normalize();
            
            // Check if file exists
            if (!Files.exists(path)) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(MessageResponse.error(HttpStatus.NOT_FOUND, "File not found: " + filePath));
            }

            // Check if it's a file (not a directory)
            if (!Files.isRegularFile(path)) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(MessageResponse.error(HttpStatus.BAD_REQUEST, "Path is not a file: " + filePath));
            }

            // Validate it's an image file
            String contentType = Files.probeContentType(path);
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(MessageResponse.error(HttpStatus.BAD_REQUEST, "File is not an image: " + filePath));
            }

            // Return the normalized absolute path
            return ResponseEntity.ok(MessageResponse.success(path.toString(), "File path validated successfully"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to validate file path: " + e.getMessage()));
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath;
            
            // Check if filename is a full path or just a filename
            if (filename.contains(":") || filename.startsWith("/") || filename.startsWith("\\")) {
                // It's a full path
                filePath = Paths.get(filename);
            } else {
                // It's just a filename
                filePath = Paths.get(uploadDir).resolve(filename);
            }
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(imageBytes);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to convert file path to URL
    public String pathToUrl(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        
        try {
            Path path = Paths.get(filePath);
            String filename = path.getFileName().toString();
            return "http://localhost:" + serverPort + "/api/files/images/" + filename;
        } catch (Exception e) {
            return null;
        }
    }

    // DTO for URL download request
    public static class UrlDownloadRequest {
        private String url;

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    // DTO for file path validation request
    public static class FilePathRequest {
        private String filePath;

        public String getFilePath() {
            return filePath;
        }

        public void setFilePath(String filePath) {
            this.filePath = filePath;
        }
    }
}
