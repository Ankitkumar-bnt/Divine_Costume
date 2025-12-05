package com.rental.divine_costume.customer.dto;

import lombok.*;

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
    private String signinDate;
    private Boolean loginStatus;
}
