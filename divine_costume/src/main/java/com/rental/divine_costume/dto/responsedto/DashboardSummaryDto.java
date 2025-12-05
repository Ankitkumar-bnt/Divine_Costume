package com.rental.divine_costume.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    
    // Overall Counts
    private Long totalCategories;
    private Long totalVariants;
    private Long totalCostumes;
    private Long availableCostumes;
    private Long rentedCostumes;
    
    // Financial Summary
    private BigDecimal totalInventoryValue;
    private BigDecimal totalPotentialMonthlyRevenue;
    
    // Top Performers
    private Map<String, Long> topCategoriesByCostumes; // Category name -> count
    private Map<String, Long> topVariantsByCostumes; // Variant description -> count
    
    // Size Distribution
    private Map<String, Long> sizeDistribution; // Size -> count
    
    // Availability Metrics
    private Double overallUtilizationRate;
    private Long lowStockVariants; // Variants with less than 5 available costumes
    
    // Color Distribution
    private Map<String, Long> colorDistribution; // Primary color -> count
}
