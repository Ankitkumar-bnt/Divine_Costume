package com.rental.divine_costume.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImagePathService {

    @Value("${server.port:8080}")
    private String serverPort;

    /**
     * Converts a file path to a displayable URL
     * @param filePath The absolute file path (e.g., D:/Divine Costume/Images/abc.jpg)
     * @return HTTP URL for accessing the image (e.g., http://localhost:8080/api/files/images/abc.jpg)
     */
    public String pathToUrl(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        
        try {
            // If it's already a URL, return as is
            if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
                return filePath;
            }
            
            // Extract filename from path
            Path path = Paths.get(filePath);
            String filename = path.getFileName().toString();
            
            // Return URL
            return "http://localhost:" + serverPort + "/api/files/images/" + filename;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Converts a URL back to filename
     * @param url The HTTP URL
     * @return Just the filename
     */
    public String urlToFilename(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        
        try {
            if (url.contains("/")) {
                return url.substring(url.lastIndexOf("/") + 1);
            }
            return url;
        } catch (Exception e) {
            return null;
        }
    }
}
