package com.rental.divine_costume.customer.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    private Long id;
    private Long customerId;
    private Long costumeId;
    private Integer count;
    private BigDecimal totalPrice;
    private BigDecimal totalDeposit;
}
