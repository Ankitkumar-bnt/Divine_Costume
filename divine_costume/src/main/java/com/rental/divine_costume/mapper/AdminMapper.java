package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.AdminCreateDTO;
import com.rental.divine_costume.dto.AdminDTO;
import com.rental.divine_costume.entity.Admin;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminMapper {

    /**
     * Convert Admin entity to AdminDTO
     */
    public AdminDTO toDTO(Admin admin) {
        if (admin == null) {
            return null;
        }

        return AdminDTO.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .contact(admin.getContact())
                .alternateContact(admin.getAlternateContact())
                .address(admin.getAddress())
                .mapAddress(admin.getMapAddress())
                .city(admin.getCity())
                .state(admin.getState())
                .pincode(admin.getPincode())
                .description(admin.getDescription())
                .instagram(admin.getInstagram())
                .facebook(admin.getFacebook())
                .xTwitter(admin.getXTwitter())
                .signinDate(admin.getSigninDate())
                .loginStatus(admin.getLoginStatus())
                .createdAt(admin.getCreatedAt())
                .updatedAt(admin.getUpdatedAt())
                .createdBy(admin.getCreatedBy())
                .updatedBy(admin.getUpdatedBy())
                .build();
    }

    /**
     * Convert AdminCreateDTO to Admin entity
     * Note: Password should be encrypted before calling this method
     */
    public Admin toEntity(AdminCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Admin admin = new Admin();
        admin.setName(createDTO.getName());
        admin.setEmail(createDTO.getEmail());
        admin.setPassword(createDTO.getPassword()); // Should be encrypted
        admin.setContact(createDTO.getContact());
        admin.setAlternateContact(createDTO.getAlternateContact());
        admin.setAddress(createDTO.getAddress());
        admin.setMapAddress(createDTO.getMapAddress());
        admin.setCity(createDTO.getCity());
        admin.setState(createDTO.getState());
        admin.setPincode(createDTO.getPincode());
        admin.setDescription(createDTO.getDescription());
        admin.setInstagram(createDTO.getInstagram());
        admin.setFacebook(createDTO.getFacebook());
        admin.setXTwitter(createDTO.getXTwitter());
        admin.setSigninDate(LocalDateTime.now());
        admin.setLoginStatus(false);

        return admin;
    }

    /**
     * Update existing Admin entity from AdminCreateDTO
     */
    public void updateEntity(Admin admin, AdminCreateDTO updateDTO) {
        if (admin == null || updateDTO == null) {
            return;
        }

        if (updateDTO.getName() != null) {
            admin.setName(updateDTO.getName());
        }
        if (updateDTO.getEmail() != null) {
            admin.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getContact() != null) {
            admin.setContact(updateDTO.getContact());
        }
        if (updateDTO.getAlternateContact() != null) {
            admin.setAlternateContact(updateDTO.getAlternateContact());
        }
        if (updateDTO.getAddress() != null) {
            admin.setAddress(updateDTO.getAddress());
        }
        if (updateDTO.getMapAddress() != null) {
            admin.setMapAddress(updateDTO.getMapAddress());
        }
        if (updateDTO.getCity() != null) {
            admin.setCity(updateDTO.getCity());
        }
        if (updateDTO.getState() != null) {
            admin.setState(updateDTO.getState());
        }
        if (updateDTO.getPincode() != null) {
            admin.setPincode(updateDTO.getPincode());
        }
        if (updateDTO.getDescription() != null) {
            admin.setDescription(updateDTO.getDescription());
        }
        if (updateDTO.getInstagram() != null) {
            admin.setInstagram(updateDTO.getInstagram());
        }
        if (updateDTO.getFacebook() != null) {
            admin.setFacebook(updateDTO.getFacebook());
        }
        if (updateDTO.getXTwitter() != null) {
            admin.setXTwitter(updateDTO.getXTwitter());
        }
        // Password update should be handled separately with encryption
    }
}
