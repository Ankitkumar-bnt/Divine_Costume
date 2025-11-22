package com.rental.divine_costume.dto.responsedto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CostumeItemResponseDto {
    private Long id;
    private Long costumeId;
    private String itemName;
    private BigDecimal rentalPricePerDay;
    private BigDecimal deposit;
    private String imageUrl;
}
