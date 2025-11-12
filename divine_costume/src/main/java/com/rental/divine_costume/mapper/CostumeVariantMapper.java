package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.requestdto.CostumeVariantRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeVariantResponseDto;
import com.rental.divine_costume.entity.items.CostumeVariant;
import com.rental.divine_costume.entity.items.CostumeCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CostumeVariantMapper {

    // Manually convert categoryId -> CostumeCategory
    @Mapping(target = "category", expression = "java(toCostumeCategory(dto.getCategoryId()))")
    CostumeVariant toEntity(CostumeVariantRequestDto dto);

    // Reverse mapping
    @Mapping(source = "category.id", target = "categoryId")
    CostumeVariantResponseDto toResponseDto(CostumeVariant entity);

    // Helper method that MapStruct will call
    default CostumeCategory toCostumeCategory(Long categoryId) {
        if (categoryId == null) return null;
        CostumeCategory category = new CostumeCategory();
        category.setId(categoryId);
        return category;
    }
}
