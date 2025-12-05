package com.rental.divine_costume.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {

    private Long id;
    private String name;
    private String email;
    private String contact;
    private String alternateContact;
    private String address;
    private LocalDateTime signinDate;
    private Boolean loginStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
