package com.rental.divine_costume.controller;

import com.rental.divine_costume.dto.requestdto.*;
import com.rental.divine_costume.dto.responsedto.*;
import com.rental.divine_costume.messageResponse.MessageResponse;
import com.rental.divine_costume.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ItemController {

    private final ItemService itemService;

    @PostMapping("/upload")
    public ResponseEntity<MessageResponse<List<ItemResponseDto>>> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || (!file.getOriginalFilename().endsWith(".xlsx") && !file.getOriginalFilename().endsWith(".xls"))) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(MessageResponse.error(HttpStatus.BAD_REQUEST, "Please upload a valid Excel file (.xlsx or .xls)."));
            }

            List<ItemResponseDto> parsedItems = itemService.parseExcel(file);
            return ResponseEntity.ok(MessageResponse.success(parsedItems, "Excel parsed successfully."));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing Excel: " + e.getMessage()));
        }
    }

    @PostMapping("/add-full")
    public ItemResponseDto addFullCostume(@RequestBody ItemRequestDto requestDto) {
        return itemService.addFullCostume(requestDto);
    }

    @RequestMapping(value = "/update-full/{costumeId}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<MessageResponse<ItemResponseDto>> updateFullCostume(
            @PathVariable Long costumeId,
            @RequestBody ItemRequestDto requestDto) {
        try {
            ItemResponseDto updated = itemService.updateFullCostume(costumeId, requestDto);
            return ResponseEntity.ok(MessageResponse.success(updated, "Full costume updated successfully. Only provided fields were updated."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ItemResponseDto>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllCostumeDetails());
    }

    // ========== CATEGORY ENDPOINTS ==========
    
    @RequestMapping(value = "/category/{id}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<MessageResponse<CostumeCategoryResponseDto>> updateCategory(
            @PathVariable Long id,
            @RequestBody CostumeCategoryRequestDto dto) {
        try {
            CostumeCategoryResponseDto updated = itemService.updateCategory(id, dto);
            return ResponseEntity.ok(MessageResponse.success(updated, "Category updated successfully. Only provided fields were updated."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @PutMapping("/category/update-all")
    public ResponseEntity<MessageResponse<List<CostumeCategoryResponseDto>>> updateAllCategories(
            @RequestBody Map<Long, CostumeCategoryRequestDto> updates) {
        try {
            List<CostumeCategoryResponseDto> updated = itemService.updateAllCategories(updates);
            return ResponseEntity.ok(MessageResponse.success(updated, "All categories updated successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating categories: " + e.getMessage()));
        }
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<MessageResponse<String>> deleteCategory(@PathVariable Long id) {
        try {
            itemService.deleteCategory(id);
            return ResponseEntity.ok(MessageResponse.success("Category with ID " + id + " has been deleted.", "Category deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @DeleteMapping("/category/delete-all")
    public ResponseEntity<MessageResponse<String>> deleteAllCategories() {
        try {
            itemService.deleteAllCategories();
            return ResponseEntity.ok(MessageResponse.success("All categories have been deleted.", "All categories deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting categories: " + e.getMessage()));
        }
    }

    // ========== VARIANT ENDPOINTS ==========

    @RequestMapping(value = "/variant/{id}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<MessageResponse<CostumeVariantResponseDto>> updateVariant(
            @PathVariable Long id,
            @RequestBody CostumeVariantRequestDto dto) {
        try {
            CostumeVariantResponseDto updated = itemService.updateVariant(id, dto);
            return ResponseEntity.ok(MessageResponse.success(updated, "Variant updated successfully. Only provided fields were updated."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @PutMapping("/variant/update-all")
    public ResponseEntity<MessageResponse<List<CostumeVariantResponseDto>>> updateAllVariants(
            @RequestBody Map<Long, CostumeVariantRequestDto> updates) {
        try {
            List<CostumeVariantResponseDto> updated = itemService.updateAllVariants(updates);
            return ResponseEntity.ok(MessageResponse.success(updated, "All variants updated successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating variants: " + e.getMessage()));
        }
    }

    @DeleteMapping("/variant/{id}")
    public ResponseEntity<MessageResponse<String>> deleteVariant(@PathVariable Long id) {
        try {
            itemService.deleteVariant(id);
            return ResponseEntity.ok(MessageResponse.success("Variant with ID " + id + " has been deleted.", "Variant deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @DeleteMapping("/variant/delete-all")
    public ResponseEntity<MessageResponse<String>> deleteAllVariants() {
        try {
            itemService.deleteAllVariants();
            return ResponseEntity.ok(MessageResponse.success("All variants have been deleted.", "All variants deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting variants: " + e.getMessage()));
        }
    }

    // ========== COSTUME ENDPOINTS ==========

    @RequestMapping(value = "/costume/{id}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<MessageResponse<CostumeResponseDto>> updateCostume(
            @PathVariable Long id,
            @RequestBody CostumeRequestDto dto) {
        try {
            CostumeResponseDto updated = itemService.updateCostume(id, dto);
            return ResponseEntity.ok(MessageResponse.success(updated, "Costume updated successfully. Only provided fields were updated."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @PutMapping("/costume/update-all")
    public ResponseEntity<MessageResponse<List<CostumeResponseDto>>> updateAllCostumes(
            @RequestBody Map<Long, CostumeRequestDto> updates) {
        try {
            List<CostumeResponseDto> updated = itemService.updateAllCostumes(updates);
            return ResponseEntity.ok(MessageResponse.success(updated, "All costumes updated successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating costumes: " + e.getMessage()));
        }
    }

    @DeleteMapping("/costume/{id}")
    public ResponseEntity<MessageResponse<String>> deleteCostume(@PathVariable Long id) {
        try {
            itemService.deleteCostume(id);
            return ResponseEntity.ok(MessageResponse.success("Costume with ID " + id + " has been deleted.", "Costume deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @DeleteMapping("/costume/delete-all")
    public ResponseEntity<MessageResponse<String>> deleteAllCostumes() {
        try {
            itemService.deleteAllCostumes();
            return ResponseEntity.ok(MessageResponse.success("All costumes have been deleted.", "All costumes deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting costumes: " + e.getMessage()));
        }
    }

    // ========== ITEM ENDPOINTS ==========

    @RequestMapping(value = "/item/{id}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<MessageResponse<CostumeItemResponseDto>> updateItem(
            @PathVariable Long id,
            @RequestBody CostumeItemRequestDto dto) {
        try {
            CostumeItemResponseDto updated = itemService.updateItem(id, dto);
            return ResponseEntity.ok(MessageResponse.success(updated, "Item updated successfully. Only provided fields were updated."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @PutMapping("/item/update-all")
    public ResponseEntity<MessageResponse<List<CostumeItemResponseDto>>> updateAllItems(
            @RequestBody Map<Long, CostumeItemRequestDto> updates) {
        try {
            List<CostumeItemResponseDto> updated = itemService.updateAllItems(updates);
            return ResponseEntity.ok(MessageResponse.success(updated, "All items updated successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating items: " + e.getMessage()));
        }
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<MessageResponse<String>> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok(MessageResponse.success("Item with ID " + id + " has been deleted.", "Item deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @DeleteMapping("/item/delete-all")
    public ResponseEntity<MessageResponse<String>> deleteAllItems() {
        try {
            itemService.deleteAllItems();
            return ResponseEntity.ok(MessageResponse.success("All items have been deleted.", "All items deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting items: " + e.getMessage()));
        }
    }

    // ========== IMAGE ENDPOINTS ==========

    @RequestMapping(value = "/image/{id}", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<MessageResponse<CostumeImageResponseDto>> updateImage(
            @PathVariable Long id,
            @RequestBody CostumeImageRequestDto dto) {
        try {
            CostumeImageResponseDto updated = itemService.updateImage(id, dto);
            return ResponseEntity.ok(MessageResponse.success(updated, "Image updated successfully. Only provided fields were updated."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @PutMapping("/image/update-all")
    public ResponseEntity<MessageResponse<List<CostumeImageResponseDto>>> updateAllImages(
            @RequestBody Map<Long, CostumeImageRequestDto> updates) {
        try {
            List<CostumeImageResponseDto> updated = itemService.updateAllImages(updates);
            return ResponseEntity.ok(MessageResponse.success(updated, "All images updated successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating images: " + e.getMessage()));
        }
    }

    @DeleteMapping("/image/{id}")
    public ResponseEntity<MessageResponse<String>> deleteImage(@PathVariable Long id) {
        try {
            itemService.deleteImage(id);
            return ResponseEntity.ok(MessageResponse.success("Image with ID " + id + " has been deleted.", "Image deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    @DeleteMapping("/image/delete-all")
    public ResponseEntity<MessageResponse<String>> deleteAllImages() {
        try {
            itemService.deleteAllImages();
            return ResponseEntity.ok(MessageResponse.success("All images have been deleted.", "All images deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting images: " + e.getMessage()));
        }
    }
}
