package com.rental.divine_costume.controller;

import com.rental.divine_costume.dto.responsedto.CategoryReportDto;
import com.rental.divine_costume.dto.responsedto.DashboardSummaryDto;
import com.rental.divine_costume.dto.responsedto.InventoryReportDto;
import com.rental.divine_costume.messageResponse.MessageResponse;
import com.rental.divine_costume.service.InventoryReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/item/report")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ItemReportController {

    private final InventoryReportService reportService;

    /**
     * Get dashboard summary with overall statistics
     * GET /item/report/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<MessageResponse<DashboardSummaryDto>> getDashboardSummary() {
        try {
            DashboardSummaryDto summary = reportService.getDashboardSummary();
            return ResponseEntity.ok(MessageResponse.success(summary, "Dashboard summary retrieved successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating dashboard summary: " + e.getMessage()));
        }
    }

    /**
     * Get inventory report grouped by variant
     * Shows total count, available count, and financial metrics for each variant
     * GET /item/report/inventory/by-variant
     */
    @GetMapping("/inventory/by-variant")
    public ResponseEntity<MessageResponse<List<InventoryReportDto>>> getInventoryByVariant() {
        try {
            List<InventoryReportDto> reports = reportService.getInventoryByVariant();
            return ResponseEntity.ok(MessageResponse.success(reports, "Inventory report by variant retrieved successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating inventory report: " + e.getMessage()));
        }
    }

    /**
     * Get inventory report grouped by variant and size
     * Shows detailed breakdown by size for each variant
     * GET /item/report/inventory/by-variant-size
     */
    @GetMapping("/inventory/by-variant-size")
    public ResponseEntity<MessageResponse<List<InventoryReportDto>>> getInventoryByVariantAndSize() {
        try {
            List<InventoryReportDto> reports = reportService.getInventoryByVariantAndSize();
            return ResponseEntity.ok(MessageResponse.success(reports, "Inventory report by variant and size retrieved successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating inventory report: " + e.getMessage()));
        }
    }

    /**
     * Get inventory report for a specific variant
     * GET /item/report/inventory/variant/{variantId}
     */
    @GetMapping("/inventory/variant/{variantId}")
    public ResponseEntity<MessageResponse<List<InventoryReportDto>>> getInventoryByVariantId(@PathVariable Long variantId) {
        try {
            List<InventoryReportDto> reports = reportService.getInventoryByVariantId(variantId);
            return ResponseEntity.ok(MessageResponse.success(reports, "Inventory report for variant retrieved successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating inventory report: " + e.getMessage()));
        }
    }

    /**
     * Get category-level report
     * Shows aggregated statistics for each category
     * GET /item/report/category
     */
    @GetMapping("/category")
    public ResponseEntity<MessageResponse<List<CategoryReportDto>>> getCategoryReport() {
        try {
            List<CategoryReportDto> reports = reportService.getCategoryReport();
            return ResponseEntity.ok(MessageResponse.success(reports, "Category report retrieved successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating category report: " + e.getMessage()));
        }
    }

    /**
     * Get category report for a specific category
     * GET /item/report/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<MessageResponse<CategoryReportDto>> getCategoryReportById(@PathVariable Long categoryId) {
        try {
            CategoryReportDto report = reportService.getCategoryReportById(categoryId);
            return ResponseEntity.ok(MessageResponse.success(report, "Category report retrieved successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating category report: " + e.getMessage()));
        }
    }

    /**
     * Get low stock report
     * Returns variants with available count below threshold
     * GET /item/report/low-stock?threshold=5
     */
    @GetMapping("/low-stock")
    public ResponseEntity<MessageResponse<List<InventoryReportDto>>> getLowStockReport(
            @RequestParam(required = false, defaultValue = "5") Integer threshold) {
        try {
            List<InventoryReportDto> reports = reportService.getLowStockReport(threshold);
            return ResponseEntity.ok(MessageResponse.success(reports, "Low stock report retrieved successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating low stock report: " + e.getMessage()));
        }
    }

    /**
     * Get high value inventory report
     * Returns costumes sorted by inventory value
     * GET /item/report/high-value?limit=10
     */
    @GetMapping("/high-value")
    public ResponseEntity<MessageResponse<List<InventoryReportDto>>> getHighValueInventory(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        try {
            List<InventoryReportDto> reports = reportService.getHighValueInventory(limit);
            return ResponseEntity.ok(MessageResponse.success(reports, "High value inventory report retrieved successfully."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MessageResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating high value inventory report: " + e.getMessage()));
        }
    }
}
