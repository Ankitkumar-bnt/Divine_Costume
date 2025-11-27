package com.rental.divine_costume.dto.responsedto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumeInventoryResponseDto {
    private Long id;
    private String categoryName;
    private String variantDescription;
    private String size;
    private Integer count;
    private String imageUrl;
    private List<String> serialNumbers;
    private String style;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;
}
