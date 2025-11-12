package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.requestdto.CostumeImageRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeImageResponseDto;
import com.rental.divine_costume.entity.items.CostumeImage;
import com.rental.divine_costume.entity.items.CostumeVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CostumeImageMapper {

    // Create CostumeVariant manually and set its id
    @Mapping(target = "costumeVariant", expression = "java(toCostumeVariant(dto.getCostumeVariantId()))")
    CostumeImage toEntity(CostumeImageRequestDto dto);

    @Mapping(source = "costumeVariant.id", target = "costumeVariantId")
    CostumeImageResponseDto toResponseDto(CostumeImage entity);

    // Helper method for MapStruct
    default CostumeVariant toCostumeVariant(Long costumeVariantId) {
        if (costumeVariantId == null) return null;
        CostumeVariant variant = new CostumeVariant();
        variant.setId(costumeVariantId);
        return variant;
    }
}
