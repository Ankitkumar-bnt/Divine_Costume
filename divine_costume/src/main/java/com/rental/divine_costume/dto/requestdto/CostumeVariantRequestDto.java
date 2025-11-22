package com.rental.divine_costume.dto.requestdto;

import lombok.Data;

@Data
public class CostumeVariantRequestDto {
    private Long categoryId;
    private String variantDescription;
    private String style;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;
}
