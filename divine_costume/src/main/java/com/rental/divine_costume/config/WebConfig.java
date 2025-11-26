package com.rental.divine_costume.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convert relative path to absolute path
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        
        // Map /uploads/images/** to the actual file system location
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + uploadPath.toString() + "/");
    }
}
