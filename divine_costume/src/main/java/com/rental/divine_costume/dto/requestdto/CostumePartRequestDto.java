package com.rental.divine_costume.dto.requestdto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumePartRequestDto {
    private Long parentCostumeId;
    private String partName;
    private String partDescription;
    private Integer quantity;
    private Boolean isEssential;
    private String partType;
    private String notes;
}
