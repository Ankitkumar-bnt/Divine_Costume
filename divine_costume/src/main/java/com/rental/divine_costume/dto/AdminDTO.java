package com.rental.divine_costume.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDTO {

    private Long id;
    private String name;
    private String email;
    private String contact;
    private String alternateContact;
    private String address;
    private String mapAddress;
    private String city;
    private String state;
    private String pincode;
    private String description;
    private String instagram;
    private String facebook;
    private String xTwitter;
    private LocalDateTime signinDate;
    private Boolean loginStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
