package com.rental.divine_costume.customer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerCreateDTO {
    private String name;
    private String email;
    private String password;
    private String contact;
    private String alternateContact;
    private String address;
}
