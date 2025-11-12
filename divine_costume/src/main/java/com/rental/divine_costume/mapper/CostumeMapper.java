package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.requestdto.CostumeRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeResponseDto;
import com.rental.divine_costume.entity.items.Costume;
import com.rental.divine_costume.entity.items.CostumeVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CostumeMapper {

    // Fix: use expression to build nested entity manually
    @Mapping(target = "costumeVariant", expression = "java(toCostumeVariant(dto.getCostumeVariantId()))")
    Costume toEntity(CostumeRequestDto dto);

    @Mapping(source = "costumeVariant.id", target = "costumeVariantId")
    CostumeResponseDto toResponseDto(Costume entity);

    // Helper for nested mapping
    default CostumeVariant toCostumeVariant(Long costumeVariantId) {
        if (costumeVariantId == null) return null;
        CostumeVariant variant = new CostumeVariant();
        variant.setId(costumeVariantId);
        return variant;
    }
}
