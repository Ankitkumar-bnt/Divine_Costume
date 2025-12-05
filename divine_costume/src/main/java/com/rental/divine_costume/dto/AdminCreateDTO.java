package com.rental.divine_costume.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCreateDTO {

    private String name;
    private String email;
    private String password;
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
}
