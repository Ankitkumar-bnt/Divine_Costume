package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.responsedto.ItemResponseDto;
import com.rental.divine_costume.entity.items.Costume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    @Mapping(source = "costumeVariant.category.id", target = "categoryId")
    @Mapping(source = "costumeVariant.category.categoryName", target = "categoryName")
    @Mapping(source = "costumeVariant.category.categoryDescription", target = "categoryDescription")
    @Mapping(source = "costumeVariant.id", target = "variantId")
    @Mapping(source = "costumeVariant.variantDescription", target = "variantDescription")
    @Mapping(source = "costumeVariant.style", target = "style")
    @Mapping(source = "costumeVariant.primaryColor", target = "primaryColor")
    @Mapping(source = "costumeVariant.secondaryColor", target = "secondaryColor")
    @Mapping(source = "costumeVariant.tertiaryColor", target = "tertiaryColor")
    ItemResponseDto toItemDto(Costume costume);
}
