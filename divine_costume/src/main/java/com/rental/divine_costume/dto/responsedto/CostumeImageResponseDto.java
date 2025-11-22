package com.rental.divine_costume.dto.responsedto;

import lombok.Data;

@Data
public class CostumeImageResponseDto {
    private Long id;
    private Long costumeVariantId;
    private String imageUrl;
}
