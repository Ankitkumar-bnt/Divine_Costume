package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.requestdto.*;
import com.rental.divine_costume.dto.responsedto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ItemService {

    // ---------- CATEGORY ----------
    CostumeCategoryResponseDto addCategory(CostumeCategoryRequestDto dto);
    List<CostumeCategoryResponseDto> getAllCategories();
    CostumeCategoryResponseDto updateCategory(Long id, CostumeCategoryRequestDto dto);
    List<CostumeCategoryResponseDto> updateAllCategories(Map<Long, CostumeCategoryRequestDto> updates);
    void deleteCategory(Long id);
    void deleteAllCategories();

    // ---------- VARIANT ----------
    CostumeVariantResponseDto addVariant(CostumeVariantRequestDto dto);
    List<CostumeVariantResponseDto> getAllVariants();
    CostumeVariantResponseDto updateVariant(Long id, CostumeVariantRequestDto dto);
    List<CostumeVariantResponseDto> updateAllVariants(Map<Long, CostumeVariantRequestDto> updates);
    void deleteVariant(Long id);
    void deleteAllVariants();

    // ---------- COSTUME ----------
    CostumeResponseDto addCostume(CostumeRequestDto dto);
    List<CostumeResponseDto> getAllCostumes();
    CostumeResponseDto updateCostume(Long id, CostumeRequestDto dto);
    List<CostumeResponseDto> updateAllCostumes(Map<Long, CostumeRequestDto> updates);
    void deleteCostume(Long id);
    void deleteAllCostumes();

    // ---------- ITEM ----------
    CostumeItemResponseDto addItem(CostumeItemRequestDto dto);
    List<CostumeItemResponseDto> getAllItems();
    CostumeItemResponseDto updateItem(Long id, CostumeItemRequestDto dto);
    List<CostumeItemResponseDto> updateAllItems(Map<Long, CostumeItemRequestDto> updates);
    void deleteItem(Long id);
    void deleteAllItems();

    // ---------- IMAGE ----------
    CostumeImageResponseDto addImage(CostumeImageRequestDto dto);
    List<CostumeImageResponseDto> getAllImages();
    CostumeImageResponseDto updateImage(Long id, CostumeImageRequestDto dto);
    List<CostumeImageResponseDto> updateAllImages(Map<Long, CostumeImageRequestDto> updates);
    void deleteImage(Long id);
    void deleteAllImages();

    ItemResponseDto updateFullCostume(Long costumeId, ItemRequestDto requestDto);

    // ---------- FULL RESPONSE (JOINED) ----------
    List<ItemResponseDto> getAllCostumeDetails();

    ItemResponseDto addFullCostume(ItemRequestDto requestDto);

    List<ItemResponseDto> parseExcel(MultipartFile file) throws Exception;

    // ---------- UTIL ----------
    Integer getNextSerialNumber(String categoryName, String primaryColor, String secondaryColor, String tertiaryColor, String size);

}
