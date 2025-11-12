package com.rental.divine_costume.dto.requestdto;

import lombok.Data;

import java.util.List;

@Data
public class ItemRequestDto {
    private CostumeCategoryRequestDto category;
    private CostumeVariantRequestDto variant;
    private CostumeRequestDto costume;
    private List<CostumeItemRequestDto> items;
    private List<CostumeImageRequestDto> images;
}
