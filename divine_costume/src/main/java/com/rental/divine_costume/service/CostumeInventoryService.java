package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.requestdto.CostumePartRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeInventoryResponseDto;
import com.rental.divine_costume.entity.items.CostumeCategory;
import com.rental.divine_costume.entity.items.CostumeVariant;

import java.util.List;
import java.util.Map;

public interface CostumeInventoryService {
    
    // Category operations
    List<CostumeCategory> getAllCategories();
    
    // Variant operations
    List<CostumeVariant> getVariantsByCategory(Long categoryId);
    
    // Size operations
    List<String> getSizesByVariant(Long variantId);
    Map<String, Long> getSizeCountsByVariant(Long variantId);
    
    // Inventory operations
    List<CostumeInventoryResponseDto> getInventoryByCategory(Long categoryId);
    List<CostumeInventoryResponseDto> getInventoryByVariant(Long variantId);
    List<CostumeInventoryResponseDto> getInventoryByVariantAndSize(Long variantId, String size);
    
    // Count operations
    Long getAvailableCount(Long variantId, String size);
    void updateInventoryCount(Long costumeId, Integer newCount);
    
    // Costume parts operations
    Long addCostumePart(CostumePartRequestDto requestDto);
    void removeCostumePart(Long partId);
    
    // Serial number operations
    List<String> getSerialNumbersByVariantAndSize(Long variantId, String size);
}
