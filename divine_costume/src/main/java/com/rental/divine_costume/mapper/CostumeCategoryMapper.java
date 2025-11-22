package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.requestdto.CostumeCategoryRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeCategoryResponseDto;
import com.rental.divine_costume.entity.items.CostumeCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CostumeCategoryMapper {
    CostumeCategory toEntity(CostumeCategoryRequestDto dto);
    CostumeCategoryResponseDto toResponseDto(CostumeCategory entity);
}
