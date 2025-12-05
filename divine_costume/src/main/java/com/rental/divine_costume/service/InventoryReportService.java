package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.responsedto.CategoryReportDto;
import com.rental.divine_costume.dto.responsedto.DashboardSummaryDto;
import com.rental.divine_costume.dto.responsedto.InventoryReportDto;

import java.util.List;

public interface InventoryReportService {
    
    /**
     * Get inventory report grouped by variant
     * Shows total count, available count, and financial metrics for each variant
     */
    List<InventoryReportDto> getInventoryByVariant();
    
    /**
     * Get inventory report grouped by variant and size
     * Shows detailed breakdown by size for each variant
     */
    List<InventoryReportDto> getInventoryByVariantAndSize();
    
    /**
     * Get inventory report for a specific variant
     */
    List<InventoryReportDto> getInventoryByVariantId(Long variantId);
    
    /**
     * Get category-level report
     * Shows aggregated statistics for each category
     */
    List<CategoryReportDto> getCategoryReport();
    
    /**
     * Get category report for a specific category
     */
    CategoryReportDto getCategoryReportById(Long categoryId);
    
    /**
     * Get dashboard summary with overall statistics
     */
    DashboardSummaryDto getDashboardSummary();
    
    /**
     * Get low stock report
     * Returns variants with available count below threshold
     */
    List<InventoryReportDto> getLowStockReport(Integer threshold);
    
    /**
     * Get high value inventory report
     * Returns costumes sorted by inventory value
     */
    List<InventoryReportDto> getHighValueInventory(Integer limit);
}
