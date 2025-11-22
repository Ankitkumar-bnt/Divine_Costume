package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.requestdto.CostumeItemRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeItemResponseDto;
import com.rental.divine_costume.entity.items.CostumeItem;
import com.rental.divine_costume.entity.items.Costume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CostumeItemMapper {

    // Fix: Build nested Costume manually
    @Mapping(target = "costume", expression = "java(toCostume(dto.getCostumeId()))")
    CostumeItem toEntity(CostumeItemRequestDto dto);

    @Mapping(source = "costume.id", target = "costumeId")
    CostumeItemResponseDto toResponseDto(CostumeItem entity);

    // Helper method for nested mapping
    default Costume toCostume(Long costumeId) {
        if (costumeId == null) return null;
        Costume costume = new Costume();
        costume.setId(costumeId);
        return costume;
    }
}
