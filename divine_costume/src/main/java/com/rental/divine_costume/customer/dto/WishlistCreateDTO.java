package com.rental.divine_costume.customer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistCreateDTO {
    private Long customerId;
    private Long costumeId;
}
