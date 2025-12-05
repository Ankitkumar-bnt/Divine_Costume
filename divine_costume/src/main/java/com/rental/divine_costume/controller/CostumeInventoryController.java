package com.rental.divine_costume.controller;

import com.rental.divine_costume.dto.requestdto.CostumePartRequestDto;
import com.rental.divine_costume.dto.requestdto.ItemRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeInventoryResponseDto;
import com.rental.divine_costume.entity.items.CostumeCategory;
import com.rental.divine_costume.entity.items.CostumeVariant;
import com.rental.divine_costume.service.CostumeInventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/costume-inventory")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CostumeInventoryController {

    private final CostumeInventoryService costumeInventoryService;

    @GetMapping("/categories")
    public ResponseEntity<List<CostumeCategory>> getAllCategories() {
        log.info("GET /api/costume-inventory/categories - Fetching all categories");
        try {
            List<CostumeCategory> categories = costumeInventoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error fetching categories: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/variants/category/{categoryId}")
    public ResponseEntity<List<CostumeVariant>> getVariantsByCategory(@PathVariable Long categoryId) {
        log.info("GET /api/costume-inventory/variants/category/{} - Fetching variants by category", categoryId);
        try {
            List<CostumeVariant> variants = costumeInventoryService.getVariantsByCategory(categoryId);
            return ResponseEntity.ok(variants);
        } catch (Exception e) {
            log.error("Error fetching variants for category {}: ", categoryId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sizes/variant/{variantId}")
    public ResponseEntity<List<String>> getSizesByVariant(@PathVariable Long variantId) {
        log.info("GET /api/costume-inventory/sizes/variant/{} - Fetching sizes by variant", variantId);
        try {
            List<String> sizes = costumeInventoryService.getSizesByVariant(variantId);
            return ResponseEntity.ok(sizes);
        } catch (Exception e) {
            log.error("Error fetching sizes for variant {}: ", variantId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/size-counts/variant/{variantId}")
    public ResponseEntity<Map<String, Long>> getSizeCountsByVariant(@PathVariable Long variantId) {
        log.info("GET /api/costume-inventory/size-counts/variant/{} - Fetching size counts by variant", variantId);
        try {
            Map<String, Long> sizeCounts = costumeInventoryService.getSizeCountsByVariant(variantId);
            return ResponseEntity.ok(sizeCounts);
        } catch (Exception e) {
            log.error("Error fetching size counts for variant {}: ", variantId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/inventory/category/{categoryId}")
    public ResponseEntity<List<CostumeInventoryResponseDto>> getInventoryByCategory(@PathVariable Long categoryId) {
        log.info("GET /api/costume-inventory/inventory/category/{} - Fetching inventory by category", categoryId);
        try {
            List<CostumeInventoryResponseDto> inventory = costumeInventoryService.getInventoryByCategory(categoryId);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            log.error("Error fetching inventory for category {}: ", categoryId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/inventory/variant/{variantId}")
    public ResponseEntity<List<CostumeInventoryResponseDto>> getInventoryByVariant(@PathVariable Long variantId) {
        log.info("GET /api/costume-inventory/inventory/variant/{} - Fetching inventory by variant", variantId);
        try {
            List<CostumeInventoryResponseDto> inventory = costumeInventoryService.getInventoryByVariant(variantId);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            log.error("Error fetching inventory for variant {}: ", variantId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/inventory/variant/{variantId}/size/{size}")
    public ResponseEntity<List<CostumeInventoryResponseDto>> getInventoryByVariantAndSize(
            @PathVariable Long variantId, 
            @PathVariable String size) {
        log.info("GET /api/costume-inventory/inventory/variant/{}/size/{} - Fetching inventory by variant and size", variantId, size);
        try {
            List<CostumeInventoryResponseDto> inventory = costumeInventoryService.getInventoryByVariantAndSize(variantId, size);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            log.error("Error fetching inventory for variant {} and size {}: ", variantId, size, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/variant/{variantId}/size/{size}")
    public ResponseEntity<Long> getAvailableCount(@PathVariable Long variantId, @PathVariable String size) {
        log.info("GET /api/costume-inventory/count/variant/{}/size/{} - Fetching available count", variantId, size);
        try {
            Long count = costumeInventoryService.getAvailableCount(variantId, size);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error fetching count for variant {} and size {}: ", variantId, size, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/inventory/{costumeId}/count/{newCount}")
    public ResponseEntity<Void> updateInventoryCount(@PathVariable Long costumeId, @PathVariable Integer newCount) {
        log.info("PUT /api/costume-inventory/inventory/{}/count/{} - Updating inventory count", costumeId, newCount);
        try {
            costumeInventoryService.updateInventoryCount(costumeId, newCount);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("Error updating inventory count for costume {}: ", costumeId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error updating inventory count for costume {}: ", costumeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/serial-numbers/variant/{variantId}/size/{size}")
    public ResponseEntity<List<String>> getSerialNumbersByVariantAndSize(
            @PathVariable Long variantId, 
            @PathVariable String size) {
        log.info("GET /api/costume-inventory/serial-numbers/variant/{}/size/{} - Fetching serial numbers", variantId, size);
        try {
            List<String> serialNumbers = costumeInventoryService.getSerialNumbersByVariantAndSize(variantId, size);
            return ResponseEntity.ok(serialNumbers);
        } catch (Exception e) {
            log.error("Error fetching serial numbers for variant {} and size {}: ", variantId, size, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/costume-parts")
    public ResponseEntity<Long> addCostumePart(@RequestBody CostumePartRequestDto requestDto) {
        log.info("POST /api/costume-inventory/costume-parts - Adding costume part for costume ID: {}", requestDto.getParentCostumeId());
        try {
            Long partId = costumeInventoryService.addCostumePart(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(partId);
        } catch (RuntimeException e) {
            log.error("Error adding costume part: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error adding costume part: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/costume-parts/{partId}")
    public ResponseEntity<Void> removeCostumePart(@PathVariable Long partId) {
        log.info("DELETE /api/costume-inventory/costume-parts/{} - Removing costume part", partId);
        try {
            costumeInventoryService.removeCostumePart(partId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("Error removing costume part {}: ", partId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error removing costume part {}: ", partId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/duplicate/{costumeId}")
    public ResponseEntity<Long> duplicateCostume(
            @PathVariable Long costumeId,
            @RequestParam Integer count) {
        log.info("POST /api/costume-inventory/duplicate/{} - Duplicating costume with count: {}", costumeId, count);
        try {
            Long createdCount = costumeInventoryService.duplicateCostume(costumeId, count);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCount);
        } catch (RuntimeException e) {
            log.error("Error duplicating costume {}: ", costumeId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error duplicating costume {}: ", costumeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/batch-add")
    public ResponseEntity<Long> addCostumesBatch(
            @RequestBody ItemRequestDto itemRequestDto,
            @RequestParam Integer count) {
        log.info("POST /api/costume-inventory/batch-add - Adding costumes in batch with count: {}", count);
        System.out.println("======================= "+ itemRequestDto);
        try {
            Long createdCount = costumeInventoryService.addCostumesBatch(itemRequestDto, count);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCount);
        } catch (RuntimeException e) {
            log.error("Error adding costumes in batch: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error adding costumes in batch: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
