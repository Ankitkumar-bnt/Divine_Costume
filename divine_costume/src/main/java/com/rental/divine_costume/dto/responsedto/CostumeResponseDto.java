package com.rental.divine_costume.dto.responsedto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CostumeResponseDto {
    private Long id;
    private Long costumeVariantId;
    private Integer numberOfItems;
    private String size;
    private Integer serialNumber;
    private BigDecimal purchasePrice;
    private BigDecimal rentalPricePerDay;
    private BigDecimal deposit;
    private Boolean isRentable;
}
