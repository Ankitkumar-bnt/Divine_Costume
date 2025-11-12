package com.rental.divine_costume.dto.responsedto;

import lombok.Data;

@Data
public class CostumeVariantResponseDto {
    private Long id;
    private Long categoryId;
    private String variantDescription;
    private String style;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;
}
