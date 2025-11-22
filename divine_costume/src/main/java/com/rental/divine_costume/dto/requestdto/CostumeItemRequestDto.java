package com.rental.divine_costume.dto.requestdto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CostumeItemRequestDto {
    private Long costumeId;
    private String itemName;
    private BigDecimal rentalPricePerDay;
    private BigDecimal deposit;
    private String imageUrl;
}
